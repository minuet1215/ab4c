import { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const ImgPreview = styled.img`
  border-style: solid;
  border-color: black;
  width: 250px;
  height: 250px;
  margin: 30px;
  position: absolute;
  left: 41%;
  right: 50%;
`;

const UploadImage = styled.input`
  height: 30px;
  position: absolute;
  left: 50%;
  right: 30%;
  margin-top: 300px;
`;

const ViewImage = styled.button`
  height: 30px;
  position: absolute;
  left: 50%;
  right: 35%;
  margin-top: 350px;
`;

export default function Main() {
  const [img, setImg] = useState("");

  const formSubmit = (e) => {
    const img = e.target.files[0];
    const formData = new FormData();
    formData.append("file", img);
    // console.log(formData.data.location);

    axios
      .post("/api/test/img", formData)
      .then((res) => {
        setImg(res.data.location);
        alert("성공");
      })
      .catch((err) => {
        alert("실패");
        console.log(err);
      });
  };

  return (
    <div>
      <div className="img-preview">
        <ImgPreview id="img-preview" src={img} />
        <UploadImage
          type="file"
          accept="image/*"
          id="img"
          onChange={formSubmit}
        ></UploadImage>
      </div>
    </div>
  );
}
