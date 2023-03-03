import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import "../css/signup.css";

export default function SignUp() {
  const navigate = useNavigate();
  const url = "http://localhost:5000";
  const register = async (data) => {
    const response = await axios.post(`${url}/register`, {
      email: data.get("email"),
      password: data.get("password"),
      firstname: data.get("firstName"),
      lastname: data.get("lastName"),
      role: data.get("userType"),
      securityquestion: data.get("questions"),
      answer: data.get("securityAnswer"),
    });
    if (response.status === 200) {
      alert("User Registered Successfully");
      navigate("/SignIn");
    } else {
      alert(response.data["message"]);
    }

    // axios
    //   .post("http://localhost:5000/register", {
    //     email: data.get("email"),
    //     password: data.get("password"),
    //     firstname: data.get("firstName"),
    //     lastname: data.get("lastName"),
    //     role: data.get("userType"),
    //     securityquestion: data.get("questions"),
    //     answer: data.get("securityAnswer"),
    //   })
    //   .then((response) => {
    //     console.log(response);
    //     if (response.data["response"] === 205) {
    //       alert(response.data["message"]);
    //     } else if (response.data["response"] === "200") {
    //       alert("User Registered Successfully");
    //       navigate("/SignIn");
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get("email").match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      alert("invalid email");
    }
    console.log("data is", data);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
      firstname: data.get("firstName"),
      lastname: data.get("lastName"),
      role: data.get("userType"),
      securityquestion: data.get("questions"),
      answer: data.get("securityAnswer"),
    });
    register(data);
  };

  const [type, setAccess] = React.useState("");
  const [questions, setQuestion] = React.useState("");

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleChange = (event) => {
    setAccess(event.target.value);
  };

  return (
    <div className="signup-container">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="signup-title">Sign Up</div>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Type</InputLabel>
                  <Select
                    defaultValue="User"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={type}
                    label="Type"
                    name="userType"
                    onChange={handleChange}
                  >
                    <MenuItem value={"Admin"}>Admin</MenuItem>
                    <MenuItem value={"User"}>User</MenuItem>
                    <MenuItem value={"Driver"}>Driver</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Questions</InputLabel>
                <Select
                  defaultValue="User"
                  labelId="demo-simple-select-questions"
                  id="demo-simple-select-security"
                  value={questions}
                  label="Type"
                  name="questions"
                  onChange={handleQuestionChange}
                >
                  <MenuItem value={"What was the name of your high school?"}>
                    What was the name of your high school?
                  </MenuItem>
                  <MenuItem value={"What city were you born in?"}>
                    What city were you born in?
                  </MenuItem>
                  <MenuItem
                    value={"What street did you live on in third grade?"}
                  >
                    What street did you live on in third grade?
                  </MenuItem>
                </Select>
                <br></br>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="securityAnswer"
                    label="Security Answer"
                    type="securityAnswer"
                    id="securityAnswer"
                    autoComplete="security-answer"
                  />
                </Grid>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                style={{ paddingBottom: "0.5rem" }}
                required
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I agree with all the Terms and Conditions stated by Nile"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            className="signin-button az"
          >
            Sign Up
          </Button>
          <div className="already">
            Already have an account? &nbsp;
            <Link to="/SignIn" href="SignIn">
              Sign in
            </Link>
          </div>
        </Box>
      </Box>
    </div>
  );
}
