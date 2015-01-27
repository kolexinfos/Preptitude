<?php


include 'config.php';

$mysql = mysql_connect($db_host, $db_user, $db_pwd);
mysql_select_db($db_name);
$Query = "SELECT  * from questions where category like 'bank%' limit 5 ";
$Result = mysql_query($Query);

$rows = array();

$num = mysql_num_rows($Result);


while ($r = mysql_fetch_assoc($Result)) {
   $rows[] = $r;
   		}

echo '{"questions":'. json_encode($rows) .'}'; 

 

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