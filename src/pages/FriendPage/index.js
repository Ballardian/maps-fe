import React, { useState, useEffect } from "react";
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
  Tabs,
  Skeleton,
  Switch,
  List,
  Space,
  Spin,
} from "antd";
import {
  TeamOutlined,
  UsergroupAddOutlined,
  UserDeleteOutlined,
  UserAddOutlined,
  QuestionCircleOutlined,
  UserSwitchOutlined,
  SendOutlined,
} from "@ant-design/icons";
import userApi from "../../services/userApi";
import friendsApi from "../../services/friendsApi";

import { friendStatus } from "../../constants";

const { TabPane } = Tabs;
const { Meta } = Card;
const { Search } = Input;

const FriendPage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const [unacceptedFriends, setUnacceptedFriends] = useState([]);
  const [showBlockModal, setShowBlockModal] = useState(null);
  const [showAcceptModal, setShowAcceptModal] = useState(null);
  const [showSendRequestModal, setShowSendRequestModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState(null);

  useEffect(() => {
    // TODO george remove once log out button ready
    // localStorage.removeItem("token");
    // TODO george add info to redux upon sign in / initial load
    // fetchUser();
    const userId = localStorage.getItem("id");
    if (userId) {
      fetchFriends(userId);
    }
    setIsLoading(false);
  }, []);

  //   const fetchUser = async () => {
  //     try {
  //       // TODO george could just use
  //       localStorage.getItem("token");
  //       const response = await userApi.fetchCurrentUserSummary();
  //       console.log("USER", response);
  //       setUser(response);
  //     } catch (error) {
  //       message.error(`Fetching user failed: ${error.message}`);
  //       setIsLoading(false);
  //     }
  //   };

  const fetchFriends = async (userId) => {
    try {
      const response = await friendsApi.fetchFriends(userId);
      console.log("friends", response);
      const [acceptedFriendsArray, unacceptedFriendsArray] = sortFriends(
        response.data
      );
      console.log("acc friends Arr", acceptedFriendsArray);
      setAcceptedFriends(acceptedFriendsArray);
      setUnacceptedFriends(unacceptedFriendsArray);
      console.log("acc friends", acceptedFriends);
      console.log("unacc friends", unacceptedFriends);
    } catch (error) {
      message.error(`Fetching user failed: ${error.message}`);
      setIsLoading(false);
    }
  };

  const sortFriends = (friends) => {
    // TODO george move logic to BE
    const acceptedFriendsArray = friends.filter(
      (item) => item.attributes.friend.status !== friendStatus.ACCEPTED
    );
    const unacceptedFriendsArray = friends.filter(
      (item) => item.attributes.friend.status === friendStatus.ACCEPTED
    );
    return [acceptedFriendsArray, unacceptedFriendsArray];
  };

  return (
    <>
      <Divider>Friends</Divider>
      <Tabs defaultActiveKey="1" style={{ margin: 16 }}>
        <TabPane
          tab={
            <span>
              <UserAddOutlined />
              Add friends
            </span>
          }
          key="1"
        >
          <Search
            placeholder="input search text"
            onSearch={(value) => setSearch(value)}
            style={{
              width: "100%",
            }}
            loading={isLoading}
          />
          {isLoading ? (
            <Row type="flex" justify="space-around" style={{ marginTop: 80 }}>
              <Spin size="large" />
            </Row>
          ) : (
            <Card style={{ width: "100%", marginTop: 16 }} loading={isLoading}>
              <Row type="flex" justify="space-between">
                <Col span={18}>
                  <Meta
                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                    title="Card title"
                    description="This is the description"
                  />
                </Col>
                <Col
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    shape="circle"
                    icon={<SendOutlined />}
                    onClick={(item) => {
                      setSelectedItem(item);
                      setShowSendRequestModal(true);
                    }}
                  />
                </Col>
              </Row>
            </Card>
          )}
        </TabPane>
        <TabPane
          tab={
            <span>
              <UsergroupAddOutlined />
              Requests
            </span>
          }
          key="2"
        >
          {isLoading ? (
            <Row type="flex" justify="space-around" style={{ marginTop: 80 }}>
              <Spin size="large" />
            </Row>
          ) : (
            <List
              loading={isLoading}
              itemLayout="horizontal"
              size="large"
              pagination={{
                onChange: (page) => {
                  console.log(page);
                },
                pageSize: 3,
              }}
              style={{ margin: 16 }}
              dataSource={acceptedFriends}
              renderItem={(item) => (
                <List.Item>
                  <Skeleton avatar title={false} loading={item.loading} active>
                    <List.Item.Meta
                      avatar={
                        <Avatar src="https://joeschmoe.io/api/v1/random" />
                      }
                      title="Card title"
                      description="This is the description"
                    />
                    <Row style={{ margin: 8 }}>
                      <Button
                        shape="circle"
                        icon={<UserAddOutlined />}
                        onClick={(item) => {
                          setSelectedItem(item);
                          setShowAcceptModal(true);
                        }}
                      />
                    </Row>
                    <Row style={{ margin: 8 }}>
                      <Button
                        shape="circle"
                        icon={<UserDeleteOutlined />}
                        onClick={(item) => {
                          setSelectedItem(item);
                          setShowBlockModal(true);
                        }}
                      />
                    </Row>
                  </Skeleton>
                </List.Item>
              )}
            />
          )}
        </TabPane>
        <TabPane
          tab={
            <span>
              <TeamOutlined />
              Friends
            </span>
          }
          key="3"
        >
          {isLoading ? (
            <Row type="flex" justify="space-around" style={{ marginTop: 80 }}>
              <Spin size="large" />
            </Row>
          ) : (
            <List
              loading={isLoading}
              itemLayout="horizontal"
              size="large"
              pagination={{
                onChange: (page) => {
                  console.log(page);
                },
                pageSize: 3,
              }}
              style={{ margin: 16 }}
              dataSource={acceptedFriends}
              renderItem={(item) => (
                <List.Item>
                  <Skeleton avatar title={false} loading={item.loading} active>
                    <List.Item.Meta
                      avatar={
                        <Avatar src="https://joeschmoe.io/api/v1/random" />
                      }
                      title="Card title"
                      description="This is the description"
                    />
                    <Row style={{ margin: 8 }}>
                      <Button shape="circle" icon={<UserDeleteOutlined />} />
                    </Row>
                  </Skeleton>
                </List.Item>
              )}
            />
          )}
        </TabPane>
      </Tabs>
    </>
  );
};

export default FriendPage;
