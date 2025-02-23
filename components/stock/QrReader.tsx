import { useEffect, useRef, useState } from "react";
import QrFrame from "../assets/qr-frame.svg";
import QrScanner from "qr-scanner";
import "./QrStyles.css";

export default function Scanner() {
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);

  return (
    <div className="qr-reader">
      <video ref={videoEl}></video>
      <div ref={qrBoxEl} className="qr-box">
        <img
          src={QrFrame}
          alt="Qr Frame"
          width={256}
          height={256}
          className="qr-frame"
        />
      </div>
    </div>
  );
}
