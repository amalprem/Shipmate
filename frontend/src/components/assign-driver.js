import axios from "axios";
import "../css/assign-driver.css";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";

const AssignDriver = ({ data }) => {
  // console.log("Assigned driver data is",data)
  const [drivers, setDrivers] = useState("");
  const url = "http://localhost:5000/";

  const fetchDrivers = async () => {
    const availableDrivers = await axios.get(`${url}/availableDrivers`);
    // console.log(availableDrivers)
    if (availableDrivers.status === 200) {
      setDrivers(availableDrivers.data);
    } else {
      toast.error(availableDrivers.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);
  return (
    <div className="assign-driver-container">
      <ToastContainer />
      {Object.keys(drivers).map((key, value) => {
        return (
          <div className="assign-container" key={value}>
            <p>{drivers[key].FullName}</p>
            <button
              onClick={async () => {
                const response = await axios.post(`${url}/assignDriver`, {
                  OrderId: data.OrderId,
                  drivername: drivers[key].FullName,
                });
                if (response.status === 200) {
                  console.log(response);
                  window.location.reload();
                }
              }}
              className="assign-button"
            >
              Assign
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AssignDriver;
