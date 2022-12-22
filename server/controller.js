module.exports={
    startVideo
}

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'), 
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'), 
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'), 
    faceapi.nets.faceExpressionNet.loadFromUri('/models') 
    
]).then(startVideo)

async function startVideo() {
    const constraints = { video: true };

    try {
        let stream = await navigator.mediaDevices.getUserMedia(constraints);

        cam.srcObject = stream;
        cam.onloadedmetadata = e => {
            cam.play();
        }

    } catch (err) {
        console.error(err);
    }
}