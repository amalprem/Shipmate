import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ShippingServices from "../components/ShippingServices";

const PickUpPage = ({
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
  const [timefield, setTimefield] = useState(time);
  const [form, setForm] = useState(false);

  return (
    <div className="pickup-container">
      <b>Reminder: Pickup Timings are only till 5pm everyday</b>
      <hr />
      <b> Select Pickup Date: </b>
      <input
        type="date"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
        }}
      />
      <br />
      <p
        style={{ color: "blue", cursor: "pointer" }}
        onClick={() => {
          setForm(!form);
        }}
      >
        Want to change pickup location?
      </p>
      <b>Pickup Location:</b>
      <br />
      <br />
      {form ? (
        <>
          <Box>
            <Grid>
              <Grid item xs={12} sm={15}>
                <TextField
                  autoComplete="given-name"
                  name="firstName1"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  style={{ width: 500 }}
                  value={formData.firstnamesender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      firstnamesender: e.target.value,
                    })
                  }
                  variant="standard"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName1"
                  autoComplete="family-name"
                  style={{ width: 500 }}
                  value={formData.lastnamesender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lastnamesender: e.target.value,
                    })
                  }
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  name="email1"
                  label="email"
                  type="email"
                  style={{ width: 500 }}
                  value={formData.emailsender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emailsender: e.target.value,
                    })
                  }
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="Address1"
                  label="From Address"
                  type="text"
                  id="Address1"
                  style={{ width: 500 }}
                  value={formData.addresssender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      addresssender: e.target.value,
                    })
                  }
                  autoComplete="Address"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="city"
                  name="city1"
                  label="city"
                  type="text"
                  style={{ width: 500 }}
                  value={formData.citysender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      citysender: e.target.value,
                    })
                  }
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="State1"
                  label="State"
                  type="text"
                  id="state1"
                  style={{ width: 500 }}
                  value={formData.statesender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      statesender: e.target.value,
                    })
                  }
                  autoComplete="state"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="country"
                  label="Country"
                  placeholder="US"
                  name="country1"
                  style={{ width: 500 }}
                  value={formData.countrysender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      countrysender: e.target.value,
                    })
                  }
                  autoComplete="country"
                  variant="standard"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="code"
                  name="code1"
                  label="Postal Code"
                  type="number"
                  style={{ width: 500 }}
                  value={formData.codesender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      codesender: e.target.value,
                    })
                  }
                  variant="standard"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  name="phone1"
                  label="phone"
                  type="number"
                  style={{ width: 500 }}
                  value={formData.phonesender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phonesender: e.target.value,
                    })
                  }
                  variant="standard"
                />
              </Grid>
            </Grid>
          </Box>
        </>
      ) : (
        <div className="pickup-address">
          <p>{formData.firstnamesender + " " + formData.lastnamesender}</p>
          <p>
            {formData.addresssender +
              "," +
              formData.citysender +
              "," +
              formData.statesender +
              "," +
              formData.codesender}
          </p>
          <p>{formData.phonesender}</p>
        </div>
      )}
      <br />
      <br />
      <b>Pickup Timings: All day between 9:00AM to 5:00PM </b>
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

export default PickUpPage;
