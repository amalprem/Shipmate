import React, { useState, useEffect } from "react";
import "../css/Modal.css";
import ReviewRatings from "./ReviewRatings";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaStar } from "react-icons/fa";

export default function Modal() {
  const [modal, setModal] = useState(false);
  const [data, setData] = useState([]);
  const [selecteddiv, setSelecteddiv] = useState({});
  const url = "http://localhost:5000";

  const toggleModal = () => {
    setModal(!modal);
  };

  const submittoggle = () => {
    setModal(!modal);
    toast.success("Ratings Updated Successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
    window.location.reload();
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  useEffect(() => {
    async function getDeliveredOrders() {
      const response = await axios.get(
        `${url}/getUserOrders/${localStorage.getItem("email")}`
      );
      console.log(response);
      if (response.status === 200) {
        // console.log(response.data);
        setData(response.data);
      } else {
        console.log(response.data);
      }
    }
    getDeliveredOrders();
  }, []);

  return (
    <div className="modalcontainer">
      <ToastContainer />
      <h1>Your Total Statistics</h1>
      <div className="statistics">
        <p>Total Number of Orders Placed: {data.length}</p>
        <p>
          Total Number of Orders Delivered:{" "}
          {data.filter((a) => a.Status == "Delivered").length}
        </p>
        <p>
          Total Amount Spent:{" "}
          <b>
            $
            {data.length === 0
              ? 0
              : Number(
                  data
                    .map((item) => item.Price)
                    .reduce((totalamount, price) => price + totalamount)
                    .toFixed(2)
                )}
          </b>
        </p>
      </div>
      <h1>Your Orders</h1>
      {data.map(function (d, i) {
        return (
          <div
            key={i}
            className="order-items"
            onClick={() => {
              setSelecteddiv(d);
              console.log(d.rating);
              if (d.Status === "Delivered" && d.Rating === null) {
                toggleModal();
              } else if (
                d.Status === "In-Progress" ||
                d.Status === "Picked-Up" ||
                d.Status === "Created"
              ) {
                toast.error("Order not Delivered", {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 2000,
                });
              } else {
                toast.error("Ratings Already Updated", {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 2000,
                });
              }
            }}
          >
            <b>Order Id: {d.OrderId}</b>
            <br />
            <br />
            <b>Sender Email: {d.SenderEmail}</b>
            <p>Sender Address: {d.PickUpAddress}</p>
            <p> Reciever Name: {d.RecieverName}</p>
            <p>Reciever Address: {d.DestinationAddress}</p>
            <p>
              Tracking Id: <b>{d.TrackingId}</b>
            </p>
            <b>Status: {d.Status}</b>
            <p>Delivery Person: {d.DeliveryDriver}</p>
            {d.Rating === null ? (
              <></>
            ) : (
              Array(d.Rating)
                .fill(0)
                .map((_, index) => {
                  return <FaStar key={index} size={40} color={"#FFBA5A"} />;
                })
            )}
            {d.Rating === null ? (
              <></>
            ) : (
              Array(5 - d.Rating)
                .fill(0)
                .map((_, index) => {
                  return <FaStar key={index} size={40} color={"#a9a9a9"} />;
                })
            )}

            {d.Review === null ? <></> : <p>Reviews:{d.Review}</p>}
          </div>
        );
      })}

      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <ReviewRatings
              data={selecteddiv}
              toggleModal={toggleModal}
              submittoggle={submittoggle}
            />
            {/* <button className="close-modal" > */}
            <CloseRoundedIcon className="close-modal" onClick={toggleModal} />
          </div>
        </div>
      )}
    </div>
  );
}
