import React from "react";
import TextField from "@mui/material/TextField";
import "../css/package-details.css";
import Dimensions from "../assets/dimensions.png";

const PackageDetails = ({ formData, setFormData }) => {
  return (
    <div className="package-container">
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
    </div>
  );
};

export default PackageDetails;
