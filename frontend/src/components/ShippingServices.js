import React, { useEffect, useState } from "react";
import "../css/ShippingServices.css";

const ShippingServices = ({
  formData,
  setFormData,
  selectedService,
  setselectedService,
}) => {
  let shippingCosts = [];
  var today = new Date();
  const [data, setData] = useState([]);
  // const [selectedService, setselectedService] = useState(null);

  const Cal = () => {
    // let data = datas.data;
    let l = formData.length;
    let b = formData.width;
    let w = formData.weight;
    var h = formData.height;

    var y = (l * b * h) / 166;
    var total = 0;

    var start = 5;
    var extra = w * 1.7;
    var total = start + extra + y;
    total = Number(total.toFixed(2));

    // shippingCosts.groundService = [];
    shippingCosts.push({
      name: "GroundService",
      price: parseFloat(total).toFixed(2),
      DeliveryDate:
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        (today.getDate() + 3),
      Time: "End of Day",
    });
    // shippingCosts.ground2day = [];
    shippingCosts.push({
      name: "Ground2day",
      price: 8.55 + total,
      DeliveryDate:
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        (today.getDate() + 2),
      Time: "End of Day",
    });
    // shippingCosts.airNextdayEOD = [];
    shippingCosts.push({
      name: "airNextdayEOD",
      price: 20.68 + total,
      DeliveryDate:
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        (today.getDate() + 1),
      Time: "End of Day",
    });

    // shippingCosts.airNextdayEarly = [];
    shippingCosts.push({
      name: "airNextdayEarly",
      price: 53.43 + total,
      DeliveryDate:
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        (today.getDate() + 1),
      Time: "8:00AM",
    });

    // shippingCosts. = [];
    shippingCosts.push({
      name: "airNextdayStandard",
      price: 33.43 + total,
      DeliveryDate:
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        (today.getDate() + 1),
      Time: "3:00PM",
    });

    // shippingCosts.airTwodayStandard = [];
    shippingCosts.push({
      name: "airTwodayStandard",
      price: 14.43 + total,
      DeliveryDate:
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        (today.getDate() + 2),
      Time: "END OF DAY",
    });
    // shippingCosts.ground2day = 8.55 + total;
    // shippingCosts.airNextdayEOD = 20.68 + total;
    // shippingCosts.airNextdayEarly = 53.43 + total;
    // shippingCosts.airNextdayStandard = 33.43 + total;
    // shippingCosts.airTwodayStandard = 14.43 + total;
    console.log(shippingCosts.length);
    setData(shippingCosts);
    console.log(data);
  };
  useEffect(() => {
    shippingCosts = [];
    Cal();
  }, []);

  return (
    <div>
      <div className="shipping-items-container">
        {data.map((item, i) => {
          return (
            <div
              key={i}
              className="shipping-items"
              onClick={() => {
                setselectedService(item);
              }}
            >
              <p>{item.name}</p>
              <p>
                {item.DeliveryDate} by {item.Time}
              </p>
              <b>${item.price}</b>
            </div>
          );
        })}
      </div>
      <div>
        {selectedService === null ? (
          <></>
        ) : (
          <div className="choosen-service">
            <b>Shipping Mode Choosen:</b>
            <p>{selectedService.name}</p>
            <p>
              {selectedService.DeliveryDate} by {selectedService.Time}
            </p>
            <b>Price: ${selectedService.price}</b>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingServices;
