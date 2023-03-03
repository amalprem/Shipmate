import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import "../css/package-details.css";
import Dimensions from "../assets/dimensions.png";

const Rates = () => {
  const [formData, setFormData] = useState({
    weight: "",
    length: "",
    width: "",
    height: "",
  });

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

  return (
    <div className="package-container1">
      <h1>Please Enter your Package Information</h1>
      <span className="package-weight">
        <TextField
          autoComplete="weight"
          type="number"
          name="weight"
          required
          fullWidth
          id="weight"
          label="Weight"
          style={{ width: 150 }}
          value={formData.weight}
          onChange={(e) =>
            setFormData({
              ...formData,
              weight: e.target.value,
            })
          }
          variant="standard"
          autoFocus
        />
        lbs
      </span>
      <div className="package-dimensions">
        <div>
          <div className="package-dimesions-sub">
            <TextField
              autoComplete="length"
              type="number"
              name="length"
              required
              fullWidth
              id="length"
              label="Length"
              style={{ width: 150 }}
              value={formData.length}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  length: e.target.value,
                })
              }
              variant="standard"
            />
            in
          </div>
          <div className="package-dimesions-sub">
            <TextField
              autoComplete="width"
              type="number"
              name="width"
              required
              fullWidth
              id="width"
              label="Width"
              style={{ width: 150 }}
              value={formData.width}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  width: e.target.value,
                })
              }
              variant="standard"
            />
            in
          </div>
          <div className="package-dimesions-sub">
            <TextField
              autoComplete="height"
              type="number"
              name="height"
              required
              fullWidth
              id="height"
              label="Height"
              style={{ width: 150 }}
              value={formData.height}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  height: e.target.value,
                })
              }
              variant="standard"
            />
            in
          </div>
        </div>
        <div>
          <img src={Dimensions} alt="dimesnions" />
        </div>
      </div>
      <div style={{ paddingLeft: "3rem" }}>
        <input type="submit" value="Get Rates" onClick={Cal} />
      </div>

      <div className="shipping-items-container" style={{ marginRight: "2rem" }}>
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
    </div>
  );
};

export default Rates;
