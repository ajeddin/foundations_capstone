const qouteSection = document.querySelector('#allQoutes') 

const getAllQoutes = () =>{
    axios.get('http://localhost:8765/getAllQoutes')
    .then(res =>{

        res.data.forEach(qoute =>{
const qouteCard = document.createElement('div')

qouteCard.classList.add('qoute-card')
    
        qouteCard.innerHTML = `    
        <div class="qoute-card">
        <h2id='qouteDisplay'>${qoute.qoute}</h2>
        <h3 id='author'>Author: ${qoute.author}</h3>
        <h3 id='emotion'>Qoute: ${qoute.emotion}</h3>
        </div>
        <button onclick="deleteQoute(${qoute.qoutes_id})">delete</button>
        `
    
    
        qouteSection.appendChild(qouteCard)})
    })
}
const deleteQoute = (id) => {
    axios.delete(`http://localhost:8765/deleteQoute/${id}`).then(console.log('deleted'))
    getAllQoutes()
}
getAllQoutes()