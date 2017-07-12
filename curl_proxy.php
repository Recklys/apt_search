<?php

	$ch = curl_init($_GET['url']);
  header('Content-Type: application/json');
	curl_exec($ch);

  curl_close($ch);

?>