const fingerJoints = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
};

export const drawHand = (predictions, ctx) => {
    if (predictions.length > 0) {
        predictions.forEach((prediction) => {
            const landmarks = prediction.landmarks;

            // parmak çizgileri
            for (let i = 0; i < Object.keys(fingerJoints).length; i++) {
                const finger = Object.keys(fingerJoints)[i];
                for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
                    const firstJoinIndex = fingerJoints[finger][k];
                    const secondJoinIndex = fingerJoints[finger][k + 1];

                    const firstLandmark = landmarks[firstJoinIndex];
                    const secondLandmark = landmarks[secondJoinIndex];

                    if (firstLandmark && secondLandmark) {
                        ctx.beginPath();
                        ctx.moveTo(firstLandmark[0], firstLandmark[1]);
                        ctx.lineTo(secondLandmark[0], secondLandmark[1]);
                        ctx.strokeStyle = "aqua";
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }
                }
            }

            // noktaları çiz
            for (let i = 0; i < landmarks.length; i++) {
                const [x, y] = landmarks[i];
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 2 * Math.PI);
                ctx.fillStyle = "red";
                ctx.fill();
            }
        });
    }
};
