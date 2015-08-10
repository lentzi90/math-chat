var chatServerPath = "/chat_server/chat-server.php";
var chatLogPath = "/chat_server/chatlog.txt";
var chatWindowPath = "/html/chatwindow.html";

var nickname = "Test";

$.ajaxSetup({ cache: false });
var chat =  new Chat();
var isMinimized = true;
var instanse = false;
chat.getState();


$(window).load( function() {
  // check if nickname already exist, if so, display chat
  chat.checkNick();
  // remember minimization
  chat.checkMin();
});

function Chat () {
  // methods
  this.update = updateChat;
  this.send = sendChat;
  this.getState = getStateOfChat;
  this.checkNick = checkNickname;
  this.checkMin = checkMinimized;
}

//gets the state of the chat (number of messages)
function getStateOfChat() {
  if(!instanse){
    instanse = true;
    $.ajax({
      type: "POST",
      url: chatServerPath,
      data: {'function': 'getState'},
      dataType: "json",
      success: function(data) {state = data.state;instanse = false;}
    });
  }
}

//Updates the chat
function updateChat() {
  if(!instanse){
    instanse = true;
    $.ajax({
      type: "POST",
      url: chatServerPath,
      data: {'function': 'update','state': state},
      dataType: "json",
      success: function(data) {
        if(data.text){
          $('#history').append(data.text);
          // update mathquill content in message
          $('#history .mathquill-embedded-latex').mathquill('revert');
          $('#history .mathquill-embedded-latex').mathquill();
          // scrolla ner
          scrollToBottom();
        }

        instanse = false;
        state = data.state;
      }
    });
  }
  else {
    setTimeout(updateChat, 1500);
  }
}

//send the message to server
function sendChat(message, nickname) {
  $.ajax({
    type: "POST",
    url: chatServerPath,
    data: {'function': 'send','message': message,'nickname': nickname},
    dataType: "html",
    success: function(data){
      updateChat();
    }
  });
}

// Send message

function sendMessage() {
  var message = extractMessage();

  // control message length
  if (message.length > 500) {
    alert("The message is too long! Please split it up!");
    return;
  }
  else {
    // clear the input field
    $('#message').mathquill('latex', '');

    message = '<div>'+message+'</div>';
    chat.send(message, nickname);

    return;
  }
}

function getMessages() {
  $("#history").load(chatLogPath, function(){
    // update mathquill content in message
    $('#history .mathquill-embedded-latex').mathquill();
    // scrolla ner
    scrollToBottom();
  });
}

// Open chat in window
function chatWindow() {
  var chatWindow = window.open(chatWindowPath,"Chat", "width=500, height=500");
}

// check nickname from cookies
function checkNickname() {
  nickname = getCookie("nickname");
  if (nickname != "") {
    showChat();
    getMessages(); // fill the chat with history
    setInterval(updateChat, 1000);
  }
}

// Set nickname and display chat
function setNick(nick) {
  nick = nick || 0;
  if (nick) {
    nickname = nick;
  } else { // get from form
    nickname = document.getElementById("nick").value;
  }
  if (nickname == "") {
    alert("Please choose a nickname!");
    return;
  }
  else {
    // nickname is set, continue...
    document.cookie = "nickname="+nickname+"; path=/";
    showChat();
    getMessages(); // fill the chat with history
    setInterval(updateChat, 1000);
    $("#message").mathquill('latex', '').mousedown().mouseup();
  }
}

function checkMinimized() {
  var min = getCookie("minimized");
  if (min == "true") {
    isMinimized = true;
  } else if (min == "false") {
    isMinimized = false;
    $("#collapseChat").collapse("show");
  }
}

// toggle chat minimization
function toggleChat() {
  // make sure the chat is scrolled down
  window.setTimeout(scrollToBottom, 1000);

  isMinimized = !isMinimized;

  if (isMinimized) {
    document.cookie = "minimized=true; path=/";
  } else {
    document.cookie = "minimized=false; path=/";
  }
}

function checkEnterSendMessage(event) {
  if(event.keyCode == 13) {
    sendMessage();
  }
}

function checkEnterSetNick(event) {
  if(event.keyCode == 13) {
    setNick();
  }
}

// extract the message from the mathquill-textbox
function extractMessage() {
  var spans = document.getElementById("message").children;
  var msg = "";
  var i;
  for (i = 0; i <	spans.length; i++) {
    if ($(spans[i]).hasClass("textarea")) {
      // do nothing
    }
    else if ($(spans[i]).hasClass("mathquill-rendered-math")) {
      //extract latex
      var latex = $(spans[i]).mathquill('latex');
      msg += "<span class='mathquill-embedded-latex'>"+latex+"</span>";
    }
    else {
      msg += spans[i].innerHTML;
    }
  }
  return msg;
}

function scrollToBottom() {
  $("#history").scrollTop($("#history")[0].scrollHeight+3);
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
  }
  return "";
}

function showSettings() {
  if (nickname) {
    document.getElementById("settings-nick").value = nickname;
    document.getElementById("settings").style.display = "block";
    document.getElementById("chat-body").style.display = "none";
    document.getElementById("nickchooser").style.display = "none";
    document.getElementById("settings-btn").onclick = showChat;
  } else {
    alert("Please choose a nickname!");
  }
}

function showChat() {
  if (nickname) {
    document.getElementById("nickchooser").style.display = "none";
    document.getElementById("settings").style.display = "none";
    document.getElementById("chat-body").style.display = "block";
    document.getElementById("settings-btn").onclick = showSettings;
  } else {
    alert("Please choose a nickname!");
  }
}

function applySettings() {
  nick = document.getElementById("settings-nick").value;
  setNick(nick);
}
