import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SearchBar = ({ setSearchQuery }) => (
  <form>
    <TextField
      id="search-bar"
      className="text"
      onInput={(e) => {
        setSearchQuery(e.target.value);
      }}
      label="Type to search employee"
      variant="outlined"
      placeholder="Search..."
      size="small"
    />
    <IconButton type="submit" aria-label="search">
      <SearchIcon style={{ fill: "blue" }} />
    </IconButton>
  </form>
);

const filterData = (query, data) => {
  if (!query) {
    return data;
  } else {
    // console.log(data.filter((d) => d.FullName.includes(query)));
    return data.filter((d) => d.FullName.includes(query));
  }
};

const SearchEmployees = () => {
  const [employeeData, setEmployeeData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const dataFiltered = filterData(searchQuery, employeeData);

  const url = "http://localhost:5000/";

  const fetchData = async () => {
    const response = await axios.get(`${url}/searchEmployees`);
    if (response.status === 200) {
      setEmployeeData(response.data);
    } else {
      toast.error(response.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignSelf: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: 20,
        margin: "2rem",
      }}
    >
      <ToastContainer />
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        style={{ marginBottom: "1rem" }}
      />
      <div style={{ padding: 3, alignItems: "center", margin: "2rem" }}>
        {console.log(dataFiltered)}
        {Object.keys(dataFiltered).map((key, value) => {
          return (
            <div style={{ paddingBottom: "2rem" }}>
              {dataFiltered[key].FullName + ": " + dataFiltered[key].Role}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchEmployees;
