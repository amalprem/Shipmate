import React from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Button, FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import "../css/payment.css";
import axios from "axios";

const Payment = () => {
  const navigate = useNavigate();
  const [month, setMonth] = React.useState(1);
  const handleMonth = (event) => {
    setMonth(event.target.value);
  };

  const [year, setYear] = React.useState(22);
  const handleYear = (event) => {
    setYear(event.target.value);
  };

  const getDetails = async (formData) => {
    console.log(formData);
    const response = await axios.post(
      "http://localhost:5000/payment",
      formData
    );
    if (response.status === 200) {
      alert("Payment Successfull");
    } else {
      alert("Payment Failed");
      navigate("/landing-page");
    }
  };

  const handleClick = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData = {
      cardnumber: data.get("card-number"),
      cvv: data.get("cvv"),
      month: data.get("month"),
      year: data.get("year"),
      cardname: data.get("card-name"),
    };
    getDetails(formData);
    console.log(data.get("card-number"));
    console.log(data.get("cvv"));
    console.log(data.get("month"));
    console.log(data.get("year"));
    console.log(data.get("card-name"));
  };

  return (
    <div className="payment-container">
      <div className="signin-title">This is Payment Portal</div>
      <div className="text-field-container">
        <Box
          component="form"
          onSubmit={handleClick}
          style={{ paddingTop: "1rem" }}
        >
          Card Number
          <TextField
            className="textfield"
            name="card-number"
            fullWidth
            id="card-number"
            autoFocus
            sx={{ mt: 1 }}
          />
          CVV
          <TextField
            name="cvv"
            fullWidth
            id="cvv"
            autoFocus
            type="password"
            sx={{ mt: 1 }}
            className="textfield"
          />
          {/* <FormControl> */}
          <InputLabel>Month</InputLabel>
          <Select
            defaultValue="01"
            labelId="month"
            id="month"
            value={month}
            name="month"
            onChange={handleMonth}
            className="select"
          >
            <MenuItem value={"1"}>1</MenuItem>
          </Select>
          <InputLabel>Year</InputLabel>
          <Select
            defaultValue="22"
            labelId="year"
            id="year"
            value={year}
            name="year"
            onChange={handleYear}
            className="select"
          >
            <MenuItem value={"22"}>22</MenuItem>
          </Select>
          {/* </FormControl> */}
          <div style={{ paddingBottom: "1rem" }}>Name on Card</div>
          <TextField
            className="textfield"
            name="card-name"
            fullWidth
            id="card-name"
            autoFocus
          />
          <Button
            type="submit"
            className="signin-button"
            style={{ color: "white" }}
          >
            SUBMIT
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default Payment;
