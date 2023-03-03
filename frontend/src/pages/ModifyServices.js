import React from "react";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  Typography,
  Box,
  Grid,
  TextField,
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

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(0deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const CardDisplay = ({ data }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);

    axios
      .post(`${url}/updateServicePrice`, formData)
      .then((response) => {
        console.log(response);
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
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
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          Modify Price
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent style={{ backgroundColor: "skyblue" }}>
          <Typography paragraph>
            Modify <b>{data.ServiceName}</b> Service
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="price"
                  name="price"
                  type="number"
                  required
                  id="price"
                  onChange={(e) => {
                    setFormData({
                      name: data.ServiceName,
                      price: e.target.value,
                    });
                  }}
                  label="Price"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Update Price
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
};

const ModifyServices = () => {
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
            <h1>Modify Service Prices</h1>
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

export default ModifyServices;
