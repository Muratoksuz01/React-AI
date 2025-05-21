import React, { useRef, useEffect } from 'react';
import * as bodySegmentation from '@tensorflow-models/body-pix';
import Webcam from 'react-webcam';

function BodySegmentationComponent() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);


  async function runBodySegmentation() {
    const net = await bodySegmentation.load()
    console.log('Model yüklendi');

    setInterval(() => {
      detect(net);
    }, 100);
  }

  runBodySegmentation();


  async function detect(net) {
    if (
      webcamRef.current &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const person = await net.segmentPersonParts(video);
      console.log(person)
      const coloredPartImage = bodySegmentation.toColoredPartMask(person)// diger fok da varbunalr icin ctrl ile icerige bak 
      bodySegmentation.drawMask(
        canvasRef.current,
        video,
        coloredPartImage,
        0.7,
        0,
        false
      )

    }
  }

  return (
    <>
      <Webcam
        ref={webcamRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 9,
          width: 640,
          height: 480,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 10,
          width: 640,
          height: 480,
        }}
      />
    </>
  );
}

export default BodySegmentationComponent;
