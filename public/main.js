const qouteSection = document.querySelector('#allQoutes') 

const getAllQoutes =  () =>{
     axios.get('http://localhost:8765/getAllQoutes')
    .then(res =>{

        res.data.forEach(qoute =>{
const qouteCard = document.createElement('div')
qouteCard.setAttribute('id',`qoute-${qoute['qoutes_id']}`)
qouteCard.classList.add('qoute-card')

        qouteCard.innerHTML = `    
        <h2 class= 'text' id="qoute">"${qoute.qoute}"</h2>
        <h3 class= 'text' id='author'>Author: ${qoute.author}</h3>
        <h3 class= 'text' id='emotion'>Emotion: ${qoute.emotion}</h3>
        <button id="expressionsButton" onclick="deleteQoute(${qoute.qoutes_id})">delete</button>
        `

    
        qouteSection.appendChild(qouteCard)
    })})
        // VANTA.HALO({
        //     el: "body",
        //     mouseControls: false,
        //     touchControls: false,
        //     gyroControls: false,
        //     forceAnimate:true,
        //     minHeight: 200.00,
        //     minWidth: 200.00,
        //     amplitudeFactor: 2.50,
        //     xOffset: 0.47,
        //     yOffset: 0.31,
        //     size: 2.70
        //   })

}
const deleteQoute = (id) => {
    axios.delete(`http://localhost:8765/deleteQoute/${id}`).then(()=> {
        const qouteCard = document.getElementById(`qoute-${id}`)
    
        qouteCard.remove()
        // window.location.reload()
    }
    )
  
}
getAllQoutes()