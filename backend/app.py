from flask_mail import Mail
from flask import Flask, jsonify, request
from datetime import datetime
from datetime import date
from flask_cors import CORS
import os
import random as rd
import certifi
from dotenv import load_dotenv
import string
from faker import Faker
from pymongo import MongoClient
from bson import json_util

# load_dotenv()
api = Flask(__name__)
cors = CORS(api)
load_dotenv()
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri, tlsCAFile=certifi.where())
db = client['delivery']
mail = Mail(api)

def generate_otp():
  otp = 0
  for _ in range(6):
    otp = rd.randint(1,9)+(otp*10)
  return otp

def generate_trackingId():
    trackingId = ''.join([rd.choice(string.ascii_letters+ string.digits) for n in range(32)])
    return trackingId

def generate_random_userid(firstname, lastname):
    firstname_prefix = firstname[:3].lower()
    random_chars = ''.join(rd.choices(string.ascii_lowercase, k=3))
    userid = f"{firstname_prefix}{random_chars}{len(lastname)}"
    return userid

@api.route('/')
@api.route('/profile')
def my_profile():
    response_body = {
        "name": "Shipmate",
        "about" :"This is my login page"
    }
    return response_body

@api.route('/login', methods=['POST'])
def login():
    try:        
        if request.method == 'POST':
            username = request.json['email']
            password = request.json['password']
            db = client.delivery  # replace with your MongoDB database name
            collection = db.users  # replace with your MongoDB collection name
            data = collection.find_one({'Username': username, 'Password': password})
            if data:
                data = collection.find_one({'Username': username, 'Password': password})
                # print(data)
                if data:
                    data['role'] = data['Role']
                    username = data['Username']
                    data['msg'] = "User exists"
                    data['Username'] = username
                    data['response'] = 200
                    keysToExtract = list(data.keys())
                    keysToExtract = keysToExtract[1:]
                    # print(keysToExtract)
                    extracted_dict = {key: data[key] for key in keysToExtract if key in data}
                    print(extracted_dict)
                    return extracted_dict
            else:
                data = collection.find_one({'Username': username})
                if data:
                    return jsonify({'response': 207, 'message': 'Password is Wrong'}), 207
                else:
                    return jsonify({'response': 201, 'message': 'User does not exist. Please register!'}), 201
    except Exception as e:
        return jsonify(e)

@api.route('/register', methods=['POST'])
def register():
    try:
        # Connect to the MongoDB database
        users_collection = db.users
        employees_collection = db.employees

        # Check if the user already exists
        email = request.json['email']
        user = users_collection.find_one({"Username": email})
        if user:
            # client.close()
            return jsonify({'response': 205, 'message': 'User already exists. Please login!'}), 205

        # Insert the new user into the users collection
        timestamp = datetime.now()
        userid = generate_random_userid(request.json['firstname'], request.json['lastname'])
        print(userid)
        user_doc = {
            "FirstName": request.json['firstname'],
            "LastName": request.json['lastname'],
            "Username": email,
            "Password": request.json['password'],
            "Role": request.json['role'],
            "TimeStamp": str(timestamp),
            "UserId": userid,
            "SecurityQuestion": request.json['securityquestion'],
            "Answer": request.json['answer']
        }
        users_collection.insert_one(user_doc)
        # If the user is an admin or driver, insert them into the employees collection
        if request.json['role'] in ('Admin', 'Driver'):
            employee_doc = {
                "FullName": request.json['firstname'] + " " + request.json['lastname'],
                "Role": request.json['role'],
                "Email": email,
                "Available": "Yes"
            }
            employees_collection.insert_one(employee_doc)

        # client.close()
        return json_util.dumps({'response': 200, 'userid': userid, 'message': 'User registered successfully'}), 200

    except Exception as e:
        return json_util.dumps(e)

@api.route('/forgotpassword/<string:username>',methods = ['GET','POST'])
def forgotpassword(username):
    users_collection = db.users
    if request.method == 'GET':
        data = users_collection.find_one({"Username":username})
        if data:
            result = {}
            result['SecurityQuestion'] = data['SecurityQuestion']
            result['username'] = username
            result['response'] = 200
            return result
        else:
            return jsonify({'response':205,'username':username,'msg':'User not exists'})
    elif request.method == 'POST':
        question = request.json['question']
        answer = request.json['answer']
        user_available = users_collection.find_one({"Username":username})
        if user_available:
            data = users_collection.find_one({"Username":username, "SecurityQuestion":question, "Answer":answer})
            if data:
                return jsonify({'response':200,'msg':'Answer is correct'})  
            else:
                return jsonify({'response':205,'msg':'Answer is incorrect'})
        else:
            return jsonify({'response':205,'msg':'User doesnot exist'})


@api.route('/updatepassword/<string:username>',methods=['POST'])
def update_password(username):
    try:
        if request.method == 'POST':
            newpassword = str(request.json['newpassword'])
            users_collection = db.users
            data = users_collection.find_one({"Username":username})
            if data:
                userIdPassword = db.users.find_one({ "Username": username, "Password": newpassword })
                if userIdPassword:
                    return jsonify({'response':205,'msg':"You are changing it with the same password"})
                else:
                    users_collection.update_one({ "Username": username }, { "$set": { "Password": newpassword } })
                    return jsonify({'response':200,'username':username,'msg':'Password updated successfully.'})
            else:
                return jsonify({'response':205,'username':username,'msg':'User not exists'})
    except Exception as e:
        return jsonify(e)

@api.route('/searchEmployees',methods=["GET"])
def searchEmployees():
    try:
        employees_data = db.employees
        data = json_util.dumps(employees_data.find())
        if data:
            return data,200
        else:
            return jsonify({'message':"No Employees"}),205
    except Exception as e:
        print(e)
  
@api.route('/availableDrivers',methods=["GET"])
def availableDrivers():
    try:
        data = db.employees.find({"Available":"Yes","Role":"driver"})
        data = json_util.dumps(data)
        if(data):
            return data,200
        else:
            return jsonify({'message':'No availabe drivers'}),206
    except Exception as e:
        print(e)
         
@api.route('/getAllOrders',methods=["GET"])
def getAllOrders():
    try:
        orders_data = db.orders
        data = orders_data.find({"DeliveryDriver":"Null"})
        data = json_util.dumps(data)
        if(data):
            return data,200
        else:
            return jsonify({'message':'No orders'}),207
    except Exception as e:
        print(e)
       
       
@api.route('/assignDriver',methods=["POST"])
def assignDriver():
    try:
        orders_data = db.orders
        orderid = request.json['OrderId']
        data = orders_data.find_one({"OrderId":orderid})
        print("PRINT DATA",data)
        if(data):
            drivername = request.json['drivername']
            print("DRIVER NAME",drivername)
            orderid = request.json['OrderId']
            db.orders.update_one({ "OrderId": orderid },{ "$set": { "DeliveryDriver": drivername, "Status": "In Transit" }})
            return jsonify({"message":"Updated Successsfully"}),200
        else:
            return jsonify({'message':'Failed'}),208
    except Exception as e:
        print(e)
        
@api.route('/getAssignedOrders/<string:driveremail>',methods=["GET"])
def getAssignedOrders(driveremail):
    try:
        print(driveremail)
        query = [
            {
                '$lookup': {
                    'from': 'employees',
                    'localField': 'DeliveryDriver',
                    'foreignField': 'FullName',
                    'as': 'driver'
                }
            },
            {
                '$unwind': '$driver'
            },
            {
                '$match': {
                    'Status': { '$in': ['In Transit'] },
                    'driver.Email': driveremail
                }
            }
        ]
        result = db.orders.aggregate(query)
        data = json_util.dumps(result)
        if(data):
            return data,200
        else:
            return jsonify({'message':'No orders'}),205
    except Exception as e:
        print(e)

@api.route('/deleteAdmin', methods = ['POST'])
def deleteAdmin():
    try:
        users_data = db.users
        if request.method == 'POST':
            username = request.json['username']
            query = {
                'Username': username,
                'Role': 'admin'
            }
            users_data.delete_one(query)
            return jsonify({'msg':'Delete successful'})
    except Exception as e:
        print(e)

@api.route("/updateUserProfile/<string:username>",methods=["GET","POST"])
def updateUserProfile(username):
    print(request.method)
    if request.method == 'GET':
        users_data = db.users
        print("Username:   ---  ", username)
        data = users_data.find_one({"Username": username})
        print("DATA:  ", data, len(data))
        if data:
            if len(data)==1:
                print("1111111111111111111111111111111", data)
                data = data.pop()
            print("HERE")
            data['_id'] = str(data['_id'])
            return jsonify({'User':data}),200
        else:
            return jsonify({'response':205,'username':username,'msg':'User not exists'})
    elif request.method == "POST":
        print("here in post")
        print(request.json)
        users_data = db.users
        data = users_data.find_one({"Username": username})
        print("DATA--------",data)
        if data:
            if request.json['password'] is None:
                users_data.update_one({"Username": username}, {"$set": {"FirstName": request.json['firstname'], "LastName": request.json['lastname'], "Username": request.json['email'], "ProfilePic": request.json['profilepic']}})
                return jsonify({"message":"Update Successful"}),200
            else:
                users_data.update_one({"Username": username}, {"$set": {"FirstName": request.json['firstname'], "LastName": request.json['lastname'], "Username": request.json['email'], "Password": request.json['password'], "ProfilePic": request.json['profilepic']}})
                return jsonify({"message":"Update Successful"}),200
        else:
            return jsonify({'response':205,'username':username,'message':'User not exists'})
        
@api.route('/addService',methods=["POST"])
def addService():
    try:
        delivery_service_data = db.deliveryservices
        serviceName = request.json["name"]
        data = delivery_service_data.find_one({"ServiceName":serviceName})
        if data:
            print("IN IF")
            return jsonify({"message":"Service already in database"}),205
        else:
            print("IN ELSE")
            delivery_service_data.insert_one({"ServiceName":request.json["name"],"Price":request.json["price"], "Duration":request.json["duration"],
                                              "Description":request.json["description"],"Picture":request.json["picture"]})
            return jsonify({"message":"Service Added."}),200
    except Exception as e:
        print(e)

@api.route('/getServices',methods=["GET"])
def getServices():
    try:
        delivery_service_data = db.deliveryservices
        if request.method == 'GET':
            data = delivery_service_data.find()
            if data:
                return json_util.dumps(data),200
            else:
                return jsonify({"message":"No Services Found"}),205
    except Exception as e:
        print(e)

@api.route('/updateServicePrice',methods=["POST"])
def updateServicePrice():
    try:
        delivery_service_data = db.deliveryservices
        if request.method == 'POST':
            data = delivery_service_data.find({"ServiceName":request.json["name"]})
            print("DATA IS",data)
            if data:
                delivery_service_data.update_one({"ServiceName":request.json["name"]},{"$set":{"Price":int(request.json["price"]),"ServiceName":request.json["name"]}})
                data = delivery_service_data.find({"ServiceName":request.json["name"]})
                return json_util.dumps(data),200
            else:
                return jsonify({"message":"Delivery Service not found"}),205
    except Exception as e:
        print(e)

@api.route('/getDeliveredOrders')
def getDeliveredOrders():
    try:
        orders = db.orders
        data = orders.find()
        if data:
            return json_util.dumps(data),200
        else:
            return jsonify({'message':'No delivered Orders'}),205
    except Exception as e:
        print(e)

@api.route('/deleteServices',methods=["POST"])
def deleteServices():
    try:
        if request.method == "POST":
            delivery = db.deliveryservices
            print(request.json["serviceName"])
            data = delivery.delete_one({"ServiceName": request.json["serviceName"]})
            if data:
                return jsonify({"message":"Service Deleted"}),200
            else:
                return jsonify({"message":"No Service found"}),205
    except Exception as e:
        print(e)
        
@api.route('/pickUp', methods=["POST"])
def pickUp():
    try:
        orders_data = db.orders
        if request.method=="POST":
            data = orders_data.find({"OrderId":request.json["OrderId"]})
            if data:
                orders_data.update_one({"OrderId":request.json["OrderId"]},{"$set":{"Status":"In Transit"}})
                return jsonify({"message":"Status changed to In Transit"}),200
            else:
                print("else")
                return jsonify({"message":"Failed to change status"}),206
    except Exception as e:
        print(e)

#changed 
@api.route('/deliver', methods=["POST"])
def deliver():
    try:
        if request.method=="POST":
            orders = db.orders
            query = {"OrderId": request.json["OrderId"]}
            projection = {"Status": 1, "_id": 0}
            result = orders.find_one(query, projection)
            status = result["Status"]
            print("RESULT: ", result)
            print("STATUS", status)
            if status:
                print("in status")
                query = {"OrderId": request.json["OrderId"]}
                print('1')
                update = {"$set": {"Status": "Delivered", "DeliveryHours": float(request.json["DeliveryHours"])}}
                print('2')
                orders.update_one(query, update)
                print('3')
                message = "Dear"+request.json['SenderName']+" your order is delivered"
                print('4')
                print('5')

                # conn.close()
                return jsonify({"message":"Status changed to Delivered"}),200
            else:
                # conn.close()
                return jsonify({"message":"Failed to change status"}),206
    except Exception as e:
        print("Exception details",e)
        return jsonify({"message": "An error occurred"}), 500

@api.route('/shipmentCreation',methods=["POST"])
def shipmentCreation():
    try:
        orders_data = db.orders
        if request.method == "POST":
            req_data = request.json["data"]
            fake= Faker()
            trackingId = generate_trackingId()
            while True:
                new_order_id = fake.uuid4()
                if db.orders.find_one({"OrderId": new_order_id}) is None:
                    break
            print("NEEW ORDER ID IS",new_order_id)
            user_det = {
                "OrderId":new_order_id,
                "OrderPlacedDate": str(date.today()),
                "SenderName":req_data["SenderName"],
                "SenderEmail":req_data["SenderEmail"],
                "PickUpAddress":req_data["PickUpAddress"],
                "SenderMobile": req_data["SenderMobile"],
                "RecieverName": req_data["RecieverName"],
                "RecieverEmail": req_data["RecieverEmail"],
                "DestinationAddress": req_data["DestinationAddress"],
                "RecieverMobile": req_data["RecieverMobile"],
                "Weight": int(req_data["Weight"]),
                "Length":int(req_data["Length"]),
                "Width": int(req_data["Width"]),
                "Height": int(req_data["Height"]),
                "EstimatedDeliveryDate": req_data["EstimatedDeliveryDate"],
                "ServiceType": req_data["ServiceType"],
                "Price": float(req_data["Price"]),
                "TrackingId": trackingId,
                "Status": req_data["Status"],
                "DeliveryDriver":"Null"
            }
            print("USER DETAILS ARE",user_det)
            orders_data.insert_one(user_det)
            return json_util.dumps({"message":"Order creation successfull"}),200
    except Exception as e:
        print("in execption",e)
        return str(e)

@api.route('/submitReviewRating',methods=["POST"])
def submitReviewRating():
    try:
        orders_data = db.orders
        if request.method == "POST":
            data = orders_data.find({"OrderId":request.json["orderid"]})
            if data:
                orders_data.update_one({"OrderId":request.json["orderid"]},{"$set":{"Rating":request.json["rating"], "Review":request.json["review"]}})
                return jsonify({"message":"Reviews and ratings updated for the order"}),200
            else:
                return jsonify({"message":"No shipment in the database."}),205
    except Exception as e:
        print(e)
        return str(e)

@api.route('/tracking',methods=["POST"])
def tracking():
    try:
        orders_data = db.orders
        if request.method == 'POST':
            data = orders_data.find_one({ "TrackingId": request.json["tracking_id"] }, { "Status": 1, "_id": 0 })
            if data:
                return json_util.dumps(data),200
            else:
                return jsonify({"message":"Not a valid tracking id"}),205
    except Exception as e:
        print(e)

@api.route('/getUserOrders/<string:username>',methods=["GET"])
def getUserOrders(username:str):
    try:
        orders_data = db.orders
        if request.method == "GET":
            data = orders_data.find({"SenderEmail":username})
            if data:
                return json_util.dumps(data),200
            else:
                return jsonify({"message":"No Delivered Orders"}),205
    except Exception as e:
        print(e)
        return str(e)

if __name__ == "__main__":
    api.run()