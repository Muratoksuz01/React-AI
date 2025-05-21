import React, { useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import Webcam from 'react-webcam';
import { drawHand } from '../utilities/handpose_utilities';

import * as fp from "fingerpose";
import victory from "../victory.png";
import thumbs_up from "../thumbs_up.png";

function GestureRegognitionComponents() {
    const [emoji, setEmoji] = useState(null);
    const images = { thumbs_up: thumbs_up, victory: victory };
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const runHandpose = async () => {
        const net = await handpose.load();
        console.log('Handpose model loaded.');
        setInterval(() => {
            detect(net);
        }, 100);
    };
    runHandpose();
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

            const hand = await net.estimateHands(video);
            const ctx = canvasRef.current.getContext('2d');
            //  console.log(hand);

            if (hand.length > 0) {
                const GE = new fp.GestureEstimator([
                    fp.Gestures.VictoryGesture,
                    fp.Gestures.ThumbsUpGesture,
                ]);
                const gesture = await GE.estimate(hand[0].landmarks, 4);
                 console.log(gesture)
                if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
                    const confidence = gesture.gestures.map(
                        (prediction) => prediction.score
                    );
                    //console.log("confidence", gesture);
                    const maxConfidence = confidence.indexOf(
                        Math.max.apply(null, confidence)
                    );
                  //  console.log("maxConfidence", maxConfidence);
                    const bestGesture = gesture.gestures[maxConfidence];

                    if (bestGesture && bestGesture.name) {
                        setEmoji(bestGesture.name);
                        console.log(bestGesture.name);
                    } else {
                        console.warn('Tanımlı bir gesture bulunamadı!');
                    }
                }
            }
            ///////// NEW STUFF ADDED GESTURE HANDLING

            // Draw mesh
            drawHand(hand, ctx);
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
            {/* NEW STUFF */}
            {emoji !== null ? (
                <img
                    src={images[emoji]}
                    style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 400,
                        bottom: 500,
                        right: 0,
                        textAlign: "center",
                        height: 100,
                        zIndex:12
                    }}
                />
            ) : (
                ""
            )}

            {/* NEW STUFF */}
        </div>
    )
}

export default GestureRegognitionComponents