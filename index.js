var discord = require('discord.js');
//var textMeme = require('text-meme');
var memeUrl = require('get-meme-urls');
var randomWord = require('random-word');
var ifunny = require('ifunny-web-api');
var jokeAPI = require('give-me-a-joke');
var givemevideo = require('youtube-random-video');
var fs = require('fs');
var config

var client = new discord.Client();
// remove the fs and the }); at the end when moving to the github :)
fs.readFile('./config.json','utf-8',function(err, data){
	if(err) {
		throw err;
	}

	config = JSON.parse(data);






async function sendEmbed(msg, embedTitle, color, text, footer, image,callback) {
  if (footer == undefined) footer = "";
  const embed = new discord.RichEmbed()
  .setTitle(embedTitle)
  .setColor(color)
  .setDescription(text)
  .setFooter(footer + " || Bot created for Discord Hackweek! ||")
  .setImage(image)
  await msg.channel.send({embed}).then(res=>{
  if (callback != undefined){
    callback();
  }
  })

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
    "cmd":"randomvideo",
    "whatDoes": config.prefix+'randomvideo | Grabs a random video from youtube for no reason at all! :D',
    "callback":function(msg) {
      givemevideo.getRandomVid(config.ytAPIkey, function(err , data){
        //https://www.youtube.com/watch?v=
        var vidID = data.id.videoId
        var completeLink = "https://www.youtube.com/watch?v=" + vidID
        sendEmbed(msg,'Random Video',0x4286f4,'Heres your random video!!').then(res=>{
          msg.channel.send(completeLink)
        })
        
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
      if (msg.mentions.users.first() == undefined){
        sendEmbed(msg,"Tic Tac Toe Error", 0x4286f4,"Please retry the command with a user to Tic Tac with. ","")
      } else if (msg.mentions.users.first().bot) {
        sendEmbed(msg,"Tic Tac Toe Error", 0x4286f4,"You can't play with a bot, are you in the right mood?","")
      } else if (msg.mentions.users.first() == msg.author){
        sendEmbed(msg,"Tic Tac Toe Error", 0x4286f4,"Wait, this isn't how this works... Please mention a **real** friend.","")
      } else {
      sendEmbed(msg,"Tic Tac Toe",0x4286f4, "It's time to let the tic tacing, begin!","Tic Tac, let 'em rip","",function(){
        createTicTacToeBoard(msg);
      });
      
      }
    }
  }
  

]
//❌
//⭕
//⬜

var boards = [

]
var number = [
  "1⃣",
  "2⃣",
  "3⃣",
  "4⃣",
  "5⃣",
  "6⃣",
  "7⃣",
  "8⃣",
  "9⃣",
]

var winXs = [
      [
      "❌","❌","❌",
      "","","",
      "","",""
      ],
      [
      "","","",
      "❌","❌","❌",
      "","",""
      ],
      [
      "","","",
      "","","",
      "❌","❌","❌"
      ],
      [
      "❌","","",
      "❌","","",
      "❌","",""
      ],
      [
      "","❌","",
      "","❌","",
      "","❌",""
      ],
      [
      "","","❌",
      "","","❌",
      "","","❌"
      ],
      [
      "❌","","",
      "","❌","",
      "","","❌"
      ],
      [
      "","","❌",
      "","❌","",
      "❌","",""
      ]
]

var winsOs = [
      [
      "⭕","⭕","⭕",
      "","","",
      "","",""
      ],
      [
      "","","",
      "⭕","⭕","⭕",
      "","",""
      ],
      [
      "","","",
      "","","",
      "⭕","⭕","⭕"
      ],
      [
      "⭕","","",
      "⭕","","",
      "⭕","",""
      ],
      [
      "","⭕","",
      "","⭕","",
      "","⭕",""
      ],
      [
      "","","⭕",
      "","","⭕",
      "","","⭕"
      ],
      [
      "⭕","","",
      "","⭕","",
      "","","⭕"
      ],
      [
      "","","⭕",
      "","⭕","",
      "⭕","",""
      ]
]
function winify(pattern){
  var i;
  for(i=0;i<pattern.length;pattern++){
    if (pattern[i] == "⭕" || pattern[i]=="❌"){
      pattern[i]="🎲"
    } else if (pattern[i] == ""){
      pattern[i]="⬜"
    }
  }
  return pattern
}
function removeBoard(board){
  board[1] = "0"
  board[2] = "0"
}













function checkIfWin(board){

var boardPattern = board[4];

var winner;


winXs.forEach(pattern=>{
  // filter out uneeded stuff from regular board pattern
  var boardCheck = boardPattern.slice(0);
  for (var i=0; i<pattern.length;i++){
    if(pattern[i] == ""){
      boardCheck[i] = ""
    }
  }

  if (boardCheck.toString() == pattern.toString()){
    winner = 0;
  }

})

winsOs.forEach(pattern=>{
  // filter out uneeded stuff from regular board pattern
  var boardCheck = boardPattern.slice(0);
  for (var i=0; i<pattern.length;i++){
    if(pattern[i] == ""){
      boardCheck[i] = ""
    }
  }

  if (boardCheck.toString() == pattern.toString()){
    winner = 1;
  }

})


return winner



}
















function createTicTacToeBoard(msg){
  msg.channel.send("1⃣2⃣3⃣\n4⃣5⃣6⃣\n7⃣8⃣9⃣").then(tictacmessage=>{
    boards.push([
      tictacmessage,
      msg.author.id,
      msg.mentions.users.first().id,
      0,
      [
      "1⃣","2⃣","3⃣",
      "4⃣","5⃣","6⃣",
      "7⃣","8⃣","9⃣"
      ]
    ])

async function r(){
await tictacmessage.react(number[0])
await tictacmessage.react(number[1])
await tictacmessage.react(number[2])
await tictacmessage.react(number[3])
await tictacmessage.react(number[4])
await tictacmessage.react(number[5])
await tictacmessage.react(number[6])
await tictacmessage.react(number[7])
await tictacmessage.react(number[8])

}

r()
msg.channel.send(msg.author + " it is your turn to make a move.")

  })
}

function isInTicMatch(id,msg){
var out = true;
function checkBoard(board){
  if (board[1] == id && board[3] == 0){
    return true
  } else if (board[2] == id && board[3] == 1){
    return true
  } else {
    return false
  }
}
boards.forEach(board=>{
// if the message is a board id
if (board[0].id == msg) {
  out = checkBoard(board);
  return 
}
})
return out;
}

function getBoard(id){
var f = ""
boards.forEach(board=>{
  if (board[1] == id || board[2] == id) {
    f = board
  }
})
return f
}

function getMoveNumber(emoji){
var val = 0;
var i;
for (i=0;i<number.length;i++){
  if(emoji.includes(number[i])){
    val = i
  }
}
return val;

}

function updateBoard(board){
  // parse
  var msg = board[4]
  var stringmsg = board[4][0]+board[4][1]+board[4][2]+"\n"+board[4][3]+board[4][4]+board[4][5]+"\n"+board[4][6]+board[4][7]+board[4][8]+"\n"
  
  board[0].edit(stringmsg);
}














function takeTurn(id,board,emoji){

var option = "⭕"
var number = getMoveNumber(emoji)


// update message

if (board[4][number]=="⭕"||board[4][number]=="❌"){
  return
}

// switch turns

if (board[3] == 0){
  board[3] = 1
  option = "❌"
} else {
  board[3] = 0
}

board[4][number]=option;




updateBoard(board)
var wincheck = checkIfWin(board) 
if (wincheck != undefined){
  var winner;
  if (wincheck == 1){
    winner = board[2]
  } else {
    winner = board[1]
  }
  sendEmbed(board[0], "We have a winner!", 0xFFAC33, "<@" + winner + "> has won the ultimate Tic Tac Toe battle! Congratulations :)", "Tic Tac Toe")
  removeBoard(board);
  updateBoard(board);
  return
}
if (board[3] == 0){
  board[0].channel.send("<@" + board[1] + "> it is your turn to make a move.").then(msg=>{
  msg.delete(1000)
})
} else {
board[0].channel.send("<@" + board[2] + "> it is your turn to make a move.").then(msg=>{
  msg.delete(1000)
})
}
}


// on reaction
client.on('messageReactionAdd', (reaction, user) => {
	console.log(`${user.username} reacted with "${reaction.emoji}".`);
  if (isInTicMatch(user.id, reaction.message.id) == true){
    console.log("Reaction is a match / allowed");
    takeTurn(user.id,getBoard(user.id),reaction.emoji+"")
    reaction.remove(user);
  } else if (user.id == client.user.id){

  } else {
    reaction.remove(user);
    console.log("Reaction is a match / not allowed")
  }

});





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
        status: stat,
        game: {
          name: '!commands | :)'
        }
    });
}







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
















});