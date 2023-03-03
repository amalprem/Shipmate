import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "../css/driver-landing.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const OrdersFunction = ({ orderData }) => {
  const url = "http://localhost:5000";
  const [hours, setHours] = useState(0);
  const pickedUp = async () => {
    const pick = await axios.post(`${url}/pickUp`, {
      OrderId: orderData.OrderId,
    });
    if (pick.status === 200) {
      alert("Order Picked Up");
      window.location.reload();
    }
  };

  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  const delivered = async () => {
    console.log({
      SenderName: orderData.SenderName,
      SenderEmail: orderData.SenderEmail,
      OrderId: orderData.OrderId,
      DeliveryHours: hours,
    });
    const deliver = await axios.post(`${url}/deliver`, {
      SenderName: orderData.SenderName,
      SenderEmail: orderData.SenderEmail,
      OrderId: orderData.OrderId,
      DeliveryHours: hours,
    });
    if (deliver.status === 200) {
      alert("Order Delivered");
      window.location.reload();
    }
  };

  const renderButton = (status) => {
    if (status === "In-Progress") {
      return (
        <button className="signin-button" onClick={pickedUp}>
          Pick Up
        </button>
      );
    } else {
      return (
        <button
          className="signin-button"
          onClick={() => {
            toggleModal();
            // delivered();
          }}
        >
          Mark As Delivered
        </button>
      );
    }
  };

  return (
    <div>
      <span>Order Id: {orderData.OrderId}</span>
      <div>Sender Name: {orderData.SenderName}</div>
      <div>Receiver Name: {orderData.ReceiverName}</div>
      <div>Service Type: {orderData.ServiceType}</div>
      <div>Pick Up Address: {orderData.PickUpAddress}</div>
      <div>Status: {orderData.Status}</div>
      <div>Destination Address: {orderData.DestinationAddress}</div>
      <div style={{ paddingBottom: "0.5rem" }} />
      {renderButton(orderData.Status)}
      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <p>Enter Time Taken for Order:{orderData.OrderId}</p>
            <input
              type="number"
              onChange={(e) => {
                setHours(e.target.value);
              }}
            />
            (in hours)
            <br />
            <input
              type="submit"
              value="Add Hours"
              onClick={() => {
                delivered();
                toggleModal();
              }}
            />
            {/* <button className="close-modal" > */}
            <CloseRoundedIcon className="close-modal" onClick={toggleModal} />
          </div>
        </div>
      )}
    </div>
  );
};

const DriverLanding = () => {
  useEffect(() => {
    window.location.reload();
    window.stop();
  }, []);

  const [assignedOrders, setAssignedOrders] = React.useState({});
  const url = "http://localhost:5000/";

  const fetchAssignedOrders = async () => {
    const email = window.localStorage.getItem("email");
    const orders = await axios.get(`${url}/getAssignedOrders/${email}`);
    console.log(email);
    console.log("Orders are", orders.data);
    if (orders.status === 200) {
      setAssignedOrders(orders.data);
    } else {
      toast.error(orders.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    fetchAssignedOrders();
  }, []);

  return (
    <div>
      <ToastContainer />
      <h1 className="driver-heading">Welcome {localStorage.getItem("name")}</h1>
      {Object.keys(assignedOrders).length === 0 ? (
        <b style={{ marginLeft: "5rem" }}>No Orders Assigned to Deliver</b>
      ) : (
        Object.keys(assignedOrders).map((key, value) => {
          return (
            <div key={value} className="order-container">
              <OrdersFunction orderData={assignedOrders[key]}></OrdersFunction>
            </div>
          );
        })
      )}
    </div>
  );
};

export default DriverLanding;
