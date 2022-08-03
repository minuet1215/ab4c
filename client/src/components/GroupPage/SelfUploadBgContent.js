import React, { useState } from "react";

function SelfUploadBgContent() {
  const [_, setImgBase64] = useState(""); // 업로드 될 이미지
  const [imgFile, setImgFile] = useState(null); // 파일 전송을 위한 state
  // 뒷배경 바꾸기
  const handleChangeFile = (event) => {
    let reader = new FileReader();

    reader.onloadend = (e) => {
      // 2. 읽기가 완료되면 아래 코드 실행
      const base64 = reader.result;
      if (base64) {
        // 파일 base64 상태 업데이트
        setImgBase64(base64.toString());
      }
    };
    if (event.target.files[0]) {
      // 1. 파일을 읽어 버퍼에 저장
      reader.readAsDataURL(event.target.files[0]);
      // 파일 상태 업데이트
      setImgFile(event.target.files[0]);
    }
  };
  return (
    <div>
      {/* <label className={styles.upload_label} for="imgFile">
        커스텀 배경 적용하기
      </label> */}
      <input
        type="file"
        id="imgFile"
        // style={{ display: "none" }}
        onChange={handleChangeFile}
      />
    </div>
  );
}

export default SelfUploadBgContent;
