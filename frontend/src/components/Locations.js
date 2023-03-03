import React, { useState, useEffect } from "react";
import Map from "./Maps";
import "../css/location.css";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import axios from "axios";

const Locations = () => {
  const url = "http://localhost:5000";
  const [selecteddiv, setSelecteddiv] = useState({});
  const [zipcode, setZipcode] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const handleSubmit = () => {
    setFilteredData(data.filter((a) => a.zipcode == zipcode));
    // console.log(filteredData);
  };

  useEffect(() => {
    async function getLocations() {
      const response = await axios.get(`${url}/getStoreLocations`);
      //   console.log("response", response);
      if (response.status === 200) {
        setData(response.data);
        setFilteredData(response.data);
      }
    }
    getLocations();
  }, []);

  return (
    <div className="page">
      <TextField
        id="zipcode"
        // label="Find store locations near..."
        placeholder="Find store locations near..."
        variant="standard"
        style={{ width: "500px", marginLeft: "100px", marginTop: "30px" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        onChange={(e) => {
          setZipcode(e.target.value);
        }}
      />
      {"     "}
      <Button
        type="submit"
        variant="outlined"
        sx={{ mt: 3, mb: 2 }}
        className="searchfield"
        style={{ backgroundColor: "white", color: "black", marginTop: "30px" }}
        onClick={handleSubmit}
      >
        Search
      </Button>
      <div className="location-container">
        <div className="location-div">
          {filteredData.map(function (loc, idx) {
            return (
              <div
                className="store-items"
                key={idx}
                onClick={() => {
                  setSelecteddiv(loc);
                }}
              >
                <h1>{loc.storeName}</h1>
                <p>Store Timings: {loc.storeTimings}</p>
                <p>Address:{loc.storeAddress}</p>
                <p>Latitude:{loc.storeLat}</p>
                <p>Longitude:{loc.storeLon}</p>
                <p>ZipCode:{loc.zipcode}</p>
              </div>
            );
          })}
        </div>
        <div className="map-div">
          <Map latlongs={[selecteddiv.storeLon, selecteddiv.storeLat]} />
        </div>
      </div>
    </div>
  );
};

export default Locations;
