import React, { useState, useEffect } from "react";
import SearchFriend from "./SearchFriend";
import Header from "../Header/Header";
import { auth } from "../../_actions/user_action";
import { useDispatch } from "react-redux";
import axios from "axios";
import enterRoomP from "../../img/enterRoomP.png";
import { useNavigate } from "react-router-dom";

import { Avatar, Card } from "antd";

import Loading from "../Loading/Loading";

function FriendsList() {
  const navigate = useNavigate();
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
  }, [dispatch]);

  return (
    <div className="outer_container">
      <div>{loading ? <Loading /> : null}</div>
      <Header />
      <SearchFriend />
      <div style={{ marginTop: 50 }}>
        {friendsInfo.map((item, index) => (
          <div key={index} style={{ marginBottom: 20 }}>
            <Card
              onClick={() => {
                navigate("/friendAnbang", {
                  state: { targetId: item.email, targetName: item.name },
                });
              }}
              style={{
                maxWidth: "550px",
                margin: "auto",
                border: "2.5px solid #fc8da1",
              }}
              hoverable
            >
              <Meta
                avatar={<Avatar src={item.profileImage} />}
                title={item.name + "님의 안방"}
                description={item.email}
              />
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FriendsList;
