// Set nickname and display chat
function setNick() {
	nickname = document.getElementById("nickname").value;
	if (nickname == "") {
		alert("Please pick a nickname!");
	} else {
    document.getElementById("nickchooser").style.display = "none";
    document.getElementById("chat-body").style.display = "block";
  }
}

function sendMessage() {
	//var message = jQuery('#message').html();
	var message = extractMessage();
	var now = new Date();
	var MyDateString;
	
	// slice(-2) takes the last 2 chars from the string so "019" becomes "19"
	var dateStr = ('0' + now.getHours()).slice(-2) + ':'
	             + ('0' + (now.getMinutes()+1)).slice(-2) + ':'
	             + now.getSeconds();

	$('#history').append('<div class="bg-info">'+'['+dateStr+'] '+nickname+':</div>');
	message = '<div>'+message+'</div>';
	$('#history').append(message);
	$('.mathquill-embedded-latex').mathquill('revert');
	$('.mathquill-embedded-latex').mathquill();

	$('#message').mathquill('latex', '');
	
	// Scroll to bottom
	$("#history").scrollTop($("#history")[0].scrollHeight);
	
	return;
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

function checkEnterSetNick(event) {
	if(event.keyCode == 13) {
   	setNick();
 	}
}

function checkEnterSendMessage(event) {
	if(event.keyCode == 13) {
   	sendMessage();
 	}
}

// Open chat in window
function chatWindow() {
	var chatWindow = window.open("chatwindow.html","Chat", "width=500, height=500");
	$("#collapseChat").collapse("hide");
}
