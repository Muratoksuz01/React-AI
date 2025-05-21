import React, { useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import Webcam from 'react-webcam';
import { drawKeypoints, drawSkeleton } from '../utilities/bodypose_utilities';

function BodyposeComponents() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.5
    });
    console.log('runPosenet model loaded.');
    setInterval(() => {
      detect(net);
    }, 100);
  };
  runPosenet();
  const detect = async (net) => {
    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const pose = await net.estimateSinglePose(video);
      const ctx = canvasRef.current.getContext('2d');
      console.log(pose);
      ctx.clearRect(0, 0, videoWidth, videoHeight); // Canvas'ı temizle

      // Kameradan gelen video görüntüsünü çiz (opsiyonel)
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

      drawKeypoints(pose.keypoints, 0.3, ctx);
      drawSkeleton(pose.keypoints, 0.3, ctx);
    }
  };
  return (
    <div>
      <Webcam
        ref={webcamRef}
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          width: 640,
          height: 480,
          zIndex: 9,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          width: 640,
          height: 480,
          zIndex: 9,
        }}
      />
    </div>
  )
}

export default BodyposeComponents