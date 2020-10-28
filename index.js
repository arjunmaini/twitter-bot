const Twit = require('twit');
const notifier = require('node-notifier');
const open = require('open');
const franc = require('franc');
const ejs = require('ejs');
const express = require('express');
const session = require('express-session');
const schedule = require('node-schedule');
const LoginWithTwitter = require('login-with-twitter');
const app = express()
const tw = new LoginWithTwitter({
    consumerKey: 'kbZS75go130eVtCKtjRMPpv2b',
    consumerSecret: 'ItW7MICvwmDIroGrvvtcInhhw7Z0eDSjGJ0QZQ7OyF0hcHqLto',
    callbackUrl: 'http://localhost:3000/sign'
  })

  app.use(express.urlencoded())
;
app.set('view engine', 'ejs')
app.use(session({
      secret:'argsbrhym',
      cookie:{}
  }))

app.get('/', function(req, res){
    res.render('index');
});

app.get('/loginTwitter', function(req, res){
    tw.login((err, tokenSecret, url) => {
        if (err) {
        }
        
        // Save the OAuth token secret for use in your /twitter/callback route
        req.session.tokenSecret = tokenSecret

        // Redirect to the /twitter/callback route, with the OAuth responses as query params
        res.redirect(url)
      })
});

app.get('/sign', (req, res) => {
    var params = {
        oauth_token : req.query.oauth_token,
        oauth_verifier : req.query.oauth_verifier
    } 

    tw.callback(params, req.session.tokenSecret, (err, user) => {
          req.session.user = user
          res.redirect('/dash');
    })
});

app.get('/dash', function(req, res){
    if(req.session.user){
        res.render('dash', {user : req.session.user})
    }else{
        res.redirect('/')
    }
});

app.post('/postTweet', (req, res) => {
    
    var T = new Twit({
        consumer_key:         'kbZS75go130eVtCKtjRMPpv2b',
        consumer_secret:      'ItW7MICvwmDIroGrvvtcInhhw7Z0eDSjGJ0QZQ7OyF0hcHqLto',
        access_token:         req.session.user.userToken,
        access_token_secret:  req.session.user.userTokenSecret,
    })
          
        T.post('statuses/update', { status: req.body.tweet_content }, function(err, data, response) {
         res.redirect('dash')
        })        
} )

app.post('/scheduleTweet', (req, res) => {
    var T = new Twit({
        consumer_key:         'kbZS75go130eVtCKtjRMPpv2b',
        consumer_secret:      'ItW7MICvwmDIroGrvvtcInhhw7Z0eDSjGJ0QZQ7OyF0hcHqLto',
        access_token:         req.session.user.userToken,
        access_token_secret:  req.session.user.userTokenSecret,
    })

    var str = req.body.post_date;
    date = str.split("T")[0];
    time = str.split("T")[1];
    ta = time.split(":");
    da = date.split(":");

    var date = new Date(da[0], da[1], da[2], ta[0], ta[1], 0);
 
    var j = schedule.scheduleJob(date, function(){
        T.post('statuses/update', { status: req.body.scheduled_tweet_content }, function(err, data, response) {
           }) 
    });

    res.redirect('dash')



})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server started on port 3000'));