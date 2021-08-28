const fs  = require('fs');
const http = require("http");
var reqast = ""
var list = []
var resArray = []
fs.readFile("./city.list.json", (err, data) => {
    if(err) throw err
    JSON.parse(data).forEach(element => {
        list.push({name:element.name, id:element.id})
    });
    list = list.sort((a, b) => (a.name > b.name) ? 1 : -1)
    console.log(list)
})
const publicModule = require("./publicModule")
const server = http.createServer((req, res) => {
    if (req.url != "/"){
        var url = req.url;
    }else{
        var url = "/index.html"
    }
    var type = req.url.split(".");
    if(url == "/get"){
        res.setHeader("Access-Control-Allow-Origin", "*")
        req.on("data",(data) => {
            reqast += data;
        });
        req.on("end", () => {
            reqast = JSON.parse(reqast);
            console.log(reqast);
            if(reqast.type == "search"){
                list.forEach(el => {
                    if(el.name.toLowerCase().startsWith(reqast.data.toLowerCase())){

                        resArray.push(el)
                    }
                });
                resArray = resArray.slice(0, 10)
                res.end(JSON.stringify({type:"search", data:resArray}))
                resArray = []
            }

            
            reqast = ''


        })
    }
    switch(type[1]){
        case "css":
            res.setHeader('Content-Type', 'text/css');
        break;
        case "js":
            res.setHeader("Content-Type","text/javascript");
        break;
        case "html":
            res.setHeader("Content-Type","text/html");
        break;
        case "svg":
            res.setHeader("Content-Type","image/svg+xml");
        break;
    }
        
    
    fs.readFile("." + url, function(e, data){
        res.end(data);
    });
})
server.listen(3000);