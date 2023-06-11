import React from "react";
import Login from "./Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./style.css";
import Dashboard from "./Dashboard";
import User from "./User";
import Profile from "./Profile";
import Home from "./Home";
import Order from "./Order";
import CreateUser from "./CreateUser";
import EditUser from "./EditUser";
import CreateOrder from "./CreateOrder";
import EditOrder from "./EditOrder";
import Stages from "./Stages";
import EditStages from "./EditStages";
import CreateStage from "./CreateStage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route path="" element={<Home />}></Route>
          <Route path="*" element={<Home />} /> {/* Route default */}
          <Route path="/users" element={<User />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/orders" element={<Order />}></Route>
          <Route path="/createuser" element={<CreateUser />}></Route>
          <Route path="/userEdit/:id" element={<EditUser />}></Route>
          <Route path="/createorder" element={<CreateOrder />}></Route>
          <Route path="/orderEdit/:id" element={<EditOrder />}></Route>
          <Route path="/stages/:id" element={<Stages />}></Route>
          <Route path="/editStages/:id" element={<EditStages />}></Route>
          <Route
            path="/createStage/:id/:number"
            element={<CreateStage />}
          ></Route>
        </Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
