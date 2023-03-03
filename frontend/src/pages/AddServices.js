import React from "react";
import { useState } from "react";
import { Box, Grid, TextField, Button } from "@mui/material";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import convertToBase64 from "../pages/ConvertToBase64";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddServices = () => {
  const url = "http://localhost:5000";
  const [picture, setPicture] = useState(null);
  const [serviceName, setServiceName] = useState(null);
  const [price, setPrice] = useState(null);
  const [duration, setDuration] = useState(null);
  const [description, setDescription] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log({
      name: data.get("name"),
      price: parseInt(data.get("price")),
      duration: data.get("duration"),
      description: data.get("description"),
      picture: picture,
    });
    const response = await axios.post(`${url}/addService`, {
      name: data.get("name"),
      price: parseInt(data.get("price")),
      duration: data.get("duration"),
      description: data.get("description"),
      picture: picture,
    });

    setServiceName("");
    setPrice("");
    setDuration("");
    setDescription("");

    if (response.status === 200) {
      toast.success(response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      setServiceName("");
      setPrice("");
      setDuration("");
      setDescription("");
    }
  };

  const handleChange = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setPicture(base64);
  };
  return (
    <Box
      component="form"
      noValidate
      id="form"
      onSubmit={handleSubmit}
      sx={{ mt: 3 }}
    >
      <ToastContainer />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            autoComplete="name"
            name="name"
            required
            fullWidth
            id="name"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            label="Name of the Service"
            autoFocus
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            type="number"
            id="price"
            label="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            name="price"
            autoComplete="price"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="duration"
            label="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            name="duration"
            autoComplete="duration"
          />
        </Grid>
        <Grid item xs={12}>
          <TextareaAutosize
            maxRows={4}
            aria-label="Please Enter description of the service..."
            placeholder="Please Enter description of the service..."
            id="description"
            label="Please Enter description of the service..."
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: 550, height: 100 }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" component="label">
            Upload Service Picture
            <input
              hidden
              accept="image/*"
              multiple
              type="file"
              onChange={handleChange}
            />
          </Button>
        </Grid>
      </Grid>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Add Service
      </Button>
    </Box>
  );
};

export default AddServices;
