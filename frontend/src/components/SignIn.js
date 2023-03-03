import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "../css/signin.css";
import { Link } from "react-router-dom";

const theme = createTheme();

const SignIn = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [otpButton, setOtpButton] = useState(false);
  const [response, setResponse] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function handleCallbackResponse(response) {
    console.log("encoded token" + response.credential);
    var userData = jwt_decode(response.credential);
    console.log(userData);
    setUser(userData);
    window.localStorage.setItem("isLoggedIn", true);
    window.localStorage.setItem("role", "User");
    console.log(userData.email);
    window.localStorage.setItem("id", userData.family_name);
    window.localStorage.setItem("email", userData.email);
    window.localStorage.setItem("name", userData.name);
    document.getElementById("signInDiv").hidden = true;
    navigate("/landing-page");
    window.location.reload();
  }

  function handleLogOut(event) {
    setUser({});
    document.getElementById("signInDiv").hidden = false;
    window.localStorage.removeItem("isLoggedIn");
  }

  useEffect(() => {
    google.accounts.id.initialize({
      client_id:
        "324311124286-g39mk6mka2n74f8rgi3uu2c0njm4h13o.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
    google.accounts.id.prompt();
  }, []);

  useEffect(() => {
    const data = window.localStorage.getItem("logged_in_key");
    if (data !== undefined) setIsLoggedIn(JSON.parse(data));
    console.log(data);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
    if (data.get("password") === "" && data.get("email") === "") {
      alert("Please Complete All The Fields");
    } else if (data.get("password") === "" && data.get("email") !== "") {
      alert("Please Enter The Password");
    } else if (data.get("password") !== "" && data.get("email") === "") {
      alert("Please Enter The Email Address");
    } else if (
      !data.get("email").match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
    ) {
      alert(
        "This Is An Invalid Email Address. Please Enter The Correct Email Address"
      );
    }
    axios
      .post("http://localhost:5000/login", {
        email: data.get("email"),
        password: data.get("password"),
      })
      .then((response) => {
        console.log(response);
        if (response.data["response"] === 200) {
          alert("Sign In Successfully and the role is" + response.data["role"]);
          setResponse(response.data);
          setOtpButton(true);
        } else {
          alert(response.data["message"]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const validateOtp = (event) => {
    console.log(event);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(parseInt(data.get("otp")));
    console.log(data.get("email"));
    console.log(response);
    if (
      response["otp"] === parseInt(data.get("otp")) &&
      response["username"] === data.get("email")
    ) {
      alert("Login successful");
      window.localStorage.setItem("isLoggedIn", true);
      window.localStorage.setItem("role", response["role"]);
      window.localStorage.setItem("email", response["username"]);
      window.localStorage.setItem("id", response["UserId"]);
      window.localStorage.setItem("name", response["FirstName"]);
      navigate("/landing-page");
    } else {
      alert("OTP is wrong");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className="signin-container">
          {!isLoggedIn && (
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="signin-title">Sign in</div>
              <div className="text-field-container">
                <Box
                  component="form"
                  onSubmit={otpButton ? validateOtp : handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  Email
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                  />
                  Password
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />
                  {otpButton ? (
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="otp"
                      label="OTP"
                      type="otp"
                      id="otp"
                      autoComplete="otp"
                    />
                  ) : (
                    <p></p>
                  )}
                  {otpButton ? (
                    <div>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        className="signin-button"
                      >
                        Validate OTP
                      </Button>{" "}
                    </div>
                  ) : (
                    <div className="button-container">
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        className="signin-button"
                      >
                        Sign In
                      </Button>
                    </div>
                  )}
                  <div className="google-signin">
                    You can also SignIn using Google account
                    <div id="signInDiv"></div>
                    {Object.keys(user).length != 0 && (
                      <button
                        onClick={(e) => handleLogOut(e)}
                        className="signin-button"
                      >
                        Sign Out
                      </button>
                    )}
                  </div>
                  <div className="styles">
                    <Link
                      to="/forgotPassword"
                      href="forgotPassword"
                      variant="body3"
                    >
                      Forgot password?
                    </Link>
                    <Link to="/SignUp" href="SignUp" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </div>
                </Box>
              </div>
            </Box>
          )}
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default SignIn;
