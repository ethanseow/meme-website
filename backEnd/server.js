const express = require('express');
const app = express();
const mongoose = require('mongoose');
const http = require('https');
var path = require('path');

app.set('views', '../views');
app.set('view engine', 'ejs');
app.use('/styles',express.static('../views/styles'));
var jsonData;
const getHttp = function(url){
    return new Promise( (resolve,reject) =>{
        http.get(url, (res) => {
            var body = '';
            var jsonData = [];
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                var response = JSON.parse(body);
                response.data.children.forEach((child) =>{
                    var dict = {
                        '.apng': true,
                        '.bmp': true,
                        '.gif': true,
                        '.ico': true,
                        '.jpeg': true,
                        '.jpg': true,
                        '.png': true
                    };
                    try{
                        if(path.extname(child.data.url_overridden_by_dest) in dict){
                            jsonData.push(child.data.url_overridden_by_dest);
                        }    
                    }catch{
                        console.log('error');
                    }
                });
                resolve(jsonData);
            });
        }).on('error', (e) => {
              reject(e);
        }); 
    });
}

app.listen(3000);

app.get('/',(req,res)=>{
    res.render('index.ejs');
    console.log('home page')
});

app.get('/memes', (req,res) => {
    console.log('meme page');
    console.log(req.query);
    var subreddit = 'dankmemes';
    if(req.query.subreddit){
        subreddit = req.query.subreddit;
    }
    var string = 'https://www.reddit.com/r/' + subreddit + '/hot/.json?limit=100';
    console.log(string);
    getHttp(string)
    .then((result) =>{
        jsonData = result;
        console.log('done loading');
        res.render('memes.ejs',{jsonData});
    })
    .catch((err) =>{
        console.log(error);
        res.redirect('/');
    })
});