//step one is to import all the node modulus

var express = require('express');
var dateformat = require('dateformat');
var mysql = require('mysql');
var bodyparser = require('body-parser')

var app = express()
// we want to pass data from a form so we use body parser

app.use(bodyparser.urlencoded({extended : true }));


// use the view Template Engine Engine

app.set("view engine","ejs");
//require bootsrap and other javascript modules
// app.use('*/js' ,express.static(__dirname + '/node_modules/bootsrap/dist/js'));
// app.use('*/js' ,express.static(__dirname + '/node_modules/tether/dist/js'));
// app.use('*/js' ,express.static(__dirname + '/node_modules/jquery/dist'));
// app.use(express.static('/node_modules/bootsrap/dist/bootstrap.min.css'));
//connecting to mysql server
const con = mysql.createConnection(
    {
        host:"localhost",
        user:"root",
        password:"",
        database:"mydb"
    }
);
const siteTitle ="MY CRUD APP";
const baseURL ="http://localhost:4000/"

app.get('/' , function(req ,res){

    con.query("select * from events ",function(error,result){
        res.render('pages/index', {
            siteTitle:siteTitle,
            pageTitle:"your Events Peter ",
            items:result
    
        });

    });
    

});
app.get('/event/edit/:id',function(req,res){
    var userid = req.params.id;
    
    myeditquery = `select * from events where id = "${userid}" `;
    con.query(myeditquery,function(err,myresult){
        res.render('pages/edit-event',{
            siteTitle:siteTitle,
            pageTitle:"Edit the Event supposed to begin on " +myresult[0].description,
            itemsreturned:myresult,
            
        });
     
    });
});
app.post('/event/edit/:id',function(request,response)
{
   var ed = request.params.id;
   var name = request.body.name;
   var start =  dateformat(request.body.start,"yyyy-mm-dd");
   var stop =  dateformat(request.body.stop,"yyyy-mm-dd");
   var location = request.body.location;

myquery = `UPDATE EVENTS SET name="${name}",start="${start}",stop="${stop}",location="${location}" where id="${ed}"`
   
con.query(myquery,function(error,result){
    
        response.redirect(baseURL);

})
   
   

})
app.get('/event/delete/:useid',function(request,response){
     var deleteId = request.params.useid;
      deletequery = `delete from events where id = ${deleteId}`
      con.query(deletequery,function(){
          response.redirect(baseURL);
      })
})

app.get('/event/add',function(req,res){

    res.render('pages/add-event.ejs',{
        siteTitle:siteTitle,
        pageTitle:"Add NEW Events",
        items:""
    })
});
app.post('/add/event',function(req,res){
    var name = req.body.name;
    var start = dateformat(req.body.start,"yyyy-mm-dd");
    var stop = dateformat(req.body.stop,"yyyy-mm-dd");
    var location = req.body.location;

var sql = `INSERT INTO EVENTS(name,start,stop,location) values (
    "${name}",
    "${start}",
    "${stop}",
    "${location}"
)


 `;

con.query(sql,function(error,result){
    res.redirect(baseURL);
   

});

});



    //con.query("SELECT * FROM EVENTS ",function(err,result){
//creating a server

var server = app.listen(4000,function(){
    console.log("SERVER STARTED AT 4000....")
});