import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

export default function PaymentShipment({ formData, setFormData }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log("data is", data);
    console.log({
      name: data.get("name"),
      cardnumber: data.get("Cardno"),
      month: data.get("month"),
      year: data.get("year"),
      cvv: data.get("cvv"),
    });
    alert("Payment Succeded");
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: 5,
      }}
    >
      <Typography component="h1" variant="h5">
        Payment Page
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Box display="flex" flexDirection="row">
          <Box mr={2}>
            <Grid container rowSpacing={5} spacing={3}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  autoFocus
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="Cardno"
                  label="Card Number"
                  type="text"
                  id="number"
                  inputProps={{ maxLength: 16 }}
                  autoComplete="number"
                  value={formData.cardnumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cardnumber: e.target.value,
                    })
                  }
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  autoComplete="given-name"
                  name="month"
                  required
                  type="text"
                  id="month"
                  label="Expiry Month"
                  inputProps={{ maxLength: 2 }}
                  value={formData.month}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      month: e.target.value,
                    })
                  }
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  autoComplete="given-name"
                  name="year"
                  required
                  id="year"
                  type="text"
                  label="Expiry year"
                  inputProps={{ maxLength: 4 }}
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      year: e.target.value,
                    })
                  }
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  name="cvv"
                  label="cvv"
                  type="password"
                  id="cvv"
                  autoComplete="cvv"
                  inputProps={{ maxLength: 3 }}
                  value={formData.cvv}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cvv: e.target.value,
                    })
                  }
                  variant="standard"
                />
              </Grid>
              {/* <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Make Payment
                    </Button>
                  </Grid> */}
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
