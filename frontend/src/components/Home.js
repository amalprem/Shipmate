import React, { useState, useRef } from "react";
import "../css/home.css";
import { useEffect } from "react";
import BasicTabs from "./tabs";
import create from "../assets/create.svg";
import store from "../assets/store.svg";
import announcements from "../assets/announcements.svg";
import returns from "../assets/returns.svg";
import { useNavigate } from "react-router-dom";
import Announcements from "../pages/announcements";

const Home = () => {
  useEffect(() => {
    window.location.reload();
    window.stop();
  }, []);

  const navigate = useNavigate();
  const ref = useRef(null);

  const [selected, setSelected] = useState(null);

  return (
    <div className="container">
      <div className="nile">
        {" "}
        Nile <br></br>The Premier Delivery Management System
      </div>
      <div className="tabs fonts">
        <BasicTabs></BasicTabs>
      </div>
      <span style={{ textAlign: "center" }}>Manage Your Shipments By</span>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="manage">
          <div
            onClick={() => {
              navigate("/createShipment");
            }}
          >
            <img src={create} className="bg-image"></img>
            Creating A Shipment
          </div>
          <div
            onClick={() => {
              ref.current?.scrollIntoView({ behavior: "smooth" });
              setSelected("In-StoreServices");
            }}
          >
            <img src={store} className="bg-image"></img>
            In Store Services
          </div>
          <div
            onClick={() => {
              setSelected("Announcements");
            }}
          >
            <img src={announcements} className="bg-image"></img>
            Announcements
          </div>
          <div
            onClick={() => {
              setSelected("Returns");
            }}
          >
            <img src={returns} className="bg-image"></img>
            Returns
          </div>
        </div>
        <div style={{ backgroundColor: "blue" }}></div>
      </div>
      <div style={{ textAlign: "center", marginTop: "3rem" }} ref={ref}>
        {selected === null ? (
          <></>
        ) : (
          <Announcements selected={selected}></Announcements>
        )}
      </div>
      <div style={{ flexGrow: "1" }}></div>
    </div>
  );
};

export default Home;
