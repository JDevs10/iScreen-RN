<?php
// get licence key
$sql = "SELECT api_key FROM llx_user where login = 'iscreen' AND lastname = 'iscreen' AND admin = 1";
$res = $db->query($sql);


if ($res->num_rows > 0) {
	$row = $db->fetch_array($sql);

	$ISCREEN_KEY = $row['api_key'];
}else{
	$ISCREEN_KEY = '';
}

?>