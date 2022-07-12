import React from "react";
import { Row, Col, Typography } from "antd";

const { Text } = Typography;

// TODO george get logo
// import logo from "../../assets/images/brand_logo_dark.svg";

const PublicLayout = (props) => {
  return (
    <Row
      style={{
        paddingTop: "120px",
        margin: "auto",
        minHeight: 960,
        height: "100vh",
      }}
    >
      {/* for desktops */}

      <Col
        xl={12}
        md={0}
        sm={0}
        xs={0}
        style={{
          height: "100%",
          paddingRight: 240,
          // backgroundImage: `url(${background})`,
          backgroundPosition: "right bottom",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Row type="flex" style={{ justifyContent: "flex-end" }}>
          <Col>
            {/* <Row
              type="flex"
              style={{
                justifyContent: "flex-start",
                marginBottom: 64,
                paddingLeft: 24,
              }}
            >
              <img src={logo} alt="Brand Logo" />
            </Row> */}
            <Row
              type="flex"
              style={{
                justifyContent: "flex-start",
                marginBottom: 24,
                paddingLeft: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 40,
                  fontWeight: 600,
                  fontFamily: "EB Garamond, serif",
                }}
              >
                "A little bit wholesome,
              </Text>
              <Text
                style={{
                  fontSize: 48,
                  fontWeight: 600,
                  marginLeft: 24,
                  fontFamily: "EB Garamond, serif",
                }}
              >
                a little bit rachet"
              </Text>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col
        xl={12}
        md={0}
        sm={0}
        xs={0}
        style={{ paddingLeft: 96, maxWidth: 500 }}
      >
        {props.children}
      </Col>

      {/* for small screens */}
      <Col
        xl={0}
        md={24}
        sm={24}
        xs={24}
        style={{ paddingLeft: 15, paddingRight: 15, maxWidth: 500 }}
      >
        <Row
          type="flex"
          style={{ justifyContent: "flex-start", marginBottom: 32 }}
        ></Row>
        {props.children}
      </Col>
    </Row>
  );
};

export default PublicLayout;
