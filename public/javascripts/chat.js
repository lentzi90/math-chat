var chatLogPath = "/chat_server/chatlog.txt";
var chatWindowPath = "/html/chatwindow.html";

var nickname = "Test";

var chat =  new Chat();
var isMinimized = true;


$(window).load( function() {
    // check if nickname already exist, if so, display chat
    chat.checkNick();
    // remember minimization
    chat.checkMin();

    $(function () {
        var socket = io();
        // Sending messages
        $('#message-form').submit(function() {
            socket.emit('chat message', extractMessage());
            $('#message').mathquill('latex', '');
            return false;
        });
        // Receiving messages
        socket.on('chat message', function(msg){
            $('#history').append($('<div>').html(msg));
            $('#history .mathquill-embedded-latex').mathquill('revert');
            $('#history .mathquill-embedded-latex').mathquill();
            window.scrollTo(0, document.body.scrollHeight);
        });
    });
});

function Chat () {
    // methods
    this.checkNick = checkNickname;
    this.checkMin = checkMinimized;
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
