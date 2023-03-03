import React from "react";
import { useState } from "react";
import { Button } from "@mui/material";
import Add from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddServices from "./AddServices";
import ModifyServices from "./ModifyServices";
import DeleteServices from "./DeleteService";

const theme = createTheme();

const Services = () => {
  const [active, setActive] = useState(null);

  const getComponent = () => {
    switch (active) {
      case "add":
        return <AddServices />;
      case "modify":
        return <ModifyServices />;
      case "delete":
        return <DeleteServices />;
    }
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <ToastContainer />
          <h1>Types of Delivery Services</h1>
          <Button
            variant="contained"
            onClick={() => {
              setActive("add");
            }}
          >
            <Add />
            Add Service
          </Button>
          {"  "}
          <Button
            variant="contained"
            onClick={() => {
              setActive("modify");
            }}
          >
            <CreateIcon />
            Modify Service
          </Button>
          {"  "}
          <Button
            variant="contained"
            onClick={() => {
              setActive("delete");
            }}
          >
            <DeleteIcon />
            Delete Service
          </Button>
          <br />
          <br />
          <div>{getComponent()}</div>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default Services;
