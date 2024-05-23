const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const pool = require('./DB/index.js');
const { GenAI, GenAI_ready} = require('./AI/genai.js');
app.use(express.json());


// Command Table
async function getCommandLogData(player){
  const connection = await pool.getConnection();
  try{
    const [rows] = await connection.query(`
      SELECT * FROM velocity_log
      WHERE car = ${player}
      ORDER BY time DESC
      LIMIT 300`);
    return rows;
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    connection.release();
  }
}

// score
async function getScoreLogData(id){
  const connection = await pool.getConnection();
  try{
    const [rows] = await connection.query(`
      SELECT * FROM score_log 
      WHERE car = ${id}
      ORDER BY time DESC
      LIMIT 1`);
    return rows[0];
  } catch (err) {
    console.error(err);
    return null;
  } finally {
    connection.release();
  }
}

// velocity_log 
async function getVelocityLogData(player){
  const connection = await pool.getConnection();
  try{
    const [rows] = await connection.query(` 
      SELECT * FROM velocity_log 
      WHERE car = ${player}
      ORDER BY time DESC 
      LIMIT 1`);
    return rows[0];
  } catch (err){
    console.log(err);
    return null;
  } finally{
    connection.release();
  }
}

// Cors 설정
app.use(cors({origin: true}))

app.get('/', async (req, res) => {
  res.send('hello'); 
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Command RESTAPI
app.get('/api/command/:id', async (req, res) => {
  try{
    const carId = parseInt(req.params.id, 10);
    if(isNaN(carId)){
      return res.status(400).send('Invalid car ID');
    }
    const data = await getCommandLogData(carId);

    if(!data){
      return res.status(400).send('DB Error');
    }

    res.status(201).send(data)
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
})

// Score RESTAPI
app.get('/api/score/:id', async (req, res) => {
  try{
    const carId = parseInt(req.params.id, 10);
    if(isNaN(carId)){
      return res.status(400).send('Invalid car ID');
    }
    const data = await getScoreLogData(carId);

    if(!data){
      return res.status(400).send('DB Error');
    }

    res.status(201).send(data)
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
})

// Velocity RESTAPI
app.get('/api/velocity/:id', async (req, res) => {
  try{
    const carId = parseInt(req.params.id, 10);
    if(isNaN(carId)){
      return res.status(400).send('Invalid car ID');
    }

    const data = await getVelocityLogData(carId);

    if(!data){
      return res.status(400).send('DB Error');
    }

    res.status(201).send(data)
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
})


app.post('/api/genai', async (req,res) => {
  const narrator = req.body.userPrompt;
  //res.send(req.body.userPrompt);
  const response = await GenAI(narrator);
  res.send(response);
});

app.get('/api/genai_ready', async (req,res) => {
  const response = await GenAI_ready();
  console.log(response);
  res.send(response);
});

