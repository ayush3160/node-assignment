# Node-Assignment

How to use the code :-
  1. git clone the repo
  2. do npm install
  3. add a .env file and add variables as shown in .env.example file
  4. now do node index.js

You can see all the queries and type from http://localhost:5000/graphql .

At "/" route it has a dashboard which is showing all the videos present in the database .

![Screenshot 2022-10-15 173024](https://user-images.githubusercontent.com/89914602/195985429-db9aff4c-79d8-4573-9f68-f02880769373.png)



You can search video through the title. By default it is taking page = 1 and limit = 3 , But you can change this in query by providing two args page and limit.

![Screenshot 2022-10-15 173103](https://user-images.githubusercontent.com/89914602/195985455-4a383f72-c68c-489f-b546-cd1764c59586.png)


# Queries Example :-

For all videos :-
{
  getAllVideos{
    title
    description
    thumbnail
    published_date
  }
}

For searching through title :- 
{
  videosByTitle(title: "Live", limit: 3, page: 1) {
    data {
      title
      id
      description
      thumbnail
    }
  }
}

