import React from "react";

export default function StickerRow({ onStickerSelected }) {
  const stickers = [
    "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/e2d79bae-f5aa-4b85-8741-76515513f290/icon-summer.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220720%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220720T043312Z&X-Amz-Expires=86400&X-Amz-Signature=11271c08592520a0516c40f112d3d16fca1e2d45b14bb30f9438701edd1b4960&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22icon-summer.png%22&x-id=GetObject",
    "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/2faa0688-9c05-46f6-972e-f5831fb387a2/hearts.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220720%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220720T043343Z&X-Amz-Expires=86400&X-Amz-Signature=0b072a776f079957c7e99790ffc327d8897651b36a2ae32a963d1731614e98fd&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22hearts.png%22&x-id=GetObject",
    "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/f82eeb57-6e59-49d6-bc1f-9a90abf40a70/heart.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220720%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220720T043352Z&X-Amz-Expires=86400&X-Amz-Signature=f92a2ea915641eeefd6465fa85ff0530bafdb4fcac126eeb66be2403675206ad&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22heart.png%22&x-id=GetObject",
    "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/57e7a17b-6c60-4148-816a-7a5353250376/icon-hero.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220720%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220720T043403Z&X-Amz-Expires=86400&X-Amz-Signature=ae69aa9cf5d5c315f1b8e7cb783f6ef9e4c4611dc8e113351e2072a2a4d1f365&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22icon-hero.png%22&x-id=GetObject",
    "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/bf1527eb-feaa-45b8-90a3-1ad4ee1761dd/icon-ironman.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220720%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220720T043411Z&X-Amz-Expires=86400&X-Amz-Signature=750f4ddd6a53e2095841bb98491d504d950a5b725beb65c941ef7ec276e8250c&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22icon-ironman.png%22&x-id=GetObject",
    "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/aa319b2c-1158-4afe-898b-5816769c7f47/icon-spiderman.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220720%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220720T043419Z&X-Amz-Expires=86400&X-Amz-Signature=8ff1ae997bc14c328aed864da9b0ec8447310cf7cb727ce9f8b3ea1d031e0aed&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22icon-spiderman.png%22&x-id=GetObject",
  ];

  return (
    <>
      <div className="sticker-container">
        {stickers.map((path, i) => (
          <img
            key={i}
            onClick={() => onStickerSelected(path)}
            src={path}
            alt="sticker"
          />
        ))}
      </div>
    </>
  );
}
