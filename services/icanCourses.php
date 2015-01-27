<?php

$category = $_GET["category"];

include 'config.php';

$mysql = mysql_connect($db_host, $db_user, $db_pwd);
mysql_select_db($db_name);
$Query = "SELECT  distinct(course) from questions where category = '$category' ";
$Result = mysql_query($Query);

$rows = array();

$num = mysql_num_rows($Result);

if(!($num == 0)){
while ($r = mysql_fetch_assoc($Result)) {
   $rows[] = $r;
   		}
   echo '{"courses":'. json_encode($rows) .'}'; 
}
else{
	echo "Errro";
}

?>