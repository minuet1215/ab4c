import React, { useState, useEffect } from "react";
import SearchFriend from "../SearchFriend/SearchFriend";
import Header from "../Header/Header";
import { auth } from "../../_actions/user_action";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Skeleton, Switch } from "antd";

import Loading from "../Loading/Loading";

function FriendsAnbang() {
  const [loading, setLoading] = useState(true);
  const [friendsInfo, setFriendsInfo] = useState([]);
  const { Meta } = Card;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(auth()).then((res) => {
      axios
        .get(`api/friends/me/friendsList/${res.payload._id}`)
        .then((response) => {
          setFriendsInfo(response.data);
          setLoading(false);
        });
    });
  }, [friendsInfo]);

  return (
    <div className="outer_container">
      <div>{loading ? <Loading /> : null}</div>
      <Header />
      <SearchFriend />
      <div style={{'margin-top' : 50}}>
        {friendsInfo.map((item, index) => (
          <div key={index} style={{'margin-bottom' : 20}}>
            <Card
              style={{
                width: 550,
                // marginTop: 16,
                margin : 'auto',
              }}
              hoverable
            >
              <Skeleton loading={loading} avatar active>
                <Meta
                  avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                  title= {item + "님의 안방"}
                  description="방문하기"
                />
              </Skeleton>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FriendsAnbang;
