var config = require('./config');
var createMonsterNamer = require('material-monsters');
var callBackOnNextTick = require('conform-async');
var createProbable = require('probable').createProbable;
var seedrandom = require('seedrandom');
var Twit = require('twit');

var twit = new Twit(config.twitter);

var dryRun = false;
if (process.argv.length > 2) {
  dryRun = (process.argv[2].toLowerCase() == '--dry');
}

var seed = (new Date()).toISOString();
console.log('seed:', seed);

var namer = createMonsterNamer({
  random: seedrandom(seed)
});

namer.nameMonster(postName)

function postName(error, namePackage) {
  if (error) {
    console.log(error);
  }
  else {
    console.log(namePackage);
    postTweet(namePackage.name);
  }
}

function postTweet(text) {
  if (dryRun) {
    console.log('Would have tweeted:', text);
  }
  else {
    twit.post(
      'statuses/update',
      {
        status: text
      },
      function tweetDone(error, data, response) {
        if (error) {
          console.log(error);
          console.log('data:', data);
        }
        else {
          console.log('Posted to Twitter:', text);
        }
      }
    );
  }
}
