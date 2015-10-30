// required modules
var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');
var mandrill = require('mandrill-api/mandrill');

// API configs
var client = tumblr.createClient({
  consumer_key: 'X',
  consumer_secret: 'X',
  token: 'X',
  token_secret: 'X'
});

var mandrill_client = new mandrill.Mandrill('X');


// globals
var csvFile = fs.readFileSync('friend_list.csv', 'utf-8');
var emailTemplate = fs.readFileSync('email_template.ejs', 'utf8');

// functions
function csvParse(csvFile){
  var arrayOfObjects = [];
  var arr = csvFile.split("\n");
  var newObj;

  keys = arr.shift().split(",");

  arr.forEach(function(contact){
    contact = contact.split(",");
    newObj = {};

    for(var i =0; i < contact.length; i++){
      newObj[keys[i]] = contact[i];
    }

    arrayOfObjects.push(newObj);

  })

  return arrayOfObjects;
}

  client.posts('fullstackmark.tumblr.com', function(err, blog){
    var latestPosts = [];
    var currentDay = new Date().getDate();

    blog.posts.forEach(function(post){
      var postObj = {};
      var postDate = new Date(post.date);

      if((currentDay - postDate.getDate()) <= 7){
        postObj = {
          url: post.post_url,
          title: post.title
        }
        latestPosts.push(postObj);
      }
    })

    csvData = csvParse(csvFile);

    csvData.forEach(function(row){
      firstName = row['firstName'];
      numMonthsSinceContact = row['numMonthsSinceContact'];
      copyTemplate = emailTemplate;

      var customizedTemplate = ejs.render(copyTemplate, {firstName: firstName,
                     numMonthsSinceContact: numMonthsSinceContact,
                     latestPosts: latestPosts
       });

      sendEmail(firstName, row["emailAddress"], "Mark Waldron", "markewaldron@gmail.com", "Check out my blog!", customizedTemplate);

    });

});

function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
  var message = {
      "html": message_html,
      "subject": subject,
      "from_email": from_email,
      "from_name": from_name,
      "to": [{
              "email": to_email,
              "name": to_name
          }],
      "important": false,
      "track_opens": true,
      "auto_html": false,
      "preserve_recipients": true,
      "merge": false,
      "tags": [
          "Fullstack_Tumblrmailer_Workshop"
      ]
  };
  var async = false;
  var ip_pool = "Main Pool";
  mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {

  }, function(error) {
      console.log('A mandrill error occurred: ' + error.name + ' - ' + error.message);
  });
}
