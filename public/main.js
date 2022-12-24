const cam = document.querySelector('#video')
const button = document.querySelector('#expressionButton')
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

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'), 
    // faceapi.nets.faceLandmark68Net.loadFromUri('/models'), 
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'), 
    faceapi.nets.faceExpressionNet.loadFromUri('/models') 
    
]).then(startVideo)

const expressionButton = async()=> {
    // const canvas = faceapi.createCanvasFromMedia(video)
    // document.body.append(canvas) 
    // const displaySize = { width: cam.width, height: cam.height }
    // faceapi.matchDimensions(canvas, displaySize)
    const detectionPaint = async () => {  
        const detections = await faceapi.detectAllFaces(cam,new faceapi.TinyFaceDetectorOptions()).withFaceExpressions() 
            // .withFaceLandmarks() 
            
            // const resizedDetections = faceapi.resizeResults(detections, displaySize) 
            
            
            // canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
            
            // faceapi.draw.drawDetections(canvas, resizedDetections)
            // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
            // faceapi.draw.drawFaceExpressions(canvas, resizedDetections) 
            // console.log(detections[0]['expressions']);
            let {neutral, happy, sad, angry, surprised,fearful,disgusted}= detections[0]['expressions']
            // console.log(detections[0]['expressions']);
            let emotionArr = [neutral, happy, sad, angry, surprised,fearful,disgusted]
            function ifFloat(emotions) {
                newEmotionArr = []
                for (i=0;i<emotions.length;i++){
                    let numStr = String(emotions[i]);
                    if (numStr.indexOf('e') === -1) {
                        newEmotionArr.push(emotions[i])}}
                return newEmotionArr
            }
            newARR = ifFloat(emotionArr)
            // console.log(newARR);
            max = Math.max.apply(Math,[...newARR])
            console.log(max);
            let index = emotionArr.findIndex(el => el === Math.max.apply(Math,[...newARR]))
            // console.log(index);
            var emotionMain = matchIndex(index)
            console.log(emotionMain);
        }
        detectionPaint()
        
    }
    button.addEventListener('click', expressionButton)
    
    function matchIndex(index) {
        if (index ==0){
        emotion = 'neutral'
        } 
        else if (index ==1){
            emotion = 'happy'
        }
        else if (index ==2){
            emotion = 'sad'
        }
        else if (index ==3){
        emotion = 'angry'
        }
        else if (index ==4){
            emotion = 'suprised'
        }
        else if (index ==5){
            emotion = 'fearful'
        }
        else if (index ==6){
            emotion = 'disgusted'
        }
        return emotion
    }
        
       