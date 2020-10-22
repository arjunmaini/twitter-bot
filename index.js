const twit = require('twit');
const notifier = require('node-notifier');
const open = require('open');
const franc = require('franc');
const express = require('express');
const app = express();

const apiKey = 'kbZS75go130eVtCKtjRMPpv2b'
const apiSecretKey = 'ItW7MICvwmDIroGrvvtcInhhw7Z0eDSjGJ0QZQ7OyF0hcHqLto'
const accessToken = '1318427402544975877-C2iZ1oz7RlWGq0XGkRon9DoqrhfgL6'
const accessTokenSecret = 'eINKmOI9lARX81yQdXoitXX4pPigGUlm67jb892sDyfra'

var T= new twit({

    consumer_key : apiKey,
    consumer_secret : apiSecretKey,
    access_token : accessToken,
    access_token_secret : accessTokenSecret

});

app.get('/', function(req, res){
    res.send('Welcome to twitter app!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server started on port 3000'));