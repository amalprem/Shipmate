import { Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import ForgotPassword from "../pages/forgot-password";
import SearchEmployees from "../pages/search-employees";
import AdminLandingPage from "../pages/admin-landing-page";
import React from "react";
import AssignDelivery from "../pages/assign-delivery";
import OldDeliveries from "../pages/old-deliveries";
import DriverLanding from "../pages/driver-landing";
import UserProfile from "../components/UserProfile";
import Map from "../components/Maps";
import AdminApproveRequest from "../pages/AdminApproveRequest";
import Services from "../pages/modify-services";
import Payment from "../components/Payment";
import Chat from "../components/Chat";
import ProgressBar from "../components/ProgressBar";
import MyChatComponent from "../Talk/Talk";
import DriverHomePage from "../pages/DriverHomePage";
import AdminChatPage from "../Talk/AdminChatPage";
import Modal from "../components/Modal";
import Locations from "../components/Locations";
import UserLandingPage from "../pages/user-landing-page";
import GroupChat from "../Talk/GroupChat";
import Rates from "../pages/Rates";
import AdminChat from "../components/AdminChat";

function UserRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/landing-page" element={<UserLandingPage />} />
      <Route exact path="/SignIn" element={<SignIn />} />
      <Route exact path="/SignUp" element={<SignUp />} />
      <Route exact path="/ForgotPassword" element={<ForgotPassword />} />
      <Route exact path="/userProfile" element={<UserProfile />} />
      <Route exact path="/Location" element={<Map />} />
      <Route exact path="/createShipment" element={<ProgressBar />} />
      <Route exact path="/myOrders" element={<Modal />} />
      <Route exact path="/rates" element={<Rates />} />
    </Routes>
  );
}

function DriverRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      {/* <Route exact path="/landing-page" element={<DriverLanding />} /> */}
      <Route exact path="/landing-page" element={<DriverHomePage />} />
      <Route exact path="/SignIn" element={<SignIn />} />
      <Route exact path="/SignUp" element={<SignUp />} />
      <Route exact path="/userProfile" element={<UserProfile />} />
      <Route exact path="/Location" element={<Map />} />
      <Route exact path="/assignedOrders" element={<DriverLanding />} />
      <Route exact path="/rates" element={<Rates />} />
    </Routes>
  );
}

function AdminRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/landing-page" element={<AdminLandingPage />} />
      <Route exact path="/search-employees" element={<SearchEmployees />} />
      <Route exact path="/old-deliveries" element={<OldDeliveries />} />
      <Route exact path="/assign-delivery" element={<AssignDelivery />} />
      <Route exact path="/userProfile" element={<UserProfile />} />
      <Route exact path="/admin" element={<AdminApproveRequest />} />
      <Route exact path="/modifyservices" element={<Services />} />
      <Route exact path="/Location" element={<Map />} />
      <Route exact path="/support" element={<AdminChatPage />} />
      <Route exact path="/groupchat" element={<GroupChat />} />
      <Route exact path="/createShipment" element={<ProgressBar />} />
      <Route exact path="/rates" element={<Rates />} />
      <Route exact path="/chat" element={<AdminChat />} />
    </Routes>
  );
}

function NormalRoutes() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/landing-page" element={<Home />} />
      <Route exact path="/SignIn" element={<SignIn />} />
      <Route exact path="/SignUp" element={<SignUp />} />
      <Route exact path="/ForgotPassword" element={<ForgotPassword />} />
      <Route exact path="/userProfile" element={<UserProfile />} />
      {/* <Route exact path="/Location" element={<Map />} /> */}
      <Route exact path="/chat" element={<Chat />} />
      <Route exact path="/createShipment" element={<ProgressBar />} />
      {/* <Route exact path="/payment" element={<ProgressBar />} /> */}
      <Route exact path="/talk" element={<MyChatComponent />} />
      <Route exact path="/location" element={<Locations />} />
      <Route exact path="/Payment" element={<Payment />}></Route>
      <Route exact path="/rates" element={<Rates />} />
      {/* <Route exact path="/Tracking" element={<GoogleLocation />}></Route> */}
    </Routes>
  );
}

export { UserRoutes, AdminRoutes, DriverRoutes, NormalRoutes };
