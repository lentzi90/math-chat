<?php
session_start();

if (isset($_POST)) { // if ajax request submitted
	if (isset($_POST['nickname'])) {
	    $post_nickname = $_POST['nickname']; // the ajax post nickname
	    
	    $_SESSION['nickname'] = $post_nickname; // define a session variable
	    echo $post_nickname; // return a value for the ajax query
	}
	
	// toggle chat minimization
	if (isset($_POST['chatmode'])) {
		$function = $_POST['chatmode'];
		if ($function == "toggle") {
			if ($_SESSION['chatmode'] != "mini") {
				$_SESSION['chatmode'] = "mini";
			} else {
				$_SESSION['chatmode'] = "normal";
			}
		}
		else { // if not toggle, just send the current state
			echo json_encode(array('state' => $_SESSION['chatmode']));
		}

	}
}
?>
