var discord = require('discord.js');
//var textMeme = require('text-meme');
var memeUrl = require('get-meme-urls');
var randomWord = require('random-word');
var ifunny = require('ifunny-web-api');
var jokeAPI = require('give-me-a-joke');
var config = {
  "prefix":"!",
  "token" : "NTkyNzYyMDc0ODQ5ODY5ODU1.XREDOw.CWl_97RIWRg6GpnhVZVQKvu_E8s",
  "serverInvite" : "https://discordapp.com/oauth2/authorize?client_id=592762074849869855&scope=bot&permissions=2102918271"
}
function sendEmbed(msg, embedTitle, color, text, footer, image) {
  const embed = new discord.RichEmbed()
  .setTitle(embedTitle)
  .setColor(color)
  .setDescription(text)
  .setFooter(footer + " || Bot created for Discord Hackweek! ||")
  .setImage(image)
  msg.channel.send({embed});
}

function iFunnyResponse(msg,counter) {
    ifunny({shuffle: true},function(err,res) {

          if (counter == 5) {
            sendEmbed(msg, "iFunny Error", 0xf45042, "iFunny API failed to supply a meme! Sorry :(", "Good Memes Since 3000")
            return;
          }
          if (res == undefined){
            iFunnyResponse(msg, counter++)
          }
          var image = res[Math.floor((Math.random()*res.length)+1)]
          console.log(image);
          if (image.src == "/images/1x1.gif" || image.type=="mp4") {
            iFunnyResponse(msg, counter++)
          } else {
            sendEmbed(msg, "iFunny Meme", 0x4286f4, "Heres a good meme!", "Good Memes Since 3000", image.src)
          }
    })
}






var commands = [
  {
    "cmd": "commands",
    "whatDoes": config.prefix + "commands | Gives user a list of commands",
    "callback":function(msg){
      var list = "";
      var i;
      for (i=0;i<commands.length;i++){
        list = list + commands[i].whatDoes + "\n"
      }      
      sendEmbed(msg, "Commands", 0x4286f4, list, "I'm here to help!");
      //msg.channel.send(list);
      }
  },


  {
    "cmd": "makemelaugh",
    "whatDoes": config.prefix + "makemelaugh | Generates a random meme!",
    "callback":function(msg){


      var word = randomWord();
      memeUrl(word,{"pageSize":5}).then(res=>{
       console.log(res)
       if (res.length == 0){
         sendEmbed(msg,"Meme Error", 0x4286f4, "Sorry, we failed to make you laugh (keyword had no response) (word: " + word + ")", "Cringe Memes Since 2019")
       } else {
       var image = res[Math.floor((Math.random()*res.length)+1)]
       sendEmbed(msg,"Memes Galore!",0x4286f4,"Here's your spicy meme!","Cringe Memes Since 2019 (word: " + word + ")", image);
       }
     })
    }
  },

  {
    "cmd":"ifunny",
    "whatDoes":config.prefix+"ifunny | We get it, they suck.",
    "callback":function(msg) {
          iFunnyResponse(msg,0)
        }
    
  },

  {
    "cmd":"dadjoke",
    "whatDoes":config.prefix+"dadjoke | Dad, is that you?",
    "callback":function(msg) {
      jokeAPI.getRandomDadJoke (function(joke) {
        sendEmbed("Dad Joke", 0x4286f4, joke, "Dad...");
      })
    } 
  },


  {
    "cmd":"findmeme",
    "whatDoes": config.prefix + "findmeme [Search Query] | Get them hot memes under your searching knowledge.",
    "callback":function(msg){
     var variables = msg.content.split(" ");
     variables.splice(0,1)
     var searchQuery = variables.join(" ");
       memeUrl(searchQuery, {"pageSize": 5}).then(res=>{
       if (res.length == 0){
       sendEmbed(msg,"Meme Error 404!",0x4286f4,"We cannot find a meme with this query, please try again with another.","Cringe Memes Since 2019","https://media1.giphy.com/media/a9xhxAxaqOfQs/giphy.gif");
       } else {
       var image = res[Math.floor((Math.random()*res.length)+1)]
       sendEmbed(msg,"Memes Galore!",0x4286f4,"Here's your spicy meme!","Cringe Memes Since 2019", image);
       }
       
     })
    }
  },

  {
    "cmd": "tictactoe",
    "whatDoes": config.prefix + "tictactoe [User] | Tic Tac, let 'em rip!",
    "callback": function(msg){
      
    }
  }
  

]



function setStream(){
      client.user.setPresence({
        game: {
            name: '',
            type: "STREAMING",
            url: "https://www.twitch.tv/Powzk"
        }
    });
}

function setStatus(stat){
      client.user.setPresence({
        status: stat
    });
}







var client = new discord.Client();

// Ready 
client.on("ready", r=>{
  //client.

  console.log("DiscrodBot has successfully started with no errors!")



  // disco status
  var status = 0;
  function disco(){
    setTimeout(function(){
    
    console.log(status)
    if (status == 5){
      status = 0
    }
    statuses = [
      "STREAMING",
      "online",
      "idle",
      "dnd"
    ]

    if (statuses[status] == "STREAMING"){
      console.log('stream')
      setStream()
    } else {
      console.log(statuses[status])
      setStatus(statuses[status])
    }
    status++
    disco();
    }, 600000)
  }
  disco();

  
})


// Command Module
client.on('message', message=>{
  if (message.author.bot) { return };
  var i;
  for (i=0;i<commands.length;i++){
    //console.log(commands[i].cmd);
    if (message.content.toLowerCase().startsWith(config.prefix + commands[i].cmd.toLowerCase())){
      commands[i].callback(message)
    }
  }
})


client.login(config.token);
