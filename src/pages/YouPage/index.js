import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Divider,
  Card,
  Row,
  Avatar,
  message,
  Select,
  Button,
  Col,
  Form,
  Input,
  Tooltip,
  Spin,
} from "antd";

import { BASE_ENDPOINT } from "../../config";

import userApi from "../../services/userApi";
import locationsApi from "../../services/locationsApi";
import destinationApi from "../../services/destinationApi";

import routes from "../../routes";

const { Option } = Select;

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const YouPage = () => {
  const navigate = useNavigate();
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
      console.log("USER", response);
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

  const onFinish = async (values) => {
    setIsLoading(true);
    const {
      username,
      email,
      fullName,
      contactEmail,
      contactInstagram,
      contactNumber,
      location,
    } = values;
    console.log("val", values);
    // console.log("loc", locationObject);
    try {
      const response = await userApi.updateUser(
        user.id,
        username,
        email,
        fullName,
        contactEmail,
        contactInstagram,
        contactNumber
      );
      console.log("RESP", response);
      console.log("RESP stat", response.status_code);
      if (location !== user?.destinations[0].id) {
        const locationObject = locations.find((item) => item.id === location);
        await destinationApi.updateCurrentDestination(user?.destinations[0].id);
        //   //   TODO george update for adding future destinations
        console.log("Loc", locationObject);
        await destinationApi.addDestination(user.id, locationObject);
      }

      setIsLoading(false);
    } catch (error) {
      message.error(`Profile update failed: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Divider>You</Divider>
      {user ? (
        <Form
          className="you-form"
          initialValues={{
            email: user?.email,
            username: user?.username,
            fullName: user?.fullName,
            location: user?.destinations[0].location.id,
            contactEmail: user?.contactEmail,
            contactInstagram: user?.contactInstagram,
            contactNumber: user?.contactNumber,
          }}
          scrollToFirstError
          onFinish={onFinish}
        >
          <Row style={{ margin: 24 }}>
            <Card
              style={{
                width: "100%",
              }}
              cover={
                <img
                  alt={user?.fullName}
                  src={`${BASE_ENDPOINT}${user?.profileImage?.url}`}
                />
              }
              loading={isLoading}
            >
              <Form.Item
                name="fullName"
                label="Full name"
                tooltip="This is how users will recognise you outside of your username."
                rules={[
                  {
                    required: true,
                    message: "Please input your name",
                    whitespace: true,
                  },
                ]}
              >
                <Input placeholder="George Ballard" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                tooltip="This will only be used for login and password reset. We won't send you any nonsense."
                rules={[
                  {
                    type: "email",
                    message: "The input is not valid email.",
                  },
                  {
                    required: true,
                    message: "Please input your email.",
                  },
                ]}
              >
                <Input placeholder="georgeballard@gmail.com" />
              </Form.Item>
              <Form.Item
                name="username"
                label="Username"
                placeholder="beyoncebooty"
                tooltip="This is how other users will find you. It is recommended that you reuse your instagram handle."
                rules={[
                  {
                    required: true,
                    message: "Please input your username",
                    whitespace: true,
                  },
                ]}
              >
                <Input placeholder="beyoncebooty" />
              </Form.Item>
            </Card>
          </Row>

          <Row style={{ margin: 24 }}>
            <Card
              title={
                <Tooltip title="This is how friends will contact you.">
                  How will friends contact you
                </Tooltip>
              }
              style={{
                width: "100%",
              }}
              loading={isLoading}
            >
              <Form.Item
                name="contactEmail"
                label="Email"
                rules={[
                  {
                    type: "email",
                    message: "The input is not valid email.",
                  },
                ]}
              >
                <Input placeholder="georgeballard@gmail.com" />
              </Form.Item>
              <Form.Item
                name="contactInstagram"
                label="Instagram"
                placeholder="beyoncebooty"
              >
                <Input placeholder="beyoncebooty" />
              </Form.Item>
              <Form.Item
                name="contactNumber"
                label="Phone number (WhatsApp/Signal etc)"
                tooltip="Add the country code to ensure that you appear correctly in WhatsApp, Signal etc."
              >
                <Input placeholder="+447804233529" />
              </Form.Item>
            </Card>
          </Row>
          {user?.destinations[0].location.id && (
            <Row style={{ margin: 24 }}>
              <Card
                title="Current location"
                style={{
                  width: "100%",
                }}
                loading={isLoading}
              >
                <Form.Item
                  name="location"
                  label="Current location"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select placeholder="Select a option" allowClear>
                    {locations &&
                      locations.map((item) => (
                        <Option key={item.id} value={item.id}>
                          {item.attributes.country}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Card>
            </Row>
          )}
          <Row type="flex" justify="space-around" style={{ marginBottom: 24 }}>
            <Form.Item {...tailFormItemLayout}>
              <Button htmlType="submit" loading={isLoading}>
                Update
              </Button>
            </Form.Item>
            <Button
              style={{ ...tailFormItemLayout }}
              loading={isLoading}
              onClick={() => {
                localStorage.removeItem("token");
                navigate(routes.login);
              }}
            >
              Log out
            </Button>
          </Row>
        </Form>
      ) : (
        <Row type="flex" justify="space-around" style={{ marginTop: 80 }}>
          <Spin size="large" />
        </Row>
      )}
    </>
  );
};

export default YouPage;
