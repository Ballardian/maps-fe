import React, { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
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
import registerApi from "../../services/registerApi";
import destinationApi from "../../services/destinationApi";
import locationsApi from "../../services/locationsApi";
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

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

const normFile = (e) => {
  console.log("Upload event:", e);

  if (Array.isArray(e)) {
    return e;
  }

  return e?.fileList;
};

const RegisterPage = () => {
  const [isLoading, setLoading] = useState(false);
  const [locations, setLocations] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await locationsApi.fetchLocations();
      setLocations(response.data);
      setLoading(false);
    } catch (error) {
      message.error(`Registration failed: ${error.message}`);
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    const { username, email, password, fullName, profileImage, location } =
      values;
    const locationObject = locations.find((item) => item.id === location);
    const profileImageFile = profileImage[0];
    console.log("val", values);
    console.log("loc", locationObject);
    try {
      const response = await registerApi.registerUser(
        username,
        email,
        password,
        fullName
      );
      await registerApi.uploadProfileImage(profileImageFile, response.user.id);
      // TODO george randomise locationObject.attributes.lat/long and assign to new fields in destination
      await destinationApi.addDestination(response.user.id, location);
      setLoading(false);
    } catch (error) {
      message.error(`Registration failed: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
    >
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
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: "Please input your password.",
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your password",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }

              return Promise.reject(
                new Error("The two passwords that you entered do not match.")
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

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
      <Form.Item
        name="profileImage"
        label="Upload profile picture"
        tooltip="Please use an image of your face, otherwise your account may be flagged as a bot."
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[
          {
            required: true,
          },
        ]}
      >
        {/* TODO george add file restriction errors */}
        <Upload
          listType="picture"
          action={(data) => form.setFieldsValue("profileImage", data)}
          beforeUpload={() => false}
          accept=".jpg,.jpeg,.png"
        >
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterPage;
