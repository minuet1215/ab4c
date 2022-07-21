import React from "react";

export default function StickerRow({ onStickerSelected }) {
  const stickers = [
    "https://cdn-icons-png.flaticon.com/128/7560/7560955.png",
    "https://cdn-icons-png.flaticon.com/128/149/149456.png",
    "https://cdn-icons-png.flaticon.com/128/159/159117.png",
    "https://cdn-icons-png.flaticon.com/128/159/159108.png",
    "https://cdn-icons-png.flaticon.com/128/7870/7870571.png",
    "https://cdn-icons-png.flaticon.com/128/744/744546.png",
    "https://cdn-icons-png.flaticon.com/128/5259/5259457.png",
    "https://cdn-icons-png.flaticon.com/128/6532/6532955.png",
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
