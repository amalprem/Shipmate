import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import "../css/Modal.css";
import "../css/old-delivers.css";

const OldDeliveries = () => {
  const url = "http://localhost:5000";
  const [orders, setOrders] = useState([]);
  const fetchOrders = async () => {
    const response = await axios.get(`${url}/getDeliveredOrders`);
    if (response.status === 200) {
      setOrders(response.data);
    }
  };

  const [modal, setModal] = useState(false);
  const [selecteddiv, setSelecteddiv] = useState({});
  const toggleModal = () => {
    setModal(!modal);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h1 style={{ marginLeft: "4rem" }}>Statistics</h1>
      <div className="admin-statistics">
        <p>Total Number of Orders Placed: {orders.length} </p>
        <p>
          Total Number of Orders Delivered:{" "}
          {orders.filter((a) => a.Status == "Delivered").length}
        </p>
        <p>
          Total Revenue Generated:{" "}
          <b>
            $
            {orders.length === 0
              ? 0
              : Number(
                  orders
                    .map((item) => item.Price)
                    .reduce((totalamount, price) => price + totalamount)
                    .toFixed(2)
                )}
          </b>
        </p>
        <p>
          Total Hours Spent in Delivery:{" "}
          <b>
            {orders.length === 0
              ? 0
              : Number(
                  orders
                    .map((item) => item.DeliveryHours)
                    .reduce((totalamount, price) => price + totalamount)
                    .toFixed(2)
                )}{" "}
            hours
          </b>
        </p>
      </div>
      <h1 style={{ marginLeft: "4rem" }}>List of All Orders</h1>
      {Object.keys(orders).map((key, value) => {
        return (
          <div
            key={value}
            className="orders-container"
            onClick={() => {
              setSelecteddiv(orders[key]);
              toggleModal();
            }}
          >
            <div>Order Id: {orders[key].OrderId}</div>
            <div>Sender Name: {orders[key].SenderName}</div>
            <div>Receiver Name: {orders[key].ReceiverName}</div>
            <div>Service Type: {orders[key].ServiceType}</div>
            <div>Order Placed Date: {orders[key].OrderPlacedDate}</div>
            <div>Destination Address: {orders[key].DestinationAddress}</div>
            <div>Delivery Status: {orders[key].Status}</div>
          </div>
        );
      })}

      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            {selecteddiv.Rating === null ? (
              <p>
                For Order {selecteddiv.OrderId}, No Ratings and Reviews given by
                the user.
              </p>
            ) : (
              <>
                <b className="bold-text">Rating:</b>
                {Array(selecteddiv.Rating)
                  .fill(0)
                  .map((_, index) => {
                    return <FaStar key={index} size={40} color={"#FFBA5A"} />;
                  })}
                {Array(5 - selecteddiv.Rating)
                  .fill(0)
                  .map((_, index) => {
                    return <FaStar key={index} size={40} color={"#a9a9a9"} />;
                  })}
                <br />
                <b className="bold-text">Review:</b>
                {selecteddiv.Review}
              </>
            )}
            {/* <button className="close-modal" > */}
            <CloseRoundedIcon className="close-modal" onClick={toggleModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default OldDeliveries;
