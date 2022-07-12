/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Layout, Row, Col, Divider } from "antd";

import routes from "../../routes";
import * as userActions from "../../redux/user";
import TopNavDropdown from "./TopNavDropdown";
import ErrorPage from "./ErrorPage";

import { colors } from "../../styles/colors";

const { Header, Content } = Layout;
// High-level styles for easy customizability
const DEFAULT_MAX_WIDTH = 1168;

class AuthLayout extends React.Component {
  state = {
    error: null,
    errorStack: null,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    if (!localStorage.getItem("token")) {
      this.onLogout();
      return;
    }
    // TODO george fix this - refetch user upon refresh
    // Fetch user if not set
    // if (user === "") {
    //   initializeUser();
    // }
    if (localStorage.getItem("user") === "iamgeorgemorris") {
      this.props.history.push(routes.button);
    }
  }

  // When user routes away from error page, we should hide the error page
  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.location !== this.props.location) {
      this.clearError();
    }
  }

  onLogout = () => {
    this.props.logoutUser();
    this.props.history.push(routes.login);
  };

  clearError = () => {
    this.setState({ error: null, errorStack: null });
  };

  componentDidCatch(error, info) {
    this.setState({ error, errorStack: info.componentStack });
  }

  render() {
    const { history, children, t, logoutUser, maxWidth } = this.props;

    // if (!localStorage.getItem("user")) return <LoadingSpinner />;

    return (
      <Layout style={{ backgroundColor: "white", height: "100%" }}>
        <Header
          style={{
            position: "fixed",
            width: "100%",
            zIndex: 3,
            paddingLeft: 18,
            background: colors.white,
          }}
        >
          <Row
            type="flex"
            justify="space-between"
            align="middle"
            style={{
              maxWidth: (maxWidth || DEFAULT_MAX_WIDTH) + 80,
              margin: "auto",
              color: "white",
            }}
          >
            <Col
              span={24}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <TopNavDropdown
                  t={t}
                  history={history}
                  logoutUser={logoutUser}
                />
              </div>
            </Col>
          </Row>
          <Divider
            style={{
              marginTop: 0,
            }}
          />
        </Header>

        {/* Page content */}
        <Content
          style={{
            width: "100%",
            margin: "auto",
            maxWidth: (maxWidth || DEFAULT_MAX_WIDTH) + 100,
            marginTop: 110,
            minHeight: "calc(100vh - 128px)",
            padding: "0 30px",
          }}
        >
          {this.state.error ? (
            <ErrorPage
              title="Error"
              subTitle="Sorry! There is an error loading the page"
              errorStack={this.state.errorStack}
              onClick={this.clearError}
            />
          ) : (
            <>{children}</>
          )}
        </Content>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { logoutAction } = userActions;
  return {
    logoutUser: () => {
      dispatch(logoutAction());
    },
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AuthLayout)
);
