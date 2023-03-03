import React from "react";
import Shipping from "./Shipping";
import { useState } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import PaymentShipment from "./payment_shipment";
import PackageDetails from "./PackageDetails";
import ShippingDetails from "./ShippingDetails";

const ProgressBar = () => {
  const url = "http://localhost:5000";
  const [selectedService, setselectedService] = useState(null);
  const [formData, setFormData] = useState({
    emailsender: "",
    countrysender: "United States",
    firstnamesender: "",
    lastnamesender: "",
    addresssender: "",
    phonesender: "",
    firstnamereceiver: "",
    lastnamereceiver: "",
    emailreceiver: "",
    countryreceiver: "United States",
    addressreceiver: "",
    codesender: "",
    codereceiver: "",
    citysender: "",
    cityreceiver: "",
    phonereceiver: "",
    statesender: "",
    statereceiver: "",
    name: "",
    cardnumber: "",
    month: "",
    year: "",
    cvv: "",
    weight: "",
    length: "",
    width: "",
    height: "",
  });
  const pages = [
    <Shipping formData={formData} setFormData={setFormData} />,
    <PackageDetails formData={formData} setFormData={setFormData} />,
    <ShippingDetails
      formData={formData}
      setFormData={setFormData}
      setselectedService={setselectedService}
      selectedService={selectedService}
    />,
    <PaymentShipment formData={formData} setFormData={setFormData} />,
  ];
  const nextButton = [
    "Enter Package Details",
    "Select Shipping Type",
    "Proceed to Payment",
    "Place Order",
  ];
  const [num, setNum] = useState(0);

  const createShipment = async () => {
    const response = await axios.post(`${url}/shipmentCreation`, {
      SenderName: formData.firstnamesender + " " + formData.lastnamesender,
      SenderEmail: formData.emailsender,
      PickUpAddress:
        formData.addresssender +
        ", " +
        formData.citysender +
        ", " +
        formData.statesender +
        ", " +
        formData.countrysender +
        ", " +
        formData.codesender,
      SenderMobile: formData.phonesender,
      RecieverName:
        formData.firstnamereceiver + " " + formData.lastnamereceiver,
      RecieverEmail: formData.emailreceiver,
      DestinationAddress:
        formData.addressreceiver +
        ", " +
        formData.cityreceiver +
        ", " +
        formData.statereceiver +
        ", " +
        formData.countryreceiver +
        ", " +
        formData.codereceiver,
      RecieverMobile: formData.phonereceiver,
      Weight: formData.weight,
      Length: formData.length,
      Width: formData.width,
      Height: formData.height,
      EstimatedDeliveryDate:
        selectedService.DeliveryDate + " by " + selectedService.Time,
      ServiceType: selectedService.name,
      Price: selectedService.price,
      Status: "Created",
    });
    if (response.status === 205) {
      alert("Please Enter all fields to create order");
    } else if (response.status === 200) {
      console.log(response);
      alert(response.data["message"]);
      Object.keys(formData).forEach((key) => {
        formData[key] = null;
      });
      window.location.reload();
    }
  };
  const handleNext = () => {
    if (num === pages.length - 1) {
      console.log(formData);
      createShipment();
    } else {
      console.log(formData);
      setNum(num + 1);
    }
  };

  return (
    <div>
      <div>{pages[num]}</div>
      <div style={{ marginLeft: "12rem", marginTop: "3rem" }}>
        <Button
          type="submit"
          variant="contained"
          style={{ margin: 8, width: 400, paddingLeft: "10%" }}
          disabled={num == 0}
          onClick={() => {
            console.log(formData);
            setNum(num - 1);
          }}
        >
          Previous
        </Button>
        {"    "}
        <Button
          type="submit"
          variant="contained"
          style={{
            margin: 8,
            width: 300,
            textAlign: "center",
          }}
          disabled={num == pages.length}
          onClick={() => {
            handleNext();
          }}
        >
          {nextButton[num]}
        </Button>
      </div>
    </div>
  );
};

export default ProgressBar;
