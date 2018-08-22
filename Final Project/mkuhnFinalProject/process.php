<?php 
	header("Content-type: application/json");
	$message = array('message'=>'Thank you for your submission');
	echo json_encode($message); 
?>