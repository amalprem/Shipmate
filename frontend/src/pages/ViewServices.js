import React from "react";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
const theme = createTheme();
const url = "http://localhost:5000";

const CardDisplay = ({ data }) => {
  return (
    <Card sx={{ minWidth: 500 }}>
      <CardHeader title={data.ServiceName} subheader="" />
      <CardMedia>
        <img
          src={data.Picture}
          alt={data.ServiceName}
          width="80%"
          height="130%"
        />
      </CardMedia>
      <CardContent>
        <b>Price: ${data.Price}</b>
      </CardContent>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {data.Description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const ViewServices = () => {
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    axios
      .get(`${url}/getServices`)
      .then((response) => {
        setServicesData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm">
          <div>
            <h1>In-Store Services</h1>
            {servicesData.map((obj, i) => {
              return (
                <div>
                  <CardDisplay key={i} data={obj} />
                  <br />
                  <br />
                </div>
              );
            })}
          </div>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default ViewServices;
