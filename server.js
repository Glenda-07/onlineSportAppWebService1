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
    const { sports_name, sports_pic } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO sports (sports_name, sports_pic) VALUES (?,?)', [sports_name, sports_pic]);
        res.status(201).json({message: 'Sport: '+ sports_name +' added successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not add sport '+sports_name})
    }
})

app.put('/editsports', async(req, res) => {
    const { sports_id, sports_name, sports_pic } = req.body;

    if (!sports_id) { return res.status(400).json({ message: 'Missing sports id' }); }
    
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'UPDATE sports SET sports_name = ?, sports_pic = ? WHERE sports_id = ?',
            [sports_name, sports_pic,sports_id]
        );
        await connection.end();

        res.status(200).json({message: 'Sport: '+ sports_name +' edited successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not edit sport '+sports_name})
    }
})


app.delete('/deletesports/:id', async(req, res) => {
    const sports_id = req.params.id;

    if (!sports_id) { return res.status(400).json({ message: 'Missing sports id' }); }

    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'DELETE FROM sports WHERE sports_id = ?',
            [sports_id]
        );
        await connection.end();

        res.status(200).json({message: 'Sport: '+ sports_name +' deleted successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not delete sport '+sports_name})
    }
})


