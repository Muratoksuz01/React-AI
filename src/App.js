import React, { useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import Webcam from 'react-webcam';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const runFaceDetection = async () => {
      await tf.setBackend('webgl');
      await tf.ready();

      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;

      const detectorConfig = {
        runtime: 'tfjs',
      };

      const detector = await faceLandmarksDetection.createDetector(model, detectorConfig);

      setInterval(() => detect(detector), 100);
    };

    runFaceDetection();
  }, []);

  const detect = async (detector) => {
    if (
      webcamRef.current &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      video.width = videoWidth;
      video.height = videoHeight;
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const faces = await detector.estimateFaces(video);

      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, videoWidth, videoHeight);

      if (faces.length > 0) {
        faces.forEach((face) => {
          face.keypoints.forEach((point) => {
            const { x, y } = point;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
          });
        });
      }
    }
  };

  return (
    <div className="App">
      <Webcam
        ref={webcamRef}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          margin: 'auto',
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
          right: 0,
          margin: 'auto',
          zIndex: 9,
          width: 640,
          height: 480,
        }}
      />
    </div>
  );
}

export default App;
