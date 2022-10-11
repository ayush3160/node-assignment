const express = require("express");
const schedule = require("node-schedule");
const axios = require("axios");
const pool = require("./database.js");
require("dotenv").config();

const app = express();

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
          (err, result) => {
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

app.get("/video", (req, res) => {
  const limit = parseInt(req.query.limit);

  const page = parseInt(req.query.page);

  const title = req.query.title;

  const startIndex = (page - 1) * limit;

  const endIndex = page * limit;

  pool.query(
    `SELECT * FROM video WHERE title LIKE '%${title}%' ORDER BY (published_date DESC) OFFSET ${startIndex} LIMIT ${limit}`,
    (err, result) => {
      if (err) {
        res.status(400).json({ mes: "Error occured", err: err });
      } else {
        let response = {};

        response._links = {
          nextPage: `http://localhost:5000/video?page=${
            page + 1
          }&limit=${limit}&title=${title}`,
          prevPage: `http://localhost:5000/video?page=${
            page - 1
          }&limit=${limit}&title=${title}`,
        };
        response.page = page;

        response.data = result.rows;

        res.status(200).send(response);
      }
    }
  );
});

app.listen(5000, () => {
  console.log("Server is up on port 5000");
});
