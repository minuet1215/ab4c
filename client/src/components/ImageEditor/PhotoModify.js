import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

function PhotoModify(props) {
    const navigate = useNavigate();

    const modifyHandler = () => {
        navigate('/editPhoto', {state : {path : props.img}});
    }
    return (
        <Button onClick={modifyHandler}>수정하기</Button>
    )
}
export default PhotoModify;