import "../css/admin-landing.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";

const routes = {
  "Assign Delivery": "/assign-delivery",
  "View Old Deliveries": "/old-deliveries",
  "Modify Services and Prices": "/modifyservices",
  "View All Employees": "/search-employees",
  "Approve Pending Admin Requests": "/admin",
  "Address Customer issues": "/support",
};

const AdminLandingPage = () => {
  useEffect(() => {
    window.location.reload();
    window.stop();
  }, []);

  return (
    <div className="landing-container">
      <h1 className="welcome-message">Welcome Admin</h1>
      <h3>Please select the actions which you want to perform</h3>
      {Object.keys(routes).map((keyName, route) => (
        <div className="task-container" key={route}>
          <li key={keyName}>
            <Link to={routes[keyName]}>{keyName}</Link>
          </li>
        </div>
      ))}
      {/* <SupportGroupChat /> */}
    </div>
  );
};

export default AdminLandingPage;
