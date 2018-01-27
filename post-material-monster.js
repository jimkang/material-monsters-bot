/* global process */

var config = require('./config');
var createMonsterNamer = require('material-monsters');
var seedrandom = require('seedrandom');
var Twit = require('twit');

var StaticWebArchiveOnGit = require('static-web-archive-on-git');
var queue = require('d3-queue').queue;
var randomId = require('idmaker').randomId;

var staticWebStream = StaticWebArchiveOnGit({
  config: config.github,
  title: config.archiveName,
  footerScript: `<script type="text/javascript">
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-49491163-1', 'jimkang.com');
  ga('send', 'pageview');
</script>`,
  maxEntriesPerPage: 50
});

var twit = new Twit(config.twitter);

var dryRun = false;
if (process.argv.length > 2) {
  dryRun = process.argv[2].toLowerCase() == '--dry';
}

var seed = new Date().toISOString();
console.log('seed:', seed);

var namer = createMonsterNamer({
  random: seedrandom(seed)
});

namer.nameMonster(postToTargets);

function postToTargets(error, namePackage) {
  if (error) {
    logError(error);
  } else {
    var text = namePackage.name;
    if (dryRun) {
      console.log('Would have tweeted:', text);
    } else {
      var q = queue();
      q.defer(postTweet, text);
      q.defer(postToArchive, text);
      q.await(logError);
    }
  }
}

function postTweet(text, done) {
  var body = {
    status: text
  };
  twit.post('statuses/update', body, done);
}

function postToArchive(text, done) {
  var id = 'monster-' + randomId(8);
  staticWebStream.write({
    id,
    date: new Date().toISOString(),
    caption: text
  });
  staticWebStream.end(done);
}

function logError(error) {
  if (error) {
    console.log(error);
  }
}
