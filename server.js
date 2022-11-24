//Student Name: Hugh Kim
//Student Number: 141050211
//Email: hkim384@myseneca.ca
//Cyclic URL: https://naughty-kerchief-fawn.cyclic.app

const express = require("express");
const dataPrep = require("./data_prep");
const exphbs = require("express-handlebars");
const HTTP_PORT = process.env.PORT || 8080;

const app = express();

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
    return new Promise((res, req) => {
        dataPrep.prep().then((data) => {
            console.log(data)
        }).catch((err) => {
            console.log(err);
        });
    });
}

app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers: {
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
            '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
           }
    }
}));
app.set('view engine', '.hbs');

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
   });

app.get("/", (req, res) => {
    res.render('home');
});

app.get("/CPA", function(req,res){
    dataPrep.cpa().then((data) => {res.render("cpa", {students: data});}).catch((err) => {
        console.log(err);res.json(err);
    })
});

app.get("/highGPA", function(req,res){
    dataPrep.highGPA().then((data) => {res.render('highGPA', {high: data});}).catch((err) => {
        console.log(err);res.json(err);
    })
    
});

app.get("/addStudent", (req, res) => {
    res.render('addStudent');
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post("/addStudent", function(req,res){
    dataPrep.addStudent(req.body).then(() => {res.redirect("/allStudents");});
});

app.get("/allStudents", function(req,res){
    dataPrep.allStudent(req.query)
        .then((data) => {
            if(data.length > 0) {
                res.render("students", {students: data});
            }
            else {
                res.render("students",{message: "no results"});
            }
            }).catch((err) => {
            console.log(err);
        });
});

app.get("/student/:studId", function (req, res) {
    dataPrep.getStudentById(req.params)
    .then((data) => {res.json(data);}).catch((err) => {
        console.log(err);res.json(err);
    })
});

app.use(function (req, res) {
    res.status(404).sendFile(path.join(__dirname,"/views/error404.html"));
})

app.listen(HTTP_PORT, onHttpStart);