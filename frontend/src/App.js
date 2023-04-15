import "./App.css";
import ResponsiveAppBar from "./components/menu";
import React, { useState } from "react";
import {
  UserRoutes,
  AdminRoutes,
  DriverRoutes,
  NormalRoutes,
} from "./routes/routes";

function App() {
  const LoginContext = React.createContext();
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") ? true : false
  );

  function getRoutes() {
    switch (localStorage.getItem("role")) {
      case "Admin":
        return <AdminRoutes></AdminRoutes>;
      case "Driver":
        return <DriverRoutes></DriverRoutes>;
      case "User":
        return <UserRoutes></UserRoutes>;
      default:
        return <NormalRoutes></NormalRoutes>;
    }
  }

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <div className="App">
        <ResponsiveAppBar />
        {/* <MapContainer></MapContainer> */}
        {isLoggedIn ? <div>{getRoutes()}</div> : <NormalRoutes></NormalRoutes>}
        {/* <KommunicateChat/> */}
      </div>
    </LoginContext.Provider>
  );
}

export default App;
