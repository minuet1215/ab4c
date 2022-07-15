import React, { useEffect, useRef, useState } from "react";

interface Props {
  email: string;
  stream: MediaStream;
  muted?: boolean;
}

const Video = ({ email, stream, muted }: Props) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
    if (muted) setIsMuted(muted);
  }, [stream, muted]);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        width: "240px",
        height: "270px",
        margin: "5px",
      }}
    >
      <video
        style={{
          width: "240px",
          height: "240px",
          backgroundColor: "black",
        }}
        ref={ref}
        muted={isMuted}
        autoPlay
      />
      <p
        style={{
          display: "inline-block",
          position: "absolute",
          top: "230px",
          left: "0px",
        }}
      >
        {email}
      </p>
    </div>
  );
};

export default Video;
