import pool from "../database";
import dotenv from "dotenv";

dotenv.config();

const getVideosByTitle = async (title : string, page : number, limit : number) : Promise<Response> => {
  const startIndex = (page - 1) * limit;

  const endIndex = page * limit;

  const result = await pool.query(
    `SELECT * FROM video WHERE title LIKE '%${title}%' ORDER BY (published_date) OFFSET ${startIndex} LIMIT ${limit}`
  );

  let response = <Response>{};

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

  return response;
};

const getAllVideos = async () => {
  try {
    const result = await pool.query(`SELECT * FROM video`);

    return result.rows
  } catch (error) {
    console.log(error)
    return {mes : "Error Occured",err : error}
  }
}

export { getVideosByTitle,getAllVideos };

interface Response {
  _links: {
    nextPage: string;
    prevPage: string;
  };
  page: number;
  data: data[];
}

interface data {
  id: number;
  title: string;
  description: string;
  video_id: string;
  thumbnails: string;
  published_date: Date;
}
