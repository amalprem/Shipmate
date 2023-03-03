import axios from "axios";
import React, { useState, useEffect } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "../css/AdminApproveRequest.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminApproveRequest = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchdata();
  }, []);
  const fetchdata = async () => {
    const response = await axios.get("http://localhost:5000/getAdminDetails");
    //console.log(response.data.result);
    if (response.status === 200) {
      setData(response.data["result"]);
      toast.success("Admin Details Loaded", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    } else {
      toast.error("Data issue", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  return (
    <div style={{ margin: "2rem" }}>
      <ToastContainer />
      {data === null ? (
        <h1>Loading...</h1>
      ) : Object.keys(data).length === 0 ? (
        <p>No New Admins to Approve</p>
      ) : (
        Object.keys(data).map((obj, i) => {
          return (
            <div key={i} className="admins">
              <div className="adminName">
                <h1>{data[obj].FirstName + " " + data[obj].LastName}</h1>
                <p>{data[obj].username} </p>{" "}
              </div>
              <div>
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    axios
                      .post("http://localhost:5000/deleteAdmin", {
                        username: data[obj].username,
                      })
                      .then((response) => {
                        if (response.status === 200) {
                          toast.success("Admin Deleted Sucessfully", {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 2000,
                          });
                        }
                        window.location.reload(true);
                      });
                  }}
                >
                  Delete Admin
                </Button>{" "}
                <Button
                  variant="outlined"
                  startIcon={<VerifiedIcon />}
                  onClick={() => {
                    axios
                      .post("http://localhost:5000/verifyAdmin", {
                        username: data[obj].username,
                      })
                      .then((response) => {
                        if (response.status === 200) {
                          toast.success("Admin Verified Sucessfully", {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 2000,
                          });
                        }
                        window.location.reload(true);
                      });
                  }}
                >
                  Approve Admin
                </Button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default AdminApproveRequest;
