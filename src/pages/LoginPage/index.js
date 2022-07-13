import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Upload,
  message,
} from "antd";

import loginApi from "../../services/loginApi";
import routes from "../../routes";

const LoginPage = (props) => {
  const [isLoading, setLoading] = useState(false);
  const [loggedIn, setloggedIn] = useState(
    localStorage.getItem("token") ? true : false
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setloggedIn(true);
    }
  }, [loggedIn]);

  const onFinish = async (values) => {
    setLoading(true);
    const { username, password } = values;
    try {
      const response = await loginApi.login(username, password);
      const { jwt } = response;
      localStorage.setItem("token", jwt);
      setloggedIn(true);
      setLoading(false);
    } catch (error) {
      message.error(`Login failed: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <>
      {loggedIn && <Navigate to={routes.map} replace={true} />}
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username or email",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username or email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Row>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={isLoading}
            >
              Log in
            </Button>
          </Row>
          <Row>
            <Link to={routes.register}>or register</Link>
          </Row>
        </Form.Item>
      </Form>
    </>
  );
};

export default LoginPage;
