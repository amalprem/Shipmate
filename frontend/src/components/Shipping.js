import * as React from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

export default function Shipping({ formData, setFormData }) {
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get("email1").match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      alert("invalid email");
    }
    console.log("data is", data);
    console.log({
      emailsender: data.get("email1"),
      countrysender: data.get("country1"),
      firstnamesender: data.get("firstName1"),
      lastnamesender: data.get("lastName1"),
      addresssender: data.get("Address1"),
      phonesender: data.get("phone1"),
      firstnamereceiver: data.get("firstName2"),
      lastnamereceiver: data.get("lastName2"),
      emailreceiver: data.get("email2"),
      countryreceiver: data.get("country2"),
      addressreceiver: data.get("Address2"),
      codesender: data.get("code1"),
      codereceiver: data.get("code2"),
      citysender: data.get("city1"),
      cityreceiver: data.get("city2"),
      phonereceiver: data.get("phone2"),
      statesender: data.get("State1"),
      statereceiver: data.get("State2"),
    });
    axios
      .post("http://localhost:5000/shipmentCreation", {
        emailsender: data.get("email1"),
        countrysender: data.get("country1"),
        firstnamesender: data.get("firstName1"),
        lastnamesender: data.get("lastName1"),
        addresssender: data.get("Address1"),
        phonesender: data.get("phone1"),
        firstnamereceiver: data.get("firstName2"),
        lastnamereceiver: data.get("lastName2"),
        emailreceiver: data.get("email2"),
        countryreceiver: data.get("country2"),
        addressreceiver: data.get("Address2"),
        codesender: data.get("code1"),
        codereceiver: data.get("code2"),
        citysender: data.get("city1"),
        cityreceiver: data.get("city2"),
        phonereceiver: data.get("phone2"),
        statesender: data.get("State1"),
        statereceiver: data.get("State2"),
      })
      .then((response) => {
        if (response.status === 205) {
          alert(response.data["message"]);
        } else if (response.status === 200) {
          console.log(response);
          alert(response.data["message"]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box
      sx={{
        marginTop: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* <Typography component="h1" variant="h5"> */}
      <h1 style={{ justifyContent: "left" }}>Shipment Creation</h1>
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="row">
          <Box
            sx={{
              marginLeft: "5rem",
              width: "40%",
            }}
          >
            <Typography component="h3" variant="h5">
              From Address
            </Typography>

            <Grid container rowSpacing={5} spacing={12}>
              <Grid item xs={12} sm={25}>
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
          <Box
            sx={{
              marginLeft: "5rem",
              width: "40%",
            }}
          >
            <Typography component="h3" variant="h5">
              To Address
            </Typography>

            <Grid container rowSpacing={5} spacing={3}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="firstName2"
                  required
                  fullWidth
                  id="firstName"
                  label="Recepient First Name"
                  style={{ width: 500 }}
                  value={formData.firstnamereceiver}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      firstnamereceiver: e.target.value,
                    })
                  }
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="Receipient lastName"
                  label="Receipient Last Name"
                  name="lastName2"
                  autoComplete="family-name"
                  value={formData.lastnamereceiver}
                  style={{ width: 500 }}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lastnamereceiver: e.target.value,
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
                  label="Email Address"
                  name="email2"
                  autoComplete="email"
                  value={formData.emailreceiver}
                  style={{ width: 500 }}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emailreceiver: e.target.value,
                    })
                  }
                  variant="standard"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="Address2"
                  label="To Address"
                  type="text"
                  id="address"
                  autoComplete="address"
                  value={formData.addressreceiver}
                  style={{ width: 500 }}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      addressreceiver: e.target.value,
                    })
                  }
                  variant="standard"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="city2"
                  label="city"
                  type="text"
                  id="city"
                  value={formData.cityreceiver}
                  style={{ width: 500 }}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cityreceiver: e.target.value,
                    })
                  }
                  variant="standard"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="State2"
                  label="State"
                  type="text"
                  id="state2"
                  autoComplete="state"
                  value={formData.statereceiver}
                  style={{ width: 500 }}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      statereceiver: e.target.value,
                    })
                  }
                  variant="standard"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="country2"
                  label="Country"
                  type="text"
                  placeholder="US"
                  // value="United States"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={formData.countryreceiver}
                  style={{ width: 500 }}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      countryreceiver: e.target.value,
                    })
                  }
                  variant="standard"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="code2"
                  label="postalcode"
                  type="number"
                  id="code"
                  value={formData.codereceiver}
                  style={{ width: 500 }}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      codereceiver: e.target.value,
                    })
                  }
                  variant="standard"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="phone2"
                  label="phone"
                  type="number"
                  id="phone"
                  value={formData.phonereceiver}
                  style={{ width: 500 }}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phonereceiver: e.target.value,
                    })
                  }
                  variant="standard"
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
