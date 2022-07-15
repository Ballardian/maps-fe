import React, { useState, useEffect } from "react";
import { Divider, Card, Row, Avatar, message, Select, Button, Col } from "antd";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  BASE_ENDPOINT,
  MAPBOX_API_TOKEN,
  MAPBOX_MAP_STYLE,
} from "../../config";

import userApi from "../../services/userApi";
import locationsApi from "../../services/locationsApi";

const { Option } = Select;
const { Meta } = Card;

const YouPage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  //   TODO george add to redux
  const [locations, setLocations] = useState(null);

  useEffect(() => {
    // TODO george remove once log out button ready
    // localStorage.removeItem("token");
    // TODO george add info to redux upon sign in / initial load
    fetchUser();
    fetchLocations();
    setIsLoading(false);
    console.log("US", user);
  }, []);

  const fetchUser = async () => {
    try {
      const response = await userApi.fetchCurrentUser();
      setUser(response);
    } catch (error) {
      message.error(`Fetching user failed: ${error.message}`);
      setIsLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await locationsApi.fetchLocations();
      setLocations(response.data);
    } catch (error) {
      message.error(`Fetching locations failed: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <>
      {user && (
        <Row style={{ margin: 24 }}>
          <Card
            style={{
              width: "100%",
            }}
            isLoading={isLoading}
          >
            <Meta
              avatar={
                <Avatar src={`${BASE_ENDPOINT}${user?.profileImage?.url}`} />
              }
              title="You"
              description={
                <>
                  <Row>{user?.fullName}</Row>
                  <Row>{user?.username}</Row>
                  <Row>{user?.email}</Row>
                </>
              }
            />
          </Card>
        </Row>
      )}
      <Row style={{ margin: 24 }}>
        <Card
          title="How would you like to be contacted"
          style={{
            width: "100%",
          }}
          isLoading={isLoading}
        >
          <p>Card content</p>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
      </Row>
      {user?.destinations[0].location.id && (
        <Row style={{ margin: 24 }}>
          <Card
            title="Current location"
            style={{
              width: "100%",
            }}
            isLoading={isLoading}
          >
            <Row type="flex" gutter={12}>
              <Col>
                <Select
                  placeholder="Select a option"
                  defaultValue={user?.destinations[0].location.id}
                >
                  {locations &&
                    locations.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.attributes.country}
                      </Option>
                    ))}
                </Select>
              </Col>
              <Col>
                <Button>Update</Button>
              </Col>
            </Row>
          </Card>
        </Row>
      )}
    </>
  );
};

export default YouPage;
