require('dotenv').config()
const axios= require('axios');

const {CONNECTION_STRING}= process.env
const Sequelize = require('sequelize')
const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect : 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorization:false
        }
    }
});
module.exports = {
seed: (req,res) =>{
    sequelize.query(`
    drop table if exists qoutes;

    create table qoutes (
        qoutes_id serial primary key, 
        qoute varchar(255),
        emotion varchar(20),
        author varchar(30)

    );

    insert into qoutes(qoute, emotion,author)
    values('Holding on to anger is like grasping a hot coal with the intent of throwing it at someone else; you are the one who gets burned.','anger','Buddha'),
    ('Anybody can become angry - that is easy, but to be angry with the right person and to the right degree and at the right time and for the right purpose, and in the right way - that is not within everybodys power and is not easy.','anger','Aristote'),
    ('When anger rises, think of the consequences.','anger','Confucius'),
    ('Whatever is begun in anger ends in shame.','anger','Benjamin Franklin'),
    ('For every minute you remain angry, you give up sixty seconds of peace of mind.','anger','Ralph Waldo Emerson'),('Happiness depends upon ourselves','happy','Aristote'),
    ('Happiness is when what you think, what you say, and what you do are in harmony','happy','Ghandi'),
    ('The moments of happiness we enjoy take us by surprise. It is not that we seize them, but that they seize us.','happy','Ashley Montagu'),
    ('Even if happiness forgets you a little bit, never completely forget about it','sad','Jaques Prevert'),
    ('One of the secrets of a happy life is continuous small treats','happy','Iris Murdoch'),('The only joy in the world is to begin','happy','Cesare Pavese'),
    ('It is amazing how someone can break your heart and you can still love them with all the little pieces','sad','Ella Harper'),
    ('Never feel regret for your own decisions. If, you will not respect your own decisions, who else will?','sad','Invajy'),
    ('There are years that ask questions and years that answer','sad','Zora Neale Hurston'),
    ('When you have a dream, you have got to grab it and never let go','neutral','Carol Burnett'),
    ('Nothing is impossible. The word itself says "I am possible!"','neutral','Audrey Hepburn'),
    ('There is nothing impossible to they who will try','neutral','Alexander the Great'),
    ('You are never too old to set another goal or to dream a new dream.','neutral','Malala Yousafzai'),
    ('The bad news is time flies. The good news is you are the pilot.','sad','Michael Altshuler'),
    ('Keep your face always toward the sunshine, and shadows will fall behind you','sad','Walt Whitman'),
    ('You define your own life. Do not let other people write your script.','neutral','Oprah Winfrey'),
    ('The secret to humor is surprise.','suprised','Aristote'),
    ('Moments of happiness come with the unexpected.','suprised','Ashley Montagu'),
    ('Life finds worth in surprises.','suprised','Alice Walker'),
    ('Fears are educated into us, and can, if we wish, be educated out','fearful','Karl Menninger'),
    ('I am not afraid of tomorrow, for I have seen yesterday and I love today','fearful','William White'),
    ('Do the thing you fear and the death of fear is certain','fearful','Ralph Waldo Emerson'),
    ('Laughter is poison to fear','fearful','George R.R. Martin'),
    ('We are disgusted by the things that we desire, and we desire what disgusts us.','disgusted','Mario Cuomo'),
    ('I used to be disgusted; now I try to be amused.','disgusted','Elvis Costello'), 
    ('You have to be disgusted with your current circumstances before your circumstances can change','disgusted','Eric Thomas'), 
    ('The world that surrounded me disgusted me so I chosen to invent one of my own.','disgusted','Pete Doherty');


    `).then(() => {
        console.log('DB seeded!')
        res.sendStatus(200)
    }).catch(err => console.log('error seeding DB', err))

},
addQoute: (req,res)=>{
    let {qoute, emotionSelect, author } = req.body
    sequelize.query(`
    insert into qoutes(qoute, emotion,author)
    values('${qoute}','${emotionSelect}','${author}')
    `).then(() => {
        console.log('added qoute')
        res.sendStatus(200)
    }).catch(err => console.log('error adding qoute', err))
},
getQoute:(req,res)=>{
    let {emotion} = req.body
    
    sequelize.query(`
    select * from qoutes
    where emotion = '${emotion}'
    ORDER BY RANDOM()
    LIMIT 1;
    
    `).then(dbres => {
        res.status(200).send(dbres[0])
    }).catch(err => console.log('error selecting qoute', err))
    
},
getAllQoutes: (req,res)=>{
    sequelize.query(`
    select * from qoutes
    order by qoutes_id DESC
    
    `).then((dbres)=> res.status(200).send(dbres[0]))
},
deleteQoute: (req,res)=>{
    let {id} = req.params
    sequelize.query(`
    DELETE FROM qoutes
    where qoutes_id = ${id}
    `).then(()=> res.sendStatus(200))
},
getGIF:(req,res) =>{
    let {emotion} = req.body
    console.log(emotion);
    axios.get(`https://api.giphy.com/v1/gifs/search?api_key=VBHsjkyygygTHvjPCIGBxCMZDP9xaknc&q=${emotion}&limit=4&offset=0&rating=pg&lang=en`).then(response => {
        res.status(200).send(response.data)
    })
}
}