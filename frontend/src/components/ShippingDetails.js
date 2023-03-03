import React, { useState } from "react";
import "../css/shipping-details.css";
import DropOffPage from "../pages/DropOffPage";
import PickUpPage from "../pages/PickUpPage";

const ShippingDetails = ({
  formData,
  setFormData,
  selectedService,
  setselectedService,
}) => {
  const [shipmentActive, setShipmentActive] = useState(true);
  const [pickUpActive, setPickUpActive] = useState(false);
  const [component, setComponent] = useState(0);
  const components = [
    <DropOffPage
      formData={formData}
      setFormData={setFormData}
      setselectedService={setselectedService}
      selectedService={selectedService}
    />,
    <PickUpPage
      formData={formData}
      setFormData={setFormData}
      setselectedService={setselectedService}
      selectedService={selectedService}
    />,
  ];
  const handleClick = () => {
    setShipmentActive(!shipmentActive);
    setPickUpActive(!pickUpActive);
  };

  return (
    <div className="shiiping-container">
      <h3>Do you need to schedule a pickup?</h3>
      <hr
        style={{
          background: "lime",
          color: "lime",
          borderColor: "lime",
          height: "2px",
        }}
      />
      <div className="shipping-buttons">
        <input
          type="submit"
          value="I'll drop off my shipment or include it in another pickup."
          style={{
            backgroundColor: shipmentActive ? "#4169E1" : "",
            color: shipmentActive ? "white" : "",
          }}
          onClick={() => {
            handleClick();
            setComponent(0);
          }}
        />
        <p> --OR-- </p>
        <input
          type="submit"
          value="Schedule a new pickup."
          style={{
            backgroundColor: pickUpActive ? "#4169E1" : "",
            color: pickUpActive ? "white" : "",
          }}
          onClick={() => {
            handleClick();
            setComponent(1);
          }}
        />
      </div>
      <div>{components[component]}</div>
    </div>
  );
};

export default ShippingDetails;
