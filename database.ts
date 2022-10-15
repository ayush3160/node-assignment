import * as pg from 'pg'
const { Pool } = pg.default
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_DATABASE,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
})

pool.query('CREATE TABLE video (ID SERIAL PRIMARY KEY,video_id text,title text,description text,thumbnail text,published_date DATE,UNIQUE (video_id))',(err,result) => {
    console.log('video table created')
})


export default pool