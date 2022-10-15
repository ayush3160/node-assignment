import express, { Express, Request, Response } from "express";
import schedule from "node-schedule";
import axios from "axios"
import pool from "./database"
import dotenv from 'dotenv'
import path from "path"

dotenv.config()
import {graphqlHTTP} from 'express-graphql';
import schema from './graphql/schema';

const app : Express = express();

app.use(express.json());

// Code for scheduling the fetching video and storing to database after every 20 sec

var apiKey = process.env.API_KEY;

const job = schedule.scheduleJob("*/20 * * * * *", function () {
  console.log(apiKey);

  var url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&q=cricket&type=video&order=date`;
  axios
    .get(url)
    .then((res) => {
      const data = res.data.items;

      console.log(data);

      data.forEach((video) => {
        const [video_id, title, description, thumbnail, published_date] = [
          video.id.videoId,
          video.snippet.title,
          video.snippet.description,
          video.snippet.thumbnails.high.url,
          video.snippet.publishedAt,
        ];

        pool.query(
          `INSERT INTO video(video_id,title,description,thumbnail,published_date) VALUES ('${video_id}','${title}','${description}','${thumbnail}','${published_date}') on conflict (video_id) do nothing`,
          (err,result) => {
            if (err) {
              if (err.code !== "42601") {
                console.log(err);
              }
            }
          }
        );
      });
    })
    .catch((err) => {
      if (err.response.status === 403) {
        console.log("quota exhausted");
      }
    });
});

  app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
  res.append(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, X-Auth-Token"
  );
  next();
});


app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/index.html"));
});


app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(5000, () => {
  console.log("Server is up on port 5000");
});
