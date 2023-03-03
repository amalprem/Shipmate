import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import convertToBase64 from "../pages/ConvertToBase64";
import "../css/user-profile.css";

const theme = createTheme();
const url = "http://localhost:5000";
const UserProfile = () => {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [data, setData] = useState({});
  useEffect(() => {
    fetchdata();
  }, []);
  const fetchdata = async () => {
    const email = localStorage.getItem("email");
    const response = await axios.get(`${url}/updateUserProfile/${email}`);
    console.log(response);
    if (response.status === 200) {
      setData(response.data);
      setFirstName(response.data.user.FirstName);
      setLastName(response.data.user.LastName);
      setEmail(response.data.user.Username);
      setProfilePic(response.data.user.ProfilePic);
      toast.success("Data Loaded Sucessfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      firstname: firstName,
      lastname: lastName,
      email: email,
      password: password,
      profilepic: profilePic,
    });
    axios
      .post(`${url}/updateUserProfile/${email}`, {
        firstname: firstName,
        lastname: lastName,
        email: email,
        password: password,
        profilepic: profilePic,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          toast.success("Data Updated Sucessfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
        } else {
          toast.error("Data issue", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
        }
      });
  };

  const handleChange = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setProfilePic(base64);
  };

  return (
    <div className="main-container">
      <div style={{ width: "50%", marginLeft: "25rem" }}>
        <h1 className="profile-heading">Update User Profile</h1>
        <ToastContainer />
      </div>
      <div style={{ width: "50%", marginLeft: "25rem" }}>
        <Box
          sx={{
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            component="form"
            noValidate
            sx={{ mt: 3 }}
            onSubmit={handleSubmit}
          >
            <Grid container spacing={2}>
              <Grid item xs={8}>
                {profilePic === null ? (
                  <div>Please upload a picture</div>
                ) : (
                  <img src={profilePic} alt="Please upload profile picture" />
                )}
              </Grid>
              <Grid item xs={8}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  label="First Name"
                  autoFocus
                  variant="standard"
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  name="lastName"
                  autoComplete="family-name"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  value={email}
                  readOnly="true"
                  onChange={() => {
                    toast.error("You can't change your email", {
                      position: toast.POSITION.TOP_RIGHT,
                      autoClose: 10,
                    });
                  }}
                  name="email"
                  autoComplete="email"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  autoComplete="new-password"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={8}>
                <Button variant="contained" component="label">
                  Upload Profile Picture
                  <input
                    hidden
                    accept="image/*"
                    multiple
                    type="file"
                    onChange={handleChange}
                  />
                </Button>
              </Grid>
              <Grid item xs={8}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Update Profile
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default UserProfile;
