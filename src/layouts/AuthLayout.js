/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from "react";
import { Layout, Row, Affix, Button } from "antd";
import { useNavigate, Navigate } from "react-router-dom";

import routes from "../routes";
// import ErrorPage from "./ErrorPage";;

import { colors } from "../styles/colors";

const { Header, Content } = Layout;

const AuthLayout = ({ children }) => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("token") ? true : false
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!localStorage.getItem("token")) {
      setLoggedIn(false);
      return;
    }
    // TODO george fix this - refetch user upon refresh
    // Fetch user if not set
    // if (user === "") {
    //   initializeUser();
    // }
    // TODO george add to redux
    // const userId = localStorage.getItem("id");
    // if (userId) {
    //   userApi.fetchUser(userId);
    // }
  }, []);

  return (
    <>
      {!loggedIn && <Navigate to={routes.login} replace={true} />}
      <Layout
        style={{ backgroundColor: "white", height: "100%", width: "100%" }}
      >
        {/* TODO george potentially remove for affixed logo */}
        <Header
          style={{
            position: "fixed",
            width: "100%",
            zIndex: 3,
            paddingLeft: 18,
            background: colors.white,
            // TODO george match to future destination lines
            borderBottom: `2px dashed ${colors.secondaryText}`,
          }}
        />

        {/* Page content */}
        <Content
          style={{
            width: "100%",
            marginTop: 50,
            minHeight: "calc(100vh - 128px)",
          }}
        >
          {children}
        </Content>
        {/* TODO george add url check - if maps, dont show maps button */}
        <Row type="flex">
          <Affix offsetBottom={30}>
            <Button
              onClick={() => navigate(routes.map)}
              size="small"
              type="primary"
              style={{
                zIndex: 3,
                marginLeft: 16,
              }}
            >
              Map
            </Button>
          </Affix>
          <Affix offsetBottom={30}>
            <Button
              onClick={() => navigate(routes.friends)}
              size="small"
              type="primary"
              style={{
                zIndex: 3,
                marginLeft: 16,
              }}
            >
              Friends
            </Button>
          </Affix>
          <Affix offsetBottom={30}>
            <Button
              onClick={() => navigate(routes.you)}
              size="small"
              type="primary"
              style={{
                zIndex: 3,
                marginLeft: 16,
              }}
            >
              You
            </Button>
          </Affix>
        </Row>
      </Layout>
    </>
  );
};
export default AuthLayout;
