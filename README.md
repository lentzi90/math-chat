# Math-chat
Math-chat is a basic chat client capable of displaying mathemathical content thanks to [MathQuill](https://github.com/mathquill/mathquill#readme).
[Bootstrap](http://getbootstrap.com/) is used for styling of the user interface.

The server side is *very* basic as of now and written in php with inspiration from [this](https://css-tricks.com/jquery-php-chat/) tutorial.

A demo can be found here: http://lentzi90.github.io/math-chat/

##Purpose
I started Math-chat as part of a school project. My goal was to update the hompage for math students at Åbo Akademi University (Finland) and add a basic chat that would enable straight forward communication of math related things.
The school project was aimed mostly at the user interface so the server side was not my highest priority to begin with. I "chose" php for the server simply because the webpage is hosted on a php server.

This project should be considered experimental and not suited for any critical applications.

##Usage
To include Math-chat on your webpage you need the following:
- jQuery
- Bootstrap
- MathQuill

Include jQuery and Bootstrap like this:
```
<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
```
Then include MathQuill (instructions [here](https://github.com/mathquill/mathquill#usage)):
```
<script src="javascripts/mathquill.min.js"></script>
<link rel="stylesheet" href="stylesheets/mathquill.css">
```
Remember to add the fonts for MathQuill to the server!

And last include [chat.js][] and [style.css][]
[chat.js]: https://github.com/lentzi90/math-chat/blob/master/javascripts/chat.js
[style.css]: https://github.com/lentzi90/math-chat/blob/master/stylesheets/style.css
```
<script src="javascripts/chat.js"></script>
<link rel="stylesheet" href="stylesheets/style.css"
```
**Note:** You may want to change the path of some of the imports depending on where you have your files.

Now add the content of [chat.html][] to your webpage somewhere in the `<body>` and serve [chat-server.php][] as well as [chat-login.php][].

[chat.html]: https://github.com/lentzi90/math-chat/blob/master/html/chat.html
[chat-server.php]: https://github.com/lentzi90/math-chat/blob/master/chat_server/chat-server.php
[chat-login.php]: https://github.com/lentzi90/math-chat/blob/master/chat_server/chat-login.php

**OBS!** The path to `chat-server.php` and `chat-login.php` need to be set manually in `chat.js` as of now.
I will try to make this much simpler in the future!
