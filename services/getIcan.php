<?php


include 'config.php';

$course = $_GET["course"];
$year = $_GET["year"];
$salt = $_GET["soft"];

$secret = 'Funnys5140';

$secret = md5($secret);

$mysql = mysql_connect($db_host, $db_user, $db_pwd);
mysql_select_db($db_name);
$Query = "SELECT  * from questions where course = '$course' and year = '$year' ";
$Result = mysql_query($Query);

$rows = array();

$num = mysql_num_rows($Result);


if ($salt == $secret) {

if(!($num == 0)){
while ($r = mysql_fetch_assoc($Result)) {
   $rows[] = $r;
   		}
   echo '{"questions":'. json_encode($rows) .'}'; 
}
else{
	echo "Error";
}
}
else{
	echo "Hehehe do not try to steal my data";
}

 

// if(($Result = null)){
// while ($r = mysql_fetch_assoc($Result)) {
//   $rows[] = $r;
// }

// echo json_encode($rows);
// }
// else{
// 	echo $rows;
// }

?>