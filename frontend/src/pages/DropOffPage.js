import React, { useState } from "react";
import ShippingServices from "../components/ShippingServices";

const DropOffPage = ({
  formData,
  setFormData,
  selectedService,
  setselectedService,
}) => {
  var today = new Date();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var date1 =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1) +
    "-" +
    (today.getHours() > 17 ? today.getDate() + 1 : today.getDate());
  const [date, setDate] = useState(date1);
  return (
    <div>
      <b>Estimated Ship Date:</b>
      <input
        type="date"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
        }}
      />
      <br />
      <hr />
      <ShippingServices
        formData={formData}
        setFormData={setFormData}
        setselectedService={setselectedService}
        selectedService={selectedService}
      />
    </div>
  );
};

export default DropOffPage;
