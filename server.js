const express=require('express');
const app=express();
const data=require('./Movie Data/data.json');
const port =3001;
const cors =require('cors');
const { status } = require('express/lib/response');
app.use(cors());
const movieList=[];

function MovesConstructor(name,poster,overview) {
    this.name=name;
    this.poster=poster;
    this.overview=overview;
}

let spiderMan=new MovesConstructor(data[0].title,data[0].poster_path,data[0].overview);

movieList.push(spiderMan);

app.get('/',(req,res)=>{
res.send("Hello");
// console.log(movieList[0]);
});


app.get('/favorite',(req,res)=>{
    res.send("Welcome to Favorite Page");
});

function pageNotFound(req,res) {
 res.status(404).send("The Page that you trying to reach is not found");
};

function serverError(req,res) {
 res.status(500).send("Sorry, something went wrong on our side");
};

app.use("*",pageNotFound);
app.use("bad",serverError);

app.listen(port,()=>{
    console.log(`Port ${port} is running`);
});