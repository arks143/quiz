const express = require('express'); //Import the express dependency
const app = express();
// app.use(express.urlencode());          //Instantiate an express app, the main work horse of this server
const port = 3000; //Save the port number where your server will be listening
const axios = require('axios');
let response = null;


//Idiomatic expression in express to route and respond to a client request
app.get('/', (req, res) => { //get requests to the root ("/") will route here
    res.sendFile('/index.html', {
        root: __dirname
    }); //server responds by sending the index.html file to the client's browser
    //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});
app.get('/visuals', (req, res) => { //get requests to the root ("/") will route here
    res.sendFile('/visuals.html', {
        root: __dirname
    }); //server responds by sending the index.html file to the client's browser
    //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});
app.get('/main.js', (req, res) => { //get requests to the root ("/") will route here
    res.sendFile('/main.js', {
        root: __dirname
    }); //server responds by sending the index.html file to the client's browser
    //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});

app.get('/style.css', (req, res) => { //get requests to the root ("/") will route here
    res.sendFile('/style.css', {
        root: __dirname
    }); //server responds by sending the index.html file to the client's browser
    //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});

app.get('/more-info/:country', (req, res) => {
    new Promise(async (resolve, reject) => {
        try {
            response = await axios.get('https://restcountries.com/v3.1/alpha/' + req.params.country + '')
        } catch (ex) {
            response = null;
            // error
            console.log(ex);
            reject(ex);
        }
        if (response) {
            // success
            const json = response.data;
            res.send(json);
            resolve(json);
        }
    });

});

app.get('/answer/:answer', (req, res) => {

        let answer = req.params.answer;
        const answer_key = ['A distributed ledger of trasactions','A Blockchain','A way for web3 apps to interact with an EVM Blockchain'];
        const true_false = answer_key.includes(answer);

        if (true_false == 'true'){
            res.send(true_false);
        }else{
            res.send(true_false);
        }

});


app.get('/getweather/:latlon', (req, res) => {

    let latlon_array = req.params.latlon.split("_");

    new Promise(async (resolve, reject) => {
        try {
            response = await axios.get('https://api.openweathermap.org/data/2.5/weather?lat=' + latlon_array[0] + '&lon=' + latlon_array[1] + '&appid=e17fc3009e8124bd5a89d9d127b79acc')
        } catch (ex) {
            response = null;
            // error
            console.log(ex);
            reject(ex);
        }
        if (response) {
            // success
            const json = response.data;
            res.send(json);
            resolve(json);
        }
    });

});


app.get('/time/:latlon', (req, res) => {

    let text = req.params.latlon;
    const latlon_array = text.split("_");
    console.log(latlon_array);

    new Promise(async (resolve, reject) => {
        try {
            response = await axios.get('https://timeapi.io/api/Time/current/coordinate?latitude='+latlon_array[0] +'&longitude='+ latlon_array[1])
        } catch (ex) {
            response = null;
            // error
            console.log(ex);
            reject(ex);
        }
        if (response) {
            // success
            const json = response.data;
            res.send(json);
            resolve(json);
        }
    });

});


app.get('/bankholidays/:country', (req, res) => {

    let text = req.params.country;

    new Promise(async (resolve, reject) => {
        try {
            response = await axios.get('https://date.nager.at/api/v3/PublicHolidays/2022/' + req.params.country)
        } catch (ex) {
            response = null;
            // error

            reject(ex);
        }
        if (response) {
            // success
            const json = response.data;
            //   var jsonData = {};
            //   var i = 0;

            // json.forEach(function(item, index) {
            //         // console.log(item['date']);
            //         // console.log(index);
            //         // console.log(new Date(item['date']).getTime());
            //         var today = new Date().getTime();
            //         var item_timestamp = new Date(item['date']).getTime();
            //        console.log(today);
            //            console.log(item_timestamp);
            //          if( item_timestamp > today ){
            //           console.log('hello world'+i);
            //           jsonData = json[i];
            //           console.log(json[i]);
            //         i++;
            //          }
            //          //console.log(jsonData);
                        
            //         });
 
            res.send(json);
            resolve(json);
        }
    });

});


app.get('/latlon/:place', (req, res) => {

    new Promise(async (resolve, reject) => {
        try {
            response = await axios.get('http://api.openweathermap.org/geo/1.0/direct?q=' + req.params.place + '&limit=5&appid=e17fc3009e8124bd5a89d9d127b79acc')
        } catch (ex) {
            response = null;
            // error

            reject(ex);
        }
        if (response) {
            // success
            const json = response.data;
            res.send(json);
            resolve(json);
        }
    });

});



app.listen(port, () => { //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`);
});