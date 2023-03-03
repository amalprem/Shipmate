import { Link } from "react-router-dom";
import React from "react";
import "../css/admin-landing.css";
import MyChatComponent from "../Talk/Talk";

const UserLandingPage = () => {
  const routes = {
    "View My Orders": "/myOrders",
    "Shipment creation": "/createShipment",
    // "Support ": "/support",
  };

  return (
    <div className="landing-container">
      <h1 className="welcome-message">Welcome User</h1>
      <h3>Please select the actions which you want to perform</h3>
      {Object.keys(routes).map((keyName, route) => (
        <div className="task-container" key={route}>
          <li key={keyName}>
            <Link to={routes[keyName]}>{keyName}</Link>
          </li>
        </div>
      ))}
      <MyChatComponent
        adminDetails={{
          id: "admin",
          name: "Admin",
          email: "admin@gmail.com",
        }}
      />
    </div>
  );
};

export default UserLandingPage;
