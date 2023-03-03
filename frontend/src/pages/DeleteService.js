import React from "react";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const theme = createTheme();
const url = "http://localhost:5000";

const CardDisplay = ({ data }) => {
  const [serviceName, setServiceName] = useState(null);

  const handleDeleteService = async () => {
    console.log(serviceName);
    const response = await axios.post(`${url}/deleteServices`, {
      serviceName: serviceName,
    });
    if (response.status === 200) {
      toast.success(response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    } else {
      toast.success(response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };
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
      <CardActions disableSpacing>
        <Button
          onClick={() => {
            setServiceName(data.ServiceName);
            handleDeleteService();
          }}
          aria-label="show more"
        >
          Delete Service
        </Button>
      </CardActions>
    </Card>
  );
};

const DeleteServices = () => {
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    axios
      .get(`${url}/getServices`)
      .then((response) => {
        setServicesData(response.data);
        console.log(response.data);
        toast.success("Services rendered", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <ToastContainer />
          <div>
            <h1>Delete Services</h1>
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

export default DeleteServices;
