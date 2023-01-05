const cam = document.querySelector('#video')
const button = document.querySelector('#expressionButton')
const qouteForm = document.querySelector('#qoute-input')
const authorInput = document.querySelector('#authorInput')
const emotionSelect = document.querySelector('#expression-select')
const form = document.querySelector('form')
const qouteRes = document.querySelector('#qoute-response') 
const carouselRes = document.querySelector('#carouselRES') 
const allQoutes = document.querySelector('#getAllQoutes') 
const placer = document.querySelector('#gifPlaceholder') 

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
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'), 
    faceapi.nets.faceExpressionNet.loadFromUri('/models') 
    
]).then(startVideo)

async function expressionButton() {
    const detections = await faceapi.detectAllFaces(cam,new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()  
    
    let  {neutral, happy, sad, angry, surprised,fearful,disgusted}=  await detections[0].expressions
    console.log(detections[0].expressions);
    let emotionArr = [neutral, happy, sad, angry, surprised,fearful,disgusted]

    
    newARR = await ifFloat(emotionArr)
    max = Math.max.apply(Math,[...newARR])
    let index =  emotionArr.findIndex(el => el === Math.max.apply(Math,[...newARR]))
    var emotionMain = await matchIndex(index)

    getQoute(emotionMain)
    getGIF(emotionMain)
}

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
        <div class="qoutecard">
        <h2 id='qouteDisplay'>"${res.data[0].qoute}"</h2>
        <h3 id='author'>Author: ${res.data[0].author}</h3>
        <h3 id='emotion'>Qoute: ${res.data[0].emotion}</h3>
        </div>
        `
        qouteRes.innerHTML += qouteCard
    } )
    
}

function getGIF(emotion){
    placer.remove()
    carouselRes.innerHTML = ''
    axios.post('http://localhost:8765/getGIF',{emotion})
    .then(res => {
        let {url: gifOne} = res.data.data[0].images.original
        let {title: gifOneAlt} = res.data.data[0]
        let {url: gifTwo} = res.data.data[1].images.original
        let {title: gifTwoAlt} = res.data.data[1]
        let {url: gifThree} = res.data.data[2].images.original
        let {title: gifThreeAlt} = res.data.data[2]
      let gifTest = `
      <div id="myCarousel" class="carousel slide" data-ride="carousel">
      <ol class="carousel-indicators">
          <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
          <li data-target="#myCarousel" data-slide-to="1"></li>
          <li data-target="#myCarousel" data-slide-to="2"></li>
        </ol>
        <div class="carousel-inner">
          <div class="item active">
            <img src="${gifOne}" alt="${gifOneAlt}">
          </div>
      
          <div class="item">
            <img src="${gifTwo}" alt="${gifTwoAlt}">
          </div>
      
          <div class="item">
            <img src="${gifThree}" alt="${gifThreeAlt}">

          </div>
        <a class="left carousel-control" href="#myCarousel" data-slide="prev">
          <span class="glyphicon glyphicon-chevron-left"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="right carousel-control" href="#myCarousel" data-slide="next">
          <span class="glyphicon glyphicon-chevron-right"></span>
          <span class="sr-only">Next</span>
        </a>
      </div>
      `
      carouselRes.innerHTML += gifTest
    })
    .catch(err=>console.log(err))
}
function ifFloat(emotions) {
    newEmotionArr = []
    for (i=0;i<emotions.length;i++){
        let numStr = String(emotions[i]);
        if (numStr.indexOf('e') === -1) {
            newEmotionArr.push(emotions[i])}}
            return newEmotionArr}
            
            
const refreshQoute =() =>{
    getQoute(emotionMain)
}
button.addEventListener('click', expressionButton)
form.addEventListener('submit',handleSubmit)
