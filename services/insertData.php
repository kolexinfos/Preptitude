<?php


include 'config.php';

$user = $_GET['user'];
$weight = $_GET['weight'];


$mysql = mysql_connect($db_host, $db_user, $db_pwd);

mysql_select_db($db_name);

$Query = "INSERT INTO chart (name,value,month,user) VALUES ('weight', '$weight', 'January', '$user')";
$Result = mysql_query($Query);

 if (!($Result))
   {
   echo json_encode('Error');
   //die('Error: No connection ');
   }
else{
echo json_encode('Success');
}
?>