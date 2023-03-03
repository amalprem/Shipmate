import axios from "axios";
import React, { useState, useEffect } from "react";
import "../css/admintalkview.css";
import { useNavigate } from "react-router";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import AdminTalk from "./AdminTalk";

const AdminView = ({
  activeTalk,
  setActiveTalk,
  data,
  setData,
  dropdownvalue,
  setDropdownvalue,
  filteredData,
  setFilteredData,
  num,
  setNum,
}) => {
  const navigate = useNavigate();
  const options = ["Driver Chats", "User Chats"];
  // const defaultOption = options[0];

  const url = "http://localhost:5000";
  // const [data, setData] = useState(null);
  // // const [activeTalk, setActiveTalk] = useState(null);
  // const [dropdownvalue, setDropdownvalue] = useState(null);
  // const [filteredData, setFilteredData] = useState(null);
  useEffect(() => {
    async function getMessagesList() {
      const response = await axios.get(`${url}/startMessage`);
      if (response.status === 200) {
        setData(response.data);
        // setActiveTalk(response.data[0]);
      }
    }
    getMessagesList();
    // setActiveTalk(data[0]);
    // console.log(data);
  }, []);

  const handleDropdown = (e) => {
    setDropdownvalue(e.value);
    // console.log(data);
    if (dropdownvalue == "User Chats") {
      setFilteredData(data.filter((a) => a.Role == "User"));
      // console.log("Filter", filtered);
    }
  };

  return (
    <div className="container1">
      <div className="left0">
        <Dropdown
          options={options}
          // onChange={handleDropdown}
          value={dropdownvalue}
          placeholder="Select a Chat"
          style={{ width: "200px" }}
          onChange={(e) => {
            setDropdownvalue(e.value);
            // console.log(data);
            if (e.value == "User Chats") {
              setFilteredData(data.filter((a) => a.Role == "User"));
              // console.log("Filter", filtered);
            } else if (e.value == "Driver Chats") {
              setFilteredData(data.filter((a) => a.Role == "Driver"));
              console.log(filteredData);
            }
          }}
        />
        {/* <b>{dropdownvalue}</b> */}
        {/* <label>
          <input type="checkbox" checked={checked} onChange={handleChange} />
          Driver Support
        </label> */}
        {/* <input type="checkbox">User Support</input> */}
      </div>
      <div className="left1">
        {dropdownvalue === null ? <></> : <h3>All {dropdownvalue}!!</h3>}
        {filteredData === null ? (
          <></>
        ) : (
          filteredData.map(function (d, idx) {
            return (
              <div
                key={idx}
                className="items"
                onClick={() => {
                  // console.log(d);
                  setActiveTalk(d);
                  setNum(num + 1);
                  // navigate("/view", { state: { d } });
                }}
              >
                <b>{d.SenderId}</b>
                <p>{d.SenderName}</p>
                <p>{d.SenderEmail}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminView;
