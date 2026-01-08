const express = require('express');
const mysql = require ('mysql2/promise');
require('dotenv').config(); //load the data
const port = 3000;

const dbConfig={
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,
    port:process.env.DB_PORT,
    waitForConnections:true,
    connectionLimit:100,
    queueLimit:0,
};

const app = express();

app.use(express.json());


app.listen(port, () => {
    console.log('Server started on port', port );
});

//all sports displayed
app.get('/allsports',async (req,res)=>{
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM sports');
        res.json(rows);
    } catch(err){
        res.status(500).json({message:'Server error for all sports'
        });
    }
});

app.post('/addsports', async(req, res) => {
    const { sport_name, sport_pic } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO sports (sport_name, sport_pic) VALUES (?,?)', [sport_name, sport_pic]);
        res.status(201).json({message: 'Sport: '+ sport_name +' added successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not add sport '+sport_name})
    }
})

//
// app.post('/editsports', async(req, res) => {
//     const { sports_name, sports_pic } = req.body;
//     try {
//         let connection = await mysql.createConnection(dbConfig);
//         await connection.execute('INSERT INTO sports (sports_name, sports_pic) VALUES (?,?)', [sports_name, sports_pic]);
            //await connection.execute('UPDATE sports SET sports_name = ')
//         res.status(201).json({message: 'Sport: '+ sports_name +' added successfully'});
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server error - could not add sport '+sports_name})
//     }
// })
