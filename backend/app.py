from crypt import methods
import json
from sqlite3 import Cursor
from crypt import methods
from email import message
from unittest import result
from flask_mail import Mail, Message
from flask import Flask, jsonify, request
from flaskext.mysql import MySQL
from datetime import datetime
from flask_cors import CORS
from pymysql.cursors import DictCursor
from dotenv import load_dotenv
import os,smtplib
import random as rd
import geopy.geocoders
from geopy.geocoders import Nominatim
import certifi
import ssl
import string

load_dotenv()
api = Flask(__name__)
cors = CORS(api)
mysql = MySQL(cursorclass=DictCursor)

#mysql configuration
api.config['MYSQL_DATABASE_USER'] = os.getenv('MYSQL_DATABASE_USER')
api.config['MYSQL_DATABASE_PASSWORD'] = os.getenv('MYSQL_DATABASE_PASSWORD')
api.config['MYSQL_DATABASE_DB'] = os.getenv('MYSQL_DATABASE_DB')
api.config['MYSQL_DATABASE_HOST'] = os.getenv('MYSQL_DATABASE_HOST')

# #email configuration
api.config['MAIL_SERVER']= os.getenv('MAIL_SERVER')
api.config['MAIL_PORT'] = os.getenv('MAIL_PORT')
api.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
api.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
api.config['MAIL_USE_TLS'] = False
api.config['MAIL_USE_SSL'] = True

mail = Mail(api)
mysql.init_app(api)

def lat_lon(address):
    ctx = ssl.create_default_context(cafile=certifi.where())
    geopy.geocoders.options.default_ssl_context = ctx
    geolocator = Nominatim(user_agent="myGeocoder")
    location = geolocator.geocode(address)
    return {"lat":location.latitude,"lon":location.longitude}

def generate_otp():
  otp = 0
  for _ in range(6):
    otp = rd.randint(1,9)+(otp*10)
  return otp

def send_email(message, email_id,subject):
    smtpserver = smtplib.SMTP(api.config['MAIL_SERVER'], 587)
    smtpserver.ehlo()
    smtpserver.starttls()
    smtpserver.ehlo()
    smtpserver.login(api.config['MAIL_USERNAME'], api.config['MAIL_PASSWORD'])
    print(email_id)
    msg = Message(subject, sender = api.config['MAIL_USERNAME'], recipients = [email_id])
    msg.html = message
    mail.send(msg)
    return "Message sent!"

def generate_trackingId():
    trackingId = ''.join([rd.choice(string.ascii_letters+ string.digits) for n in range(32)])
    return trackingId

def db_connect():
    conn = mysql.connect()
    conn.autocommit(True)
    cursor = conn.cursor()
    return conn,cursor

def generateUserId(firstname, lastname):
    conn,cursor = db_connect()
    userid = (firstname[:3]+lastname[-3:]).lower()
    cursor.execute("SELECT * from USERS where userid = %s",(userid))
    data = cursor.fetchall()
    if data:
        for i in range(len(firstname)):
            userid = (firstname[i]+lastname[:5]).lower()
            cursor.execute("SELECT * from USERS where userid = %s",(userid))
            data = cursor.fetchall()
            if len(data) == 0:
                conn.close()
                return userid
    else:
        conn.close()
        return userid

@api.route('/')
@api.route('/profile')
def my_profile():
    response_body = {
        "name": "Nile",
        "about" :"This is my login page"
    }
    return response_body


@api.route('/register',methods =['GET', 'POST'])
def register():
    # print("Here")
    try:
        if request.method == 'POST':
            timestamp = datetime.now()
            userid = generateUserId(request.json['firstname'],request.json['lastname'])
            conn,cursor = db_connect()
            cursor.execute("SELECT * FROM USERS where Username = %s",(request.json['email']))
            data = cursor.fetchall()
            if data:
                conn.close()
                return jsonify({'response':205,'message': 'User already exists. Please login!'}),205
            else:
                # print(username,password)
                cursor.execute("INSERT INTO USERS(FirstName,LastName,Username,Password,Role,TimeStamp,UserId,SecurityQuestion,Answer) VALUES(%s, %s,%s,%s,%s,%s,%s,%s,%s)",
                (request.json['firstname'],request.json['lastname'],request.json['email'],request.json['password'],request.json['role'],timestamp,userid,request.json['securityquestion'],request.json['answer']))
                if request.json['role'] in ('Admin', 'Driver'):
                    cursor.execute("INSERT INTO EMPLOYEES(FullName,Role,email,Available) VALUES(%s,%s,%s,%s)",(request.json['firstname']+" "+request.json['lastname'], request.json['role'],request.json['email'],"Yes"))
                cursor.close()
                message = "<p>"+"Dear "+request.json['firstname']+","+"<br><br>"+"Welcome to Nile Delivery Service!. Your Username/Userid is <b>"+userid+"</b></p>"
                send_email(message,request.json['email'],"Welcome!")
                conn.close()
                return jsonify({'response':200,'userid':userid,'message' : 'User registered successfully'}),200
    except Exception as e:
        return jsonify(e)


@api.route('/login',methods = ['POST'])
def login():
    try:
        if request.method == 'POST':
            username = request.json['email']
            password = request.json['password']
            conn,cursor = db_connect()
            cursor.execute("SELECT * FROM USERS where username = %s or userid = %s",(username,username))
            data = cursor.fetchall()
            # print(data)
            if data:
                cursor.execute("SELECT * FROM USERS where (username = %s OR userid = %s) AND password = %s",(username,username,password))
                data = cursor.fetchall()
                cursor.close()
                if data:
                    data =data.pop()
                    data['role'] = data['Role']
                    username = data['Username']
                    data['msg'] = "User exists"
                    data['username'] = username
                    data['response'] = 200
                    otp = generate_otp()
                    data['otp'] = otp
                    message = "<p>"+"Dear "+username+","+"<br><br>"+"Welcome to Nile Delivery Service!. Your OTP for login is <b>"+str(otp)+"</b></p>"
                    send_email(message,username,"Login OTP!")
                    conn.close()
                    return data
                else:
                    conn.close()
                    return jsonify({'response':205,'message': 'Password is Wrong'})
            else:
                conn.close()
                return jsonify({'response':205,'message':'User does not exist. Please register!'})
    except Exception as e:
        return jsonify(e)

@api.route('/forgotpassword/<string:username>',methods = ['GET','POST'])
def forgotpassword(username):
    if request.method == 'GET':
        conn,cursor = db_connect()
        cursor.execute("SELECT SecurityQuestion from USERS where username = %s OR userid = %s",(username,username))
        data = cursor.fetchall()
        cursor.close()
        if data:
            result = {}
            for row in data:
                result['SecurityQuestion'] = row['SecurityQuestion']
            result['username'] = username
            result['response'] = 200
            conn.close()
            return result
        else:
            conn.close()
            return jsonify({'response':205,'username':username,'msg':'User not exists'})
    elif request.method == 'POST':
        question = request.json['question']
        answer = request.json['answer']
        conn,cursor = db_connect()
        cursor.execute("SELECT * from USERS where username = %s OR userid = %s",(username,username))
        data = cursor.fetchall()
        if data:
            cursor.execute("SELECT * from USERS where (username = %s OR userid = %s) and SecurityQuestion =%s and Answer=%s",(username,username,question,answer))
            data = cursor.fetchall()
            if data:
                conn.close()
                return jsonify({'response':200,'msg':'Answer is correct'})  
            else:
                conn.close()
                return jsonify({'response':205,'msg':'Answer is incorrect'})
        else:
            conn.close()
            return jsonify({'response':205,'msg':'User doesnot exist'})    


@api.route('/updatepassword/<string:username>',methods=['POST'])
def update_password(username):
    try:
        if request.method == 'POST':
            newpassword = request.json['newpassword']
            conn,cursor = db_connect()
            cursor.execute("SELECT * from USERS where username = %s OR userid = %s",(username,username))
            data = cursor.fetchall()
            if data:
                cursor.execute("SELECT * from USERS where (username = %s OR userid = %s) AND password = %s",(username,username, newpassword))
                data = cursor.fetchall()
                print(data)
                if data:
                    cursor.close()
                    conn.close()
                    return jsonify({'response':205,'msg':"You are changing it with the same password"})
                else:
                    cursor.execute("UPDATE USERS set password = %s where username = %s OR userid = %s",(newpassword, username, username))
                    cursor.close()
                    conn.close()
                    return jsonify({'response':200,'username':username,'msg':'Password updated successfully.'})
            else:
                conn.close()
                return jsonify({'response':205,'username':username,'msg':'User not exists'})
    except Exception as e:
        return jsonify(e)

@api.route("/email")
def index():
    return send_email("Welcome to Nile Delivery Service",'harishanker.kande@gmail.com','Welcome!')

@api.route('/searchEmployees',methods=["GET"])
def searchEmployees():
    try:
        conn,cursor = db_connect()
        cursor.execute("SELECT * from Employees")
        data = cursor.fetchall()
        if data:
            conn.close()
            return jsonify(data),200
        else:
            conn.close()
            return jsonify({'message':"No Employees"}),205
    except Exception as e:
        print(e)
        
@api.route('/availableDrivers',methods=["GET"])
def availableDrivers():
    try:
        conn,cursor = db_connect()
        cursor.execute("SELECT * from Employees where available=%s and role='Driver'",("Yes"))
        data = cursor.fetchall()
        if(data):
            conn.close()
            return jsonify(data),200
        else:
            conn.close()
            return jsonify({'message':'No availabe drivers'}),206
    except Exception as e:
        print(e)
        
        
@api.route('/getAllOrders',methods=["GET"])
def getAllOrders():
    try:
        conn,cursor = db_connect()
        cursor.execute("Select * from ORDERS WHERE DeliveryDriver is NULL")
        data = cursor.fetchall()
        if(data):
            conn.close()
            return jsonify(data),200
        else:
            conn.close()
            return jsonify({'message':'No orders'}),207
    except Exception as e:
        print(e)
        
@api.route('/assignDriver',methods=["POST"])
def assignDriver():
    try:
        print(request.json)
        conn,cursor = db_connect()
        cursor.execute("Select * from Orders WHERE OrderId=%s",(request.json['OrderId']))
        data = cursor.fetchall()
        print(data)
        if(data):
            cursor.execute("Update Orders SET DeliveryDriver=%s, Status=%s WHERE OrderId=%s",(request.json['drivername'],"In-Progress",request.json['OrderId']))
            conn.close()
            return jsonify({"message":"Updated Successsfully"}),200
        else:
            conn.close()
            return jsonify({'message':'Failed'}),208
    except Exception as e:
        print(e)
        
@api.route('/getAssignedOrders/<string:driveremail>',methods=["GET"])
def getAssignedOrders(driveremail):
    try:
        conn,cursor = db_connect()
        print(driveremail)
        cursor.execute("select * from Orders o, Employees e WHERE o.DeliveryDriver=e.FullName and email=%s and Status IN('In-Progress','Picked-Up')",(driveremail))
        data = cursor.fetchall()
        if(data):
            conn.close()
            return jsonify(data),200
        else:
            conn.close()
            return jsonify({'message':'No orders'}),205
    except Exception as e:
        print(e)

@api.route('/getAdminDetails',methods = ['GET','POST'])
def getAdminDetails():
    try:
        if request.method == 'GET':
            conn,cursor = db_connect()
            cursor.execute("SELECT * FROM AdminDetails where role=%s and verified is null",('admin'))
            data = cursor.fetchall()
            conn.close()
            return jsonify({'result':data,'status code':200})
    except Exception as e:
        print(e)

@api.route('/deleteAdmin', methods = ['POST'])
def deleteAdmin():
    try:
        if request.method == 'POST':
            username = request.json['username']
            conn,cursor = db_connect()
            cursor.execute("DELETE FROM USERS where username = %s and role = %s",(username,'admin'))
            cursor.close()
            conn.close()
            return jsonify({'msg':'Delete successful'})
    except Exception as e:
        print(e)

@api.route('/verifyAdmin', methods = ['POST'])
def verifyAdmin():
    try:
        if request.method == 'POST':
            username = request.json['username']
            conn,cursor = db_connect()
            print(username)
            cursor.execute("UPDATE AdminDetails set verified = %s where username = %s and role = %s and verified is NULL",('verified',username,'admin'))
            cursor.close()
            conn.close()
            return jsonify({'msg':'Verify successful'})
    except Exception as e:
        print(e)


@api.route("/updateUserProfile/<string:username>",methods=["GET","POST"])
def updateUserProfile(username):
    # print(request.method)
    if request.method == 'GET':
        conn,cursor = db_connect()
        # print(username)
        cursor.execute("SELECT * FROM USERS where username = %s",(username))
        data = cursor.fetchall()
        if data:
            conn.close()
            if len(data)==1:
                data = data.pop()
            return jsonify({'user':data}),200
        else:
            conn.close()
            return jsonify({'response':205,'username':username,'msg':'User not exists'})
    elif request.method == "POST":
        # print("here in post")
        # print(request.json)
        conn,cursor = db_connect()
        cursor.execute("SELECT * FROM USERS where username = %s",(username))
        data = cursor.fetchall()
        # print(data)
        if data:
            if request.json['password'] is None:
                cursor.execute("UPDATE USERS set FirstName = %s, LastName = %s, Username =%s,ProfilePic=%s where username=%s",(request.json['firstname'],request.json['lastname'],request.json['email'],request.json['profilepic'],username))
                conn.close()
                return jsonify({"message":"Update Successful"}),200
            else:
                cursor.execute("UPDATE USERS set FirstName = %s, LastName = %s, Username =%s,Password=%s,ProfilePic=%s where username=%s",(request.json['firstname'],request.json['lastname'],request.json['email'],request.json['password'],request.json['profilepic'],username));
                conn.close()
                return jsonify({"message":"Update Successful"}),200
        else:
            conn.close()
            return jsonify({'response':205,'username':username,'message':'User not exists'})
        
@api.route('/addService',methods=["POST"])
def addService():
    try:
        conn,cursor = db_connect()
        cursor.execute("SELECT * from Deliveryservices where ServiceName = %s",(request.json["name"]))
        data = cursor.fetchall()
        if data:
            conn.close()
            return jsonify({"message":"Service already in database"}),205
        else:
            cursor.execute("INSERT INTO Deliveryservices Values(%s,%s,%s,%s,%s)",(request.json["name"],request.json["price"],request.json["duration"],request.json["description"],request.json["picture"]))
            conn.close()
            return jsonify({"message":"Service Added."}),200
    except Exception as e:
        print(e)

@api.route('/getServices',methods=["GET"])
def getServices():
    try:
        if request.method == 'GET':
            conn,cursor = db_connect()
            cursor.execute("SELECT * from Deliveryservices")
            data = cursor.fetchall()
            if data:
                conn.close()
                return data,200
            else:
                conn.close()
                return jsonify({"message":"No Services Found"}),205
    except Exception as e:
        print(e)

@api.route('/updateServicePrice',methods=["POST"])
def updateServicePrice():
    try:
        if request.method == 'POST':
            conn,cursor = db_connect()
            cursor.execute("SELECT * FROM Deliveryservices where Servicename = %s",(request.json["name"]))
            data = cursor.fetchall()
            if data:
                cursor.execute("UPDATE Deliveryservices set Price=%s where ServiceName = %s",(request.json['price'],request.json["name"]))
                cursor.execute("SELECT * from Deliveryservices")
                data = cursor.fetchall()
                conn.close()
                return data,200
            else:
                conn.close()
                return jsonify({"message":"Delivery Service not found"}),205
    except Exception as e:
        print(e)

@api.route('/getLatLon')
def getLatLon():
    return lat_lon('3435 N Western Ave, Chicago, IL 60618')

@api.route('/getDeliveredOrders')
def getDeliveredOrders():
    try:
        conn,cursor = db_connect()
        cursor.execute("SELECT * FROM ORDERS")
        data = cursor.fetchall()
        if data:
            conn.close()
            return data,200
        else:
            conn.close()
            return jsonify({'message':'No delivered Orders'}),205
    except Exception as e:
        print(e)

@api.route('/deleteServices',methods=["POST"])
def deleteServices():
    try:
        if request.method == "POST":
            print(request.json["serviceName"])
            conn,cursor = db_connect()
            cursor.execute("DELETE FROM Deliveryservices where Servicename = %s",(request.json["serviceName"]))
            data = cursor.fetchall()
            if data:
                conn.close()
                return jsonify({"message":"Service Deleted"}),200
            else:
                conn.close()
                return jsonify({"message":"No Service found"}),205
    except Exception as e:
        print(e)
        
@api.route('/pickUp', methods=["POST"])
def pickUp():
    try:
        if request.method=="POST":
            print("Inside post method")
            print(request.json)
            conn,cursor = db_connect()
            cursor.execute("Select Status from Orders where OrderId=%s",(request.json["OrderId"]))
            data = cursor.fetchall()
            if data:
                cursor.execute("Update Orders SET Status = 'Picked-Up' where OrderId=%s",(request.json["OrderId"]))
                print("data")
                conn.close()
                return jsonify({"message":"Status changed to Picked Up"}),200
            else:
                print("else")
                conn.close()
                return jsonify({"message":"Failed to change status"}),206
    except Exception as e:
        print(e)
        
@api.route('/deliver', methods=["POST"])
def deliver():
    try:
        if request.method=="POST":
            conn,cursor = db_connect()
            cursor.execute("Select Status from Orders where OrderId=%s",(request.json["OrderId"]))
            data = cursor.fetchall()
            if data:
                cursor.execute("Update Orders SET Status = 'Delivered',DeliveryHours = %s where OrderId=%s",(request.json["DeliveryHours"],request.json["OrderId"]))
                message = "Dear"+request.json['SenderName']+" your order is delivered"
                send_email(message,request.json['SenderEmail'],"Order Delivered")
                conn.close()
                return jsonify({"message":"Status changed to Delivered"}),200
            else:
                conn.close()
                return jsonify({"message":"Failed to change status"}),206
    except Exception as e:
        print(e)
        
@api.route('/payment',methods=["POST"])
def payment():
    try:
        if request.method == 'POST':
            print(request.json)
            conn,cursor = db_connect()
            # print(type(request.json["card-number"]))
            # print("SELECT * from CardDetails where CardNumber=%d and CardType=%s and CVV=%d and ExpYear=%d ExpMonth=%d and NameOnCard=%s",(request.json["card-number"],request.json["card-type"],request.json["cvv"],request.json["year"],request.json["month"],request.json["card-name"]))
            cursor.execute("SELECT * from CardDetails where CardNumber=%s",(request.json["cardnumber"]))
            # cursor.execute("SELECT * from CardDetails where CardNumber=%s" ,(request.json["card-number"]))
            data = cursor.fetchall()
            print(data)
            if data:
                conn.close()
                return jsonify(data),200
            else:
                conn.close()
                return jsonify({"message":"No Services Found"}),205
    except Exception as e:
        print(e)

@api.route('/shipmentCreation',methods=["POST"])
def shipmentCreation():
    try:
        if request.method == "POST":
            print(request.json)
            trackingId = generate_trackingId();
            conn,cursor = db_connect()
            cursor.execute("INSERT INTO ORDERS (OrderPlacedDate,SenderName,SenderEmail,PickUpAddress,SenderMobile,RecieverName,RecieverEmail,DestinationAddress,RecieverMobile,Weight,Length,Width,Height,EstimatedDeliveryDate,ServiceType,Price,TrackingId,Status) values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",(
                str(datetime.now()),
                request.json["SenderName"],
                request.json["SenderEmail"],
                request.json["PickUpAddress"],
                request.json["SenderMobile"],
                request.json["RecieverName"],
                request.json["RecieverEmail"],
                request.json["DestinationAddress"],
                request.json["RecieverMobile"],
                request.json["Weight"],
                request.json["Length"],
                request.json["Width"],
                request.json["Height"],
                request.json["EstimatedDeliveryDate"],
                request.json["ServiceType"],
                request.json["Price"],
                trackingId,
                request.json["Status"]
            )) 
            message = "<p>"+"Dear "+request.json['SenderName']+","+"<br><br>"+"Thank you for creating the order shipment.Your order will be delivered on <b>"+request.json["EstimatedDeliveryDate"]+"</b></p> <br />"+"<p> You can track your order using this TrackingId:<b>"+trackingId+"</b></p>"
            send_email(message,request.json["SenderEmail"],"Order Creation Successful!")
            conn.close()
            return jsonify({"message":"Order creation successfull"}),200
    except Exception as e:
        print(e)
        return str(e)
    # try:
    #     if request.method == "POST":
    #         nullvalesfound = False
    #         conn,cursor = db_connect()
    #         # print(request.json)
    #         for key in request.json:
    #             if request.json[key] == '':
    #                 # print("None found")
    #                 nullvalesfound = True
    #                 break
    #             # print(key,request.json[key])
    #         if nullvalesfound:
    #             conn.close()
    #             return jsonify({"message":"All fields are required. Please enter all information"}),205
    #         else:
    #             senderAddress = request.json["addresssender"]+","+request.json["citysender"]+","+request.json["statesender"]+","+request.json["countrysender"]+","+str(request.json["codesender"])
    #             receiverAddress = request.json["addressreceiver"]+","+request.json["cityreceiver"]+","+request.json["statereceiver"]+","+request.json["countryreceiver"]+","+str(request.json["codereceiver"])
    #             cursor.execute("INSERT INTO Shipment(Sender_FirstName,Sender_LastName,Sender_email,Sender_Address,Sender_Mobile,Reciever_FirstName,Reciever_LastName,Reciever_email,Reciever_Address,Reciever_Mobile,Status) values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",(
    #                 request.json["firstnamesender"],
    #                 request.json["lastnamesender"],
    #                 request.json["emailsender"],
    #                 senderAddress,
    #                 request.json["phonesender"],
    #                 request.json["firstnamereceiver"],
    #                 request.json["lastnamereceiver"],
    #                 request.json["emailreceiver"],
    #                 receiverAddress,
    #                 request.json["phonereceiver"],
    #                 "Created"
    #             ))
    #             conn.close()
    #             return jsonify({"message":"Shipment Created"}),200
    # except Exception as e:
    #     print(e)
    #     return str(e)

@api.route('/sendMessage',methods=["POST"])
def sendMessage():
    try:
        if request.method == "POST":
            conn,cursor = db_connect()
            print(request.json)
            if request.json["reply"] == "":
                cursor.execute("INSERT INTO Messages(SenderEmail,SenderMessage,SenderTimeStamp) values(%s,%s,%s)",
                (request.json["sender"],request.json["msg"],datetime.now()))
                conn.close()
                return jsonify({"message":"Message added"}),200
            else:
                cursor.execute("INSERT INTO Messages(SenderEmail,ReplyEmail,ReplyMessage,SenderTimeStamp) values(%s,%s,%s,%s)",
                (request.json["sender"],request.json["reply"],request.json["msg"],datetime.now()))
                conn.close()
                return jsonify({"message":"Message added"}),200
    except Exception as e:
        print(e)
        return str(e)

@api.route('/getMessages',methods=["POST"])
def getMessages():
    try:
        if request.method == "POST":
            conn,cursor = db_connect()
            cursor.execute("SELECT * from Messages where SenderEmail = %s order by SenderTimeStamp",(request.json["senderEmail"]))
            data = cursor.fetchall()
            if data:
                conn.close()
                return jsonify(data),200
            else:
                conn.close()
                return jsonify({"message":"No messages for this user"})
    except Exception as e:
        print(e)
        return str(e)

@api.route('/endChat',methods=["POST"])
def endChat():
    try:
        if request.method == "POST":
            conn,cursor = db_connect()
            cursor.execute("SELECT * from Messages where SenderEmail = %s",(request.json["senderEmail"]))
            data = cursor.fetchall()
            if data:
                cursor.execute("DELETE FROM MESSAGES where SenderEmail = %s",(request.json["senderEmail"]))
                conn.close()
                return jsonify({"message":"Chat Deleted"}),200
            else:
                conn.close()
                return jsonify({"message":"No messages for this user"}),200
    except Exception as e:
        print(e)
        return str(e)

@api.route('/startMessage',methods=["POST","GET"])
def startMessage():
    try:
        if request.method == "POST":
            print(request.json)
            conn,cursor = db_connect()
            cursor.execute("SELECT * FROM MESSAGES_USERS where SenderEmail = %s",(request.json["email"]))
            data = cursor.fetchall()
            if data:
                conn.close()
                return jsonify({"message":"User already added"}),205
            else:
                cursor.execute("INSERT INTO MESSAGES_USERS values(%s,%s,%s,%s)",(request.json["id"],request.json["name"],request.json["email"],request.json["role"]))
                conn.close()
                return jsonify({"message":"User added"}),200
        else:
            conn,cursor = db_connect()
            cursor.execute("SELECT * FROM MESSAGES_USERS")
            data = cursor.fetchall()
            if data:
                conn.close()
                return data,200
            else:
                conn.close()
                return jsonify({"No users"}),205
    except Exception as e:
        print(e)
        return str(e)


@api.route('/submitReviewRating',methods=["POST"])
def submitReviewRating():
    try:
        if request.method == "POST":
            print(request.json)
            conn,cursor = db_connect()
            cursor.execute("SELECT * FROM Orders where OrderId = %s",(request.json["orderid"]))
            data = cursor.fetchall()
            if data:
                cursor.execute("UPDATE Orders set Rating=%s, Review=%s where OrderId = %s",(request.json["rating"],request.json["review"],request.json["orderid"]))
                conn.close()
                return jsonify({"message":"Reviews and ratings updated for the order"}),200
            else:
                conn.close()
                return jsonify({"message":"No shipment in the database."}),205
    except Exception as e:
        print(e)
        return str(e)

@api.route('/getStoreLocations',methods=["GET"])
def getStoreLocations():
    try:
        if request.method == "GET":
            conn,cursor = db_connect()
            cursor.execute("SELECT * FROM StoresLocation");
            data = cursor.fetchall()
            if data:
                conn.close()
                return jsonify(data),200
            else:
                conn.close()
                return jsonify({"message":"No Locations found"}),205
    except Exception as e:
        print(e)
        return str(e)

@api.route('/tracking',methods=["POST"])
def tracking():
    try:
        if request.method == 'POST':
            conn,cursor = db_connect()
            cursor.execute("SELECT Status from Orders where TrackingId=%s",(request.json["tracking_id"]))
            data = cursor.fetchall()
            if data:
                conn.close()
                return jsonify(data),200
            else:
                conn.close()
                return jsonify({"message":"Not a valid tracking id"}),205
    except Exception as e:
        print(e)

@api.route('/getUserOrders/<string:username>',methods=["GET"])
def getUserOrders(username:str):
    try:
        if request.method == "GET":
            conn,cursor = db_connect()
            cursor.execute("SELECT * FROM Orders where SenderEmail = %s",(username))
            data = cursor.fetchall()
            if data:
                conn.close()
                return jsonify(data),200
            else:
                conn.close()
                return jsonify({"message":"No Delivered Orders"}),205
    except Exception as e:
        print(e)
        return str(e)

if __name__ == "__main__":
    api.run()