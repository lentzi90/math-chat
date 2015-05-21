<?php

    $function = $_POST['function'];
    
    $log = array();
    
    switch($function) {
    
		case('getState'):
			if (file_exists('chatlog.txt')) {
				$lines = file('chatlog.txt');
			}
			$log['state'] = count($lines); 
			break;  
      
		case('update'):
			$state = $_POST['state'];
			if (file_exists('chatlog.txt')) {
				$lines = file('chatlog.txt');
			}
			$count =  count($lines);
			if ($state == $count){
				$log['state'] = $state;
				$log['text'] = false;
			} else {
				$text= array();
				$log['state'] = $count;
				$line_num = 0;
				$chatlog = fopen("chatlog.txt", "r") or die("Unable to open file!");
				$text = "";
				while(!feof($chatlog)) {
					if ($line_num >= $state){
						$text = $text . fgets($chatlog);
					}
					else {
						fgets($chatlog);
					}
					$line_num = $line_num +1;
				}
				fclose($chatlog);
				$log['text'] = $text;
				
				// control filesize
				if ($count > 5000) {
					copy('chatlog.txt','chatlog.old');
					$new_file = new SplFileObject('chatlog.txt', 'w');
					foreach (new LimitIterator(new SplFileObject('chatlog.old'), 3000) as $line) {
    					$new_file->fwrite($line);
    				}
				}
			}
   		break;
       
		case('send'):
			$nickname = htmlentities(strip_tags($_POST['nickname']));
			$reg_exUrl = "/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/";
			$message = $_POST['message'];
			// check message length
			if(strlen($message) > 600) {
				// message too long
				$message = "<div>Meddelandet är för långt för att visa!</div>";
			}
			
			//add nickname and timestamp
			$time = time();
			$message = '<div class="bg-info">['.date('H:i:s', $time).'] '.$nickname.':</div>' . $message;
	     
			if (($message) != "\n") {
				if (preg_match($reg_exUrl, $message, $url)) {
					$message = preg_replace($reg_exUrl, '<a href="'.$url[0].'" target="_blank">'.$url[0].'</a>', $message);
				}
				$chatlog = fopen('chatlog.txt', 'a');
				// write to file with stripslashes to produce plain html
				fwrite($chatlog, stripslashes($message) . "\n");
				fclose($chatlog);
			}
			echo "server got message";
			break;
	}

	echo json_encode($log);

    
?>
