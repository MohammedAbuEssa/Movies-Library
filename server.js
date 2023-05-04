"use strict";
require("dotenv").config();
const express = require("express");
const app = express();
const data = require("./Movie Data/data.json");
const axios = require("axios");
const cors = require("cors");
const { status } = require("express/lib/response");
const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL);

app.use(cors());
app.use(express.json());
const key = process.env.API_KEY;
const port = process.env.PORT;
const movieList = [];

function MovesConstructor(id, name, release, poster, overview) {
  this.id = id;
  this.name = name;
  this.release = release;
  this.poster = poster;
  this.overview = overview;
}

let spiderMan = new MovesConstructor(
  data[0].title,
  data[0].poster_path,
  data[0].overview
);

movieList.push(spiderMan);

app.get("/", (req, res) => {
  res.send("Hello");
  // console.log(movieList[0]);
});

app.get("/trending", handleTrendingReq);
app.get("/search", handleSearchReq);
app.get("/popular", handelPopular);
app.get("/toprated", handleTopRated);
app.get("/getMovies", handleGetMovies);
app.post("/getMovies", handleAddMovies);

function handleAddMovies(req, res) {
  const movie = req.body;
  // console.log(movie);
  const sql = `INSERT into movies (title,release_date,poster_path,overview) values ('${movie.name}','${movie.release}','${movie.poster}','${movie.overview}');`;
  client.query(sql).then(() => {
    res.send("Added successfully");
  });
}

function handleGetMovies(req, res) {
  const sql = "select * from movies;";
  client.query(sql).then((data) => {
    let dataFromDB = data.rows.map((item) => {
      let movie = new MovesConstructor(
        item.id,
        item.title,
        item.release_date,
        item.poster_path,
        item.overview
      );
      return movie;
    });
    res.send(dataFromDB);
  });
}

async function handleTrendingReq(req, res) {
  const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${key}`;
  let moviesFromApi = await axios.get(url);
  let movesList = moviesFromApi.data.results.map((item) => {
    return new MovesConstructor(
      item.id,
      item.title,
      item.release_date,
      item.poster_path,
      item.overview
    );
  });
  res.json(movesList);
  console.log(movesList);
}

function handleSearchReq(req, res) {
  let SearcMovie = req.query.query;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${SearcMovie}`;
  axios.get(url).then((result) => {
    // console.log(result);
    res.send(result.data);
    // let movieInfo = new MovesConstructor(
    //   result.data.id,
    //   result.data.title,
    //   result.data.release_date,
    //   result.data.poster_path,
    //   result.data.overview
    // );
    // res.json(movieInfo);
  });
  //   console.log(SearcMovie.data);
}

async function handelPopular(req, res) {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=en-US&page=1`;
  let moviesFromApi = await axios.get(url);
  let movesList = moviesFromApi.data.results.map((item) => {
    return new MovesConstructor(
      item.id,
      item.title,
      item.release_date,
      item.poster_path,
      item.overview
    );
  });
  res.json(movesList);
  console.log(movesList);
}

async function handleTopRated(req, res) {
  const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${key}&language=en-US&page=1`;
  let moviesFromApi = await axios.get(url);
  let movesList = moviesFromApi.data.results.map((item) => {
    return new MovesConstructor(
      item.id,
      item.title,
      item.release_date,
      item.poster_path,
      item.overview
    );
  });
  res.json(movesList);
  console.log(movesList);
}

app.get("/favorite", (req, res) => {
  res.send("Welcome to Favorite Page");
});

function pageNotFound(req, res) {
  res.status(404).send("The Page that you trying to reach is not found");
}

function serverError(req, res) {
  res.status(500).send("Sorry, something went wrong on our side");
}

app.use("*", pageNotFound);
app.use("bad", serverError);

client.connect().then(() => {
  app.listen(port, () => {
    console.log(`Port ${port} is running`);
  });
});
