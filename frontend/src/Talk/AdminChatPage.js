import React from "react";
import AdminView from "./AdminView";
import AdminTalk from "./AdminTalk";
import { useState } from "react";
import Button from "@mui/material/Button";
import axios from "axios";

const AdminChatPage = () => {
  const [activeTalk, setActiveTalk] = useState({});
  const [data, setData] = useState(null);
  // const [activeTalk, setActiveTalk] = useState(null);
  const [dropdownvalue, setDropdownvalue] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const nextButton = ["Proceed to Payment", "Place Order"];
  const [num, setNum] = useState(0);
  const pages = [
    <AdminView
      activeTalk={activeTalk}
      setActiveTalk={setActiveTalk}
      data={data}
      setData={setData}
      dropdownvalue={dropdownvalue}
      setDropdownvalue={setDropdownvalue}
      filteredData={filteredData}
      setFilteredData={setFilteredData}
      num={num}
      setNum={setNum}
    />,
    <AdminTalk userDetails={activeTalk} />,
  ];

  return (
    <div>
      {pages[num]}
      {num === 0 ? (
        <></>
      ) : (
        <Button
          type="submit"
          variant="contained"
          style={{
            marginLeft: "10rem",
            width: 300,
            textAlign: "center",
            marginTop: "2rem",
          }}
          onClick={() => {
            setNum(num - 1);
          }}
        >
          Go Back
        </Button>
      )}
    </div>
  );
};

export default AdminChatPage;
