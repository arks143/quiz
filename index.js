const express = require('express'); //Import the express dependency
const app = express();
const port = 3000; //Save the port number where your server will be listening
const axios = require('axios');
require('dotenv').config();
const {
    auth,
    requiresAuth
} = require('express-openid-connect');
const {
    MongoClient,
    ServerApiVersion
} = require('mongodb');
const uri = process.env.uri;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});
let response = null;

app.use(express.urlencoded({extended: false}));
app.use(express.json());

async function createListing(client, newListing) {
    const result = await client.db("scores").collection("score_rec").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

function createListingProx(email, score,questionid,aid) {
    createListing(client, {
        email: email,
        score: score,
        score_num: 1,
        question_id: questionid,
        aid:aid
    });

}

async function findOneListingByName(nameOfEmail) {
    const result = await client.db("scores").collection("score_rec").findOne({
        email: nameOfEmail
    });

    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfEmail}':`);
         console.log(result.score_num);
        return 'true';
    } else {
        console.log(`No listings found with the name '${nameOfEmail}'`);
        return 'false';
    }
}


async function getOneListingByName(nameOfEmail) {
    const result = await client.db("scores").collection("score_rec").findOne({
        email: nameOfEmail
    });

    if (result) {
        return result;
    } else {
       
        return 'false';
    }
}


async function getAllListingByName(nameOfEmail) {
    console.log('mongodbclient daata2 ');
    console.log(MongoClient);
    const cursor = await client.db("scores").collection("score_rec").find({
        email: {$gte:nameOfEmail}
    });
    const results = await cursor.toArray();
    console.log(results);
    if (results) {
        return results;
    } else {
        return 'false';
    }
}


async function updateListingByName(email, updatedListing) {
    const result = await client.db("scores").collection("score_rec").updateOne(updatedListing);
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}


async function updateListingByName(nameOfListing, updatedListing) {
    const result = await client.db("scores").collection("score_rec").updateOne({ email: nameOfListing }, { $set: updatedListing });
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}


async function deleteListingsScrapedBeforeDate(email) {
    const result = await client.db("scores").collection("score_rec").deleteMany({ "email": email });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: '1PnLMiDyoSE7jKTDkUtb6qkadG_5PCcYmNR9573KtwLcf39BPGk_vdZ_NK0UXdyH',
    baseURL: 'http://localhost:3000',
    clientID: 'w2dgBdvE4nhdEEz5pfrQ1yibjjt6Fw71',
    issuerBaseURL: 'https://dev-ug95wb6k.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

//Idiomatic expression in express to route and respond to a client request
app.get('/', requiresAuth(), (req, res) => { //get requests to the root ("/") will route here
    //res.send(JSON.stringify (req.oidc.user));
    res.sendFile('/index.html', {
        root: __dirname
    }); //server responds by sending the index.html file to the client's browser
    //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});

app.use(express.static('public',{extensions:['html']}));
app.use(express.static('public/css',{extensions:['css']}));
app.use(express.static('public/js',{extensions:['js']}));

app.get('/userdata', (req, res) => { //get requests to the root ("/") will route here
    const new_data = req.oidc.user;
    res.send(new_data);
});

app.get('/answer/:answer', (req, res) => {
    let answer = req.params.answer;
    const answer_key = ['A distributed ledger of trasactions', 'A Blockchain', 'A way for web3 apps to interact with an EVM Blockchain'];
    const true_false = answer_key.includes(answer);
    if (true_false == 'true') {
        res.send(true_false);
    } else {
        res.send(true_false);
    }
});

// // Handling Get Request '/'
app.post("/savescore", (req, res) => {
    console.log('score saved');
    createListingProx(req.body.email,req.body.score,req.body.qid,req.body.aid);
});

app.get('/check_entry/:email', async (req, res) => { //get requests to the root ("/") will route here
    //select from db if user is present 
    const entry_present = await findOneListingByName(req.params.email).then(function(result) {
        return result;
    });
   
    res.send('email check');
});

app.get('/remove_score', async (req, res) => { //get requests to the root ("/") will route here
    //select from db if user is present 
    const entry_present = await deleteListingsScrapedBeforeDate(req.oidc.user.email).then(function(result) {
        return result;
    });
    console.log('Answers Removed')
    res.send('Answers Removed');
});

app.get('/getscore', async (req, res) => { //get requests to the root ("/") will route here
    //select from db if user is present 
    const total = await getAllListingByName(req.oidc.user.email).then(function(result) {
        return result;
    });
    console.log('Total')
    console.log(total)
    res.send(total);
});

app.listen(port, () => { //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`);
});