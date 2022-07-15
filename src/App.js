/* eslint-disable global-require */
import React from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import routes from "./routes";

import AuthLayout from "./layouts/AuthLayout";
import PublicLayout from "./layouts/PublicLayout";

// Pages
import MapPage from "./pages/MapPage/index";
import RegisterPage from "./pages/RegisterPage/index";
import LoginPage from "./pages/LoginPage/index";
import YouPage from "./pages/YouPage/index";
// import FriendPage from "./pages/FriendPage/index";

class App extends React.Component {
  // componentDidMount() {
  //   require("./styles/index.css");
  //   require("./styles/override.css");
  // }

  render() {
    return (
      <Routes>
        <Route
          path={routes.home}
          element={<Navigate to={routes.map} replace={true} />}
        />
        <Route
          path={routes.map}
          element={<AuthLayout children={<MapPage />}></AuthLayout>}
        />
        <Route
          path={routes.you}
          element={<AuthLayout children={<YouPage />}></AuthLayout>}
        />
        <Route
          path={routes.login}
          element={<PublicLayout children={<LoginPage />}></PublicLayout>}
        />
        <Route
          path={routes.register}
          element={<PublicLayout childre={<RegisterPage />}></PublicLayout>}
        />
        <Route path="*" element={<Navigate to={routes.map} replace={true} />} />
      </Routes>
    );
  }
}

export default App;
