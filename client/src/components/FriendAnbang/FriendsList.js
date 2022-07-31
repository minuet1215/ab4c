import React, { useState, useEffect } from "react";
import SearchFriend from "./SearchFriend";
import Header from "../Header/Header";
import { auth } from "../../_actions/user_action";
import { useDispatch } from "react-redux";
import axios from "axios";
import enterRoomP from "../../img/enterRoomP.png";
import { useNavigate } from "react-router-dom";

import { Avatar, Card, Button } from "antd";

import Loading from "../Loading/Loading";
import { toast } from "react-toastify";

function FriendsList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [myId, setMyId] = useState('')
  const [loading, setLoading] = useState(true);
  const [friendsInfo, setFriendsInfo] = useState([]);
  const { Meta } = Card;
  const [isModalVisible, setModalVisible] = useState(false);
  const [removeCnt, setRemoveCnt] = useState(0)

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };
  
  const removeFriend = (event) => {
    const removeConfirm = window.confirm('삭제하시겠습니까?');
    if (removeConfirm){
      const friendEmail = event.target.id;
      axios.patch(`api/friends/delete/${friendEmail}`,{id : myId})
      .then((response) => {
        if (response.data.success){
          toast.success('삭제에 성공했습니다.')
          setRemoveCnt(removeCnt+1)       
        }else{
          toast.success('삭제에 실패했습니다.')
        }
      })
    }
  }
  
  useEffect(() => {
    dispatch(auth()).then((res) => {
      setMyId(res.payload._id)
      axios
        .get(`api/friends/me/friendsList/${res.payload._id}`)
        .then((response) => {
          setFriendsInfo(response.data);
          setLoading(false);
        });
    });
  }, [dispatch, isModalVisible, removeCnt]);
  
  return (
    <div className="outer_container">
      <div>{loading ? <Loading /> : null}</div>
      <Header />
      <SearchFriend 
      showModal = {showModal}
      hideModal = {hideModal}
      isModalVisible = {isModalVisible} />
      <div style={{height:'600px',overflow:'scroll'}}>
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
            <p>
            <button style={{'float' : 'right'}} id={item.email} onClick={removeFriend}>삭제</button>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FriendsList;
