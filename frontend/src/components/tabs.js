import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "../css/tabs.css";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Avatar, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Locations from "./Locations";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const [trackingButton, setTrackingButton] = useState(false);
  const [dataz, setData] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getTrackingDetails = async (formData) => {
    const response = await axios.post(
      "http://localhost:5000/tracking",
      formData
    );
    if (response.status === 200) {
      setTrackingButton(true);
      let curr_status = response.data[0].Status;
      setData(curr_status);
      console.log(dataz);
    } else {
      alert("Invalid Tracking Number");
    }
  };

  const handleClick = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData = {
      tracking_id: data.get("tracking"),
    };
    getTrackingDetails(formData);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="Rates & Shipping" {...a11yProps(0)} />
          <Tab label="Tracking" {...a11yProps(1)} />
          <Tab label="Locations" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <div className="fontsss">
        <TabPanel value={value} index={0} style={{ textAlign: "center" }}>
          <span style={{ textAlign: "center", display: "inherit" }}>
            To know more about the rates click
            <Link to="/rates" href="Shipping" variant="body2">
              {" here"}
            </Link>
          </span>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "30ch" },
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleClick}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              Track your shipment by entering your unique tracking id.
              <TextField
                name="tracking"
                id="tracking"
                style={{ padding: "1rem 0rem", margin: "unset" }}
              ></TextField>
              <Button
                type="submit"
                className="signin-button"
                style={{ color: "white" }}
              >
                Track
              </Button>
              {trackingButton ? (
                <div>The status of your order is&nbsp; {dataz}</div>
              ) : (
                <p></p>
              )}
            </div>
          </Box>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <div style={{ textAlign: "center" }}>
            <Locations />
          </div>
        </TabPanel>
      </div>
    </Box>
  );
}
