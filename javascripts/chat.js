var nickname = "";
var chatServerPath = "../chat_server/chat-server.php";
var chatLoginPath = "../chat_server/chat-login.php";

$.ajaxSetup({ cache: false });
var chat =  new Chat();
var instanse = false;
chat.getState();

function Chat () {
    this.update = updateChat;
    this.send = sendChat;
    this.getState = getStateOfChat;
}

//gets the state of the chat
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
// TODO move this to chat.send
function sendMessage() {
	var message = extractMessage();
	
	// control message length
	if (message.length > 500) {
		alert("The mesage is too long! Please split it up.");
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

// TODO Make this obsolete!
function getMessages() {
	$("#history").load(chatLoginPath, function(){
		// update mathquill content in message
		$('#history .mathquill-embedded-latex').mathquill();
		// scrolla ner
		scrollToBottom();
	});
}

// Open chat in window
function chatWindow() {
	var chatWindow = window.open("../chatwindow.html","Chat", "width=500, height=500");
	$("#collapseChat").collapse("hide");
	toggleChat();
}

function checkNickname() {
	if (nickname != "") {
		document.getElementById("nickchooser").style.display = "none";
		document.getElementById("chat-body").style.display = "block";
		getMessages(); // fill the chat with history
		setInterval(updateChat, 1000);
	}
}

// Set nickname and display chat
function setNick() {
	nickname = document.getElementById("nickname").value;
	if (nickname == "") {
		alert("Fyll i chattnamn!");
		return;
	}
	else {
		$.ajax({ // JQuery ajax function
			type: "POST", // Submitting Method
			url: chatLoginPath,
			data: 'nickname='+ nickname, // the data that will be sent
			dataType: "html", // type of returned data
			success: function(data) { // if ajax function results success
				if (data == 0) { // if the returned data equal 0 something went wrong!
					alert("Something went wrong! Try reloading.");
				} else { // if the reurned data not equal 0
					// nickname is set, continue...
					document.getElementById("nickchooser").style.display = "none";
					document.getElementById("chat-body").style.display = "block";
					getMessages(); // fill the chat with history
					setInterval(updateChat, 1000);
				}
			}
		});
	}
}

// toggle chat minimization
function toggleChat() {
	// make sure the chat is scrolled down
	window.setTimeout(scrollToBottom, 1000);
	// let the server know what state the chat is in
	// to make it possible to keep the state between pages
	$.ajax({
		type: "POST",
		url: chatLoginPath,
		data: {'chatmode': 'toggle'},
		dataType: "json",
		success: function(data){
			
		}
	});
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

 // check if nickname already exist, if so, display chat
jQuery(document).ready(function($) {
	checkNickname();
});

