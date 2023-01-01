const cam = document.querySelector('#video')
const button = document.querySelector('#expressionButton')
const qouteForm = document.querySelector('#qoute-input')
const authorInput = document.querySelector('#authorInput')
const emotionSelect = document.querySelector('#expression-select')
const form = document.querySelector('form')
const qouteRes = document.querySelector('#qoute-response') 
const allQoutes = document.querySelector('#getAllQoutes') 

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

async function expressionButton() {
    // const canvas = faceapi.createCanvasFromMedia(video)
    // document.body.append(canvas) 
    // const displaySize = { width: cam.width, height: cam.height }

    const detections = await faceapi.detectAllFaces(cam,new faceapi.TinyFaceDetectorOptions()).withFaceExpressions() 
        
    // .withFaceLandmarks() 
    
    // const resizedDetections = faceapi.resizeResults(detections, displaySize) 
    
    
    // canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
    
    // faceapi.draw.drawDetections(canvas, resizedDetections)
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections) 
    // console.log(detections[0]['expressions']);
    // console.log(detections);
    
    let  {neutral, happy, sad, angry, surprised,fearful,disgusted}=  await detections[0].expressions

    console.log(detections[0]['expressions']);
    let emotionArr = [neutral, happy, sad, angry, surprised,fearful,disgusted]

    
    newARR = await ifFloat(emotionArr)
    // console.log(newARR);
    max = Math.max.apply(Math,[...newARR])
    console.log(max);
    let index =  emotionArr.findIndex(el => el === Math.max.apply(Math,[...newARR]))
    // console.log(index);
    let emotionMain = await matchIndex(index)
    console.log(emotionMain);

    getQoute(emotionMain)
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
        emotion = 'anger'
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
        
    
function handleSubmit(e) {
    e.preventDefault()
    if (qouteForm.value < 1 ) {
        alert ('You must enter a qoute')
        return
    }
    if (authorInput.value < 1 ) {
        alert ('You must enter a author')
        return
    }
    let body = {
        qoute: qouteForm.value, 
        emotionSelect: emotionSelect.value, 
        author: authorInput.value
    }
    axios.post('http://localhost:8765/addQoute', body)
    .then(()=>alert ('Added to Qoutes'))
    .catch(err => console.log(err))
}
function getQoute(emotions){
    let body = {
        emotion:emotions
    }
    qouteRes.innerHTML = ''
    console.log(body);
    axios.post(`http://localhost:8765/getQoute`,body)
    .then((res) => {
        console.log(res.data[0]);
        let qouteCard = `
        <div class="qoute-card">
                    <h2>${res.data[0].qoute},</h2>
                    <h3>Author: ${res.data[0].author} Emotion:${res.data[0].emotion}</h3>
                    </div>
        `
        qouteRes.innerHTML += qouteCard
    } )
        
}


form.addEventListener('submit',handleSubmit)
function ifFloat(emotions) {
    newEmotionArr = []
    for (i=0;i<emotions.length;i++){
        let numStr = String(emotions[i]);
        if (numStr.indexOf('e') === -1) {
            newEmotionArr.push(emotions[i])}}
    return newEmotionArr}