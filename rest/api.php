<?php
error_reporting(0);
    
	/* 
		This is an example class script proceeding secured API
		To use this class you should keep same as query string and function name
		Ex: If the query string value operation=delete_user Access modifiers doesn't matter but function should be
		     function delete_user(){
				 You code goes here
			 }
		Class will execute the function dynamically;
		
		usage :
		
		    $object->response(output_data, status_code);
			$object->_request	- to get santinized input 	
			
			output_data : JSON (I am using)
			status_code : Send status message for headers
			
		Add This extension for localhost checking :
			Chrome Extension : Advanced REST client Application
			URL : https://chrome.google.com/webstore/detail/hgmloofddffdnphfgcellkdfbfbjeloo
		
		I used the below table for demo purpose.
		
		CREATE TABLE IF NOT EXISTS `users` (
		  `user_id` int(11) NOT NULL AUTO_INCREMENT,
		  `user_fullname` varchar(25) NOT NULL,
		  `user_email` varchar(50) NOT NULL,
		  `user_password` varchar(50) NOT NULL,
		  `user_status` tinyint(1) NOT NULL DEFAULT '0',
		  PRIMARY KEY (`user_id`)
		) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
 	*/
	
	require_once("Rest.inc.php");
	
	
	class API extends REST {
	
		public $data = "";
		
		const DB_SERVER = "localhost";
		const DB_USER = "rouppaqc_test";
		const DB_PASSWORD = "funnys514";
		const DB = "rouppaqc_bankdb";
		
		private $db = NULL;
	
		public function __construct(){
			parent::__construct();				// Init parent contructor
			$this->dbConnect();					// Initiate Database connection
		}
		
		/*
		 *  Database connection 
		*/
		private function dbConnect(){
			$this->db = mysql_connect(self::DB_SERVER,self::DB_USER,self::DB_PASSWORD);
			if($this->db)
				mysql_select_db(self::DB,$this->db);
		}
		
		/*
		 * Public method for access api.
		 * This method dynmically call the method based on the query string
		 *
		 */
		public function processApi(){
			$func = strtolower(trim(str_replace("/","",$_REQUEST['operation'])));
			if((int)method_exists($this,$func) > 0)
				$this->$func();
			else
			        $error = array('status' => "failed", "result" => "Page not found");
				$this->response($this->json($error),404); // If the method not exist with in this class, response would be "Page not found".
		}
		
		/* 
		 *	Simple login API
		 *  Login must be POST method
		 *  email : <USER EMAIL>
		 *  pwd : <USER PASSWORD>
		 */
		
		private function login(){
			// Cross validation if the request method is POST else it will return "Not Acceptable" status
			if($this->get_request_method() != "POST"){
				$error = array('status' => "failed", "result" => "Invalid request type");
				$this->response($this->json($error),200);
			}
			
			$username = $this->_request['username'];		
			$password = $this->_request['password'];
			
			
			
			// Input validations
			if(!empty($username) and !empty($password)){
				 if(filter_var($username, FILTER_VALIDATE_EMAIL)){
					$sql = mysql_query("SELECT * FROM bnk_staff where email = '$username'", $this->db);
					
					if(!$sql){
					$error = array('status' => "failed", "result" => "SQL Error".mysql_error());
					$this->response($this->json($error), 200);
					
					}		
					
					if(mysql_num_rows($sql) > 0){
						
						$result = mysql_fetch_array($sql,MYSQL_ASSOC);
						$auth_id = $result['auth_id'];
						
						session_start();
						$sessionid = session_id();
						
						$sets = mysql_query("UPDATE  bnk_authentication set session = '$sessionid'  WHERE auth_id = '$auth_id'");
						if($sets){
							$return = array('status' => "result", "result" => $result);
							$this->response($this->json($return), 200);
						}
						else{
							$error = array('status' => "failed", "result" => "SQL Error".mysql_error());
					           	$this->response($this->json($error), 200);
						
						}			
					}
						
					// If no records "No Content" status
					$error = array('status' => "failed", "result" => "Invalid Email address or password");
					$this->response($this->json($error), 200);
				
			}
			// If invalid inputs "Bad Request" status message and reason
			$error = array('status' => "failed", "result" => "Wrongly formatted Email address");
			$this->response($this->json($error), 200);
			
			}
			
			// If invalid inputs "Bad Request" status message and reason
			$error = array('status' => "failed", "result" => "Please send required parameters with this request");
			$this->response($this->json($error), 200);
			
		}
		
		private function deleteUser(){
			// Cross validation if the request method is DELETE else it will return "Not Acceptable" status
			if($this->get_request_method() != "POST"){
				$error = array('status' => "failed", "result" => "Invalid request type");
				$this->response($this->json($error),200);
			}
			$username = $this->_request['username'];
			if($username != NULL){				
				
				$sql = mysql_query("DELETE FROM bnk_staff WHERE email = '$username'");
				if(!$sql){
					$error = array('status' => "failed", "result" => "SQL Error".mysql_error());
					$this->response($this->json($error), 200);
					
					}
				$return = array('status' => "result", "result" => "Successfully one record deleted.");
				$this->response($this->json($return),200);
			}else
				$error = array('status' => "failed", "result" => "Please send a username along with this request");
				$this->response($this->json($error),200);	// If no paramters sent 
		}
		
		private function updateUser(){
			// Cross validation if the request method is DELETE else it will return "Not Acceptable" status
			if($this->get_request_method() != "POST"){
				$error = array('status' => "failed", "result" => "Invalid request type");
				$this->response($this->json($error),200);
			}
			$username = $this->_request['username'];
			$column = $this->_request['column'];
			$value = $this->_request['value'];
			
			if($column != NULL and $value != NULL and $username != NULL ){				
				$sql = mysql_query("UPDATE  bnk_staff SET $column = '$value'  WHERE staff_id = '$username'");
				if(!$sql){
				$error = array('status' => "failed", "result" => "SQL Error".mysql_error());
					$this->response($this->json($error), 200);
					}
					
				$return = array('status' => "Success", "result" => "Successfully updated the record.");
				$this->response($this->json($return),200);
			}else
				$error = array('status' => "failed", "result" => "Please send required parameters with this request");
				$this->response($this->json($error),200); // If no paramters sent or some missing 	
		}
		
		private function createUser(){
			// Cross validation if the request method is DELETE else it will return "Not Acceptable" status
			if($this->get_request_method() != "POST"){
				$error = array('status' => "failed", "result" => "Invalid request type");
				$this->response($this->json($error),200);
			}
			
			
			$auth_id = $this->_request['auth_id']; //Still don't understand how this would work
			$firstname = $this->_request['firstname']; 
			$lastname = $this->_request['lastname']; 
			$department_id = $this->_request['department_id ']; //full description stating problem
			$role_id = $this->_request['role_id ']; //role id from roles table
			$group_id = $this->_request['group_id']; //group id from from groups table
			$supervisor1 = $this->_request['supervisor1']; //could be null
			$supervisor2 = $this->_request['supervisor2']; //could be null
			$staff_grade_id= $this->_request['staff_grade_id'];
			$directorate_id= $this->_request['directorate_id'];
			$email= $this->_request['username'];
			$activity_id= $this->_request['activity_id'];
			
			
			
			
			if($auth_id != NULL and $firstname != NULL and $lastname != NULL and $department_id != NULL and $role_id != NULL and $group_id != NULL and $supervisor1 != NULL and $supervisor2 != NULL and $staff_grade_id!= NULL and $directorate_id!= NULL and $email!= NULL ){
			
				if(checkSession){
				
				$auth =  mysql_query("INSERT INTO bnk_authentication (email,bank_activity_type_activity_type_id) VALUES ('$email' , '$activity_id'");		
				if(!$auth){
					$error = array('status' => "failed", "result" => "SQL Error".mysql_error());
					$this->response($this->json($error), 200);
					}	
				$getauth = mysql_query("Select auth_id from bnk_authentication where email = '$email'");
				
				$newauth = mysql_fetch_array($getauth,MYSQL_ASSOC);
				$authid = $newauth['auth_id'];
				
				$sql = mysql_query("INSERT INTO bnk_staff (auth_id,firstname ,lastname,department_id,role_id ,bnk_groups_group_id ,first_level_supervisor,second_level_supervisor,bnk_Staff_Grade_Staff_Grade_id,bnk_directorate_bnk_directorate_id, email )VALUES ('$authid','$firstname','$lastname','$department_id','$role_id', '$group_id', '$supervisor1', '$supervisor2', '$staff_grade_id', '$directorate_id', '$email')");
				if(!$sql){
					$error = array('status' => "failed", "result" => "SQL Error".mysql_error());
					$this->response($this->json($error), 200);
					
					}
				$return = array('status' => "result", "result" => "Successfully created User.");
				$this->response($this->json($return),200);
				}
				else{
					$error = array('status' => "failed", "result" => "Session Expired");
					$this->response($this->json($error), 200);
				}//End of checking if session expired
			}
				
			else{
				$error = array('status' => "failed", "result" => "Please send required parameters with this request");
				$this->response($this->json($error),200); // If no paramters sent or some missing
			    }//end of checking if variables  are empty
			
			
				
		}
		
		
		
		private function createTicket(){
			// Cross validation if the request method is DELETE else it will return "Not Acceptable" status
			if($this->get_request_method() != "POST"){
				$error = array('status' => "failed", "result" => "Invalid request type");
				$this->response($this->json($error),200);
			}
			
			
			$category = $this->_request['category']; //found in bnk_category table
			$date_started = $this->_request['date_started']; //date opened or re-assigned
			$group = $this->_request['group']; //responsible group found in the bnk_groups table
			$description = $this->_request['description']; //full description stating problem
			//$status = $this->_request['status']; //opened or closed
			$priority = $this->_request['priority']; //high,low or medium and must be system assigned based on category
			$due_date = $this->_request['due_date']; //date before ticket is flagged
			$username = $this->_request['username']; //responsible user from bnk_users table
			$tag_ids = $this->_request['tag_ids'];
			
			
			
			
			if($category != NULL and $date_started != NULL and $group != NULL and $description != NULL and $priority != NULL and $due_date != NULL and $user != NULL and $tag_ids != NULL ){				
				
				$sql = mysql_query("INSERT INTO bnk_tickets (ticket_category, date_started,responsible_group,ticket_description,priority,due_date,responsible_user,bnk_tickettagmap_map_id )VALUES ('$category', '$date_started','$group','$description','$priority', '$due_date', '$username', '$tag_ids')");
				if(!$sql){
					$error = array('status' => "failed", "result" => "SQL Error".mysql_error());
					$this->response($this->json($error), 200);
					
					}
				$return = array('status' => "result", "result" => "Successfully created ticket.");
				$this->response($this->json($return),200);
			}else
				$error = array('status' => "failed", "result" => "Please send required parameters with this request");
				$this->response($this->json($error),200); // If no paramters sent or some missing
		}
		
		
		
		private function deleteTicket(){
			// Cross validation if the request method is DELETE else it will return "Not Acceptable" status
			if($this->get_request_method() != "POST"){
				$error = array('status' => "failed", "result" => "Invalid request type");
				$this->response($this->json($error),200);
			}
			$ticket_id = $this->_request['ticket_id'];
			if($ticket_id != NULL){				
				
				$sql = mysql_query("DELETE FROM bnk_tickets WHERE ticket_id = '$ticket_id'");
				if(!$sql){
					$error = array('status' => "failed", "result" => "SQL Error".mysql_error());
					$this->response($this->json($error), 200);
					
					}
				$return = array('status' => "result", "result" => "Successfully deleted ticket.");
				$this->response($this->json($return),200);
			}else
				$error = array('status' => "failed", "result" => "Please send required parameters with this request");
				$this->response($this->json($error),200); // If no paramters sent or some missing	
				}
		
		
		private function closeTicket(){
			// Cross validation if the request method is DELETE else it will return "Not Acceptable" status
			if($this->get_request_method() != "POST"){
				$error = array('status' => "failed", "result" => "Invalid request type");
				$this->response($this->json($error),200);
			}
			$ticket_id = $this->_request['ticket_id'];
			if($ticket_id != NULL){				
				
				$sql = mysql_query("UPDATE  bnk_tickets SET ticket_status = 'closed'  WHERE ticket_id = '$ticket_id'");
				if(!$sql){
					$error = array('status' => "failed", "result" => "SQL Error".mysql_error());
					$this->response($this->json($error), 200);
					
					}
				$return = array('status' => "result", "result" => "Successfully updated ticket status.");
				$this->response($this->json($return),200);
			}else
				$error = array('status' => "failed", "result" => "Please send required parameters with this request");
				$this->response($this->json($error),200); // If no paramters sent or some missing
		}
		
		private function getTicket(){
			// Cross validation if the request method is DELETE else it will return "Not Acceptable" status
			if($this->get_request_method() != "POST"){
				$error = array('status' => "failed", "result" => "Invalid request type");
				$this->response($this->json($error),200);
			}
			
			$ticket_id = $this->_request['ticket_id'];
			
			if($ticket_id != NULL){				
				
				$sql = mysql_query("SELECT * FROM bnk_tickets where ticket_id = '$ticket_id'", $this->db);
				if(!$sql){
					$error = array('status' => "failed", "result" => "SQL Error".mysql_error());
					$this->response($this->json($error), 200);
					
					}
				if(mysql_num_rows($sql) > 0){
						$result = mysql_fetch_array($sql,MYSQL_ASSOC);
						
						
						// If success everythig is good send header as "OK" and user details
						$return = array('status' => "result", "result" => $result);
						$this->response($this->json($return), 200);
						
						//Troubleshooting
						//$results = array('result' => "True", "msg" => "Test");
						//$this->response($this->json($results), 200);
					}
						
					// If no records "No Content" status
					$error = array('status' => "failed", "result" => "Invalid Ticket ID, no record found");
					$this->response($this->json($error), 200);
			}else
				$error = array('status' => "failed", "result" => "Please send required parameters with this request");
				$this->response($this->json($error),200); // If no paramters sent or some missing
		}
		
		
		private function getAllTicketbyCategory(){
			// Cross validation if the request method is DELETE else it will return "Not Acceptable" status
			if($this->get_request_method() != "POST"){
				$error = array('status' => "failed", "result" => "Invalid request type");
				$this->response($this->json($error),200);
			}
			
			$category_id = $this->_request['category_id'];
			
			if($category_id != NULL){				
				
				$sql = mysql_query("SELECT * FROM bnk_tickets where ticket_category = '$category_id'", $this->db);
				if(!$sql){
					$error = array('status' => "failed", "result" => "SQL Error".mysql_error());
					$this->response($this->json($error), 200);
					
					}
				if(mysql_num_rows($sql) > 0){
						$result = mysql_fetch_array($sql,MYSQL_ASSOC);
						
						
						// If success everythig is good send header as "OK" and user details
						$return = array('status' => "result", "result" => $result);
						$this->response($this->json($return), 200);
						
						//Troubleshooting
						//$results = array('result' => "True", "msg" => "Test");
						//$this->response($this->json($results), 200);
					}
						
					// If no records "No Content" status
					$error = array('status' => "failed", "result" => "Their are no tickets for this category");
					$this->response($this->json($error), 200);
			}else
				$error = array('status' => "failed", "result" => "Please send required parameters with this request");
				$this->response($this->json($error),200); // If no paramters sent or some missing
		}
		
		
		
		private function getAllTicketbyGroup(){
			// Cross validation if the request method is DELETE else it will return "Not Acceptable" status
			if($this->get_request_method() != "POST"){
				$error = array('status' => "failed", "result" => "Invalid request type");
				$this->response($this->json($error),200);
			}
			
			$group = $this->_request['group'];
			
			if($group != NULL and !empty($group) and !isset($group)){				
				
				$sql = mysql_query("SELECT * FROM bnk_tickets where responsible_group = '$group'", $this->db);
				if(!$sql){
					$error = array('status' => "failed", "result" => "SQL Error".mysql_error());
					$this->response($this->json($error), 200);
					
					}
				if(mysql_num_rows($sql) > 0){
						$result = mysql_fetch_array($sql,MYSQL_ASSOC);
						
						
						// If success everythig is good send header as "OK" and user details
						$return = array('status' => "result", "result" => $result);
						$this->response($this->json($return), 200);
						
						//Troubleshooting
						//$results = array('result' => "True", "msg" => "Test");
						//$this->response($this->json($results), 200);
					}
						
					// If no records "No Content" status
					$error = array('status' => "failed", "result" => "Their are no tickets for this group");
					$this->response($this->json($error), 200);
			}else
				$error = array('status' => "failed", "result" => "Please send required parameters with this request");
				$this->response($this->json($error),200); // If no paramters sent or some missing
		}
		
		private function getAllTicketbyUser(){
			// Cross validation if the request method is DELETE else it will return "Not Acceptable" status
			if($this->get_request_method() != "POST"){
				$error = array('status' => "failed", "result" => "Invalid request type");
				$this->response($this->json($error),200);
			}
			
			$username = $this->_request['username'];
			
			if($user_id != NULL){				
				
				$sql = mysql_query("SELECT * FROM bnk_tickets where responsible_user = '$username'", $this->db);
				if(!$sql){
					$error = array('status' => "failed", "result" => "SQL Error".mysql_error());
					$this->response($this->json($error), 200);
					
					}
				if(mysql_num_rows($sql) > 0){
						$result = mysql_fetch_array($sql,MYSQL_ASSOC);
						
						
						// If success everythig is good send header as "OK" and user details
						$return = array('status' => "result", "result" => $result);
						$this->response($this->json($return), 200);
						
						//Troubleshooting
						//$results = array('result' => "True", "msg" => "Test");
						//$this->response($this->json($results), 200);
					}
						
					// If no records "No Content" status
					$error = array('status' => "failed", "result" => "Their are no tickets for this user");
					$this->response($this->json($error), 200);
			}else
				$error = array('status' => "failed", "result" => "Please send required parameters with this request");
				$this->response($this->json($error),200); // If no paramters sent or some missing
		}
		
		private function getGroups(){
			// Cross validation if the request method is DELETE else it will return "Not Acceptable" status
			if($this->get_request_method() != "POST"){
				$error = array('status' => "failed", "result" => "Invalid request type");
				$this->response($this->json($error),200);
			}
			
			$sql = mysql_query("SELECT * FROM bnk_groups" , $this->db);
				if(!$sql){
					$error = array('status' => "failed", "result" => "SQL Error".mysql_error());
					$this->response($this->json($error), 200);
					
					}
				if(mysql_num_rows($sql) > 0){
						$result = mysql_fetch_array($sql,MYSQL_ASSOC);
						
						
						// If success everythig is good send header as "OK" and user details
						$return = array('status' => "result", "result" => $result);
						$this->response($this->json($return), 200);
						
						//Troubleshooting
						//$results = array('result' => "True", "msg" => "Test");
						//$this->response($this->json($results), 200);
					}
						
					// If no records "No Content" status
					$error = array('status' => "failed", "result" => "The group name was not found");
					$this->response($this->json($error), 200);
			}
		
		
		private function getCategory(){
			// Cross validation if the request method is DELETE else it will return "Not Acceptable" status
			if($this->get_request_method() != "POST"){
				$error = array('status' => "failed", "result" => "Invalid request type");
				$this->response($this->json($error),200);
			}
			
			$category = $this->_request['category_id'];
			
			if($category != NULL){				
				
				$sql = mysql_query("SELECT * FROM bnk_ticket_category where id = '$category'", $this->db);
				if(!$sql){
					$error = array('status' => "failed", "result" => "SQL Error".mysql_error());
					$this->response($this->json($error), 200);
					
					}
				if(mysql_num_rows($sql) > 0){
						$result = mysql_fetch_array($sql,MYSQL_ASSOC);
						
						
						// If success everythig is good send header as "OK" and user details
						$return = array('status' => "result", "result" => $result);
						$this->response($this->json($return), 200);
						
						//Troubleshooting
						//$results = array('result' => "True", "msg" => "Test");
						//$this->response($this->json($results), 200);
					}
						
					// If no records "No Content" status
					$error = array('status' => "False", "result" => "The category was not found");
					$this->response($this->json($error), 200);
			}else
				$error = array('status' => "failed", "result" => "Please send required parameters with this request");
				$this->response($this->json($error),200); // If no paramters sent or some missing
		}
		
		private function getUser(){
			// Cross validation if the request method is DELETE else it will return "Not Acceptable" status
			if($this->get_request_method() != "POST"){
				$error = array('status' => "failed", "result" => "Invalid request type");
				$this->response($this->json($error),200);
			}
			
			
			$auth_id = $this->_request['auth_id'];
			$username = $this->_request['username'];
			
			if($user_id != NULL and $auth_id != NULL){
			
				if(checkSession($auth_id)){				
				
				$sql = mysql_query("SELECT * FROM bnk_staff where username = '$username'", $this->db);
				if(!$sql){
					$error = array('status' => "failed", "result" => "SQL Error".mysql_error());
					$this->response($this->json($error), 200);
					
					}
				if(mysql_num_rows($sql) > 0){
						$result = mysql_fetch_array($sql,MYSQL_ASSOC);
						
						
						// If success everythig is good send header as "OK" and user details
						$return = array('status' => "result", "result" => $result);
						$this->response($this->json($return), 200);
						
						//Troubleshooting
						//$results = array('result' => "True", "msg" => "Test");
						//$this->response($this->json($results), 200);
					}
						
					// If no records "No Content" status
					$error = array('status' => "failed", "result" => "The user_id is not correct");
					$this->response($this->json($error), 200);
				}
				else{
				 	$error = array('status' => "failed", "result" => "Session Expired");
					$this->response($this->json($error), 200);
				
				}
			}else
				$error = array('status' => "failed", "result" => "Please send required parameters with this request");
				$this->response($this->json($error),200); // If no paramters sent or some missing
		}
		
		private function getData(){
			// Cross validation if the request method is DELETE else it will return "Not Acceptable" status
			if($this->get_request_method() != "POST"){
				$error = array('status' => "failed", "result" => "Invalid request type");
				$this->response($this->json($error),200);
			}					
				
				$sql = mysql_query("SELECT * FROM bnk_staff " ,  $this->db);
				if(!$sql){
					$error = array('status' => "failed", "result" => "SQL Error".mysql_error());
					$this->response($this->json($error), 200);
					
					}
				if(mysql_num_rows($sql) > 0){
						$result = mysql_fetch_array($sql,MYSQL_ASSOC);
						
						
						// If success everythig is good send header as "OK" and user details
						$return = array('status' => "result", "result" => $result);
						$this->response($this->json($return), 200);
						
						//Troubleshooting
						//$results = array('result' => "True", "msg" => "Test");
						//$this->response($this->json($results), 200);
					}
						
					// If no records "No Content" status
					$error = array('status' => "failed", "result" => "The user_id is not correct");
					$this->response($this->json($error), 200);
					}			
					
		/*
		 *	Encode array into JSON
		*/
		private function json($data){
			if(is_array($data)){
				return json_encode($data);
			}
		}
		
		
		private function checkSession($auth_id){
		        session_start();
			$sessionid = session_id();
			
			$sql = mysql_query("SELECT session FROM bnk_authentication where auth_id = '$auth_id'");
			
			
			$result = mysql_fetch_array($sql,MYSQL_ASSOC);
			$sessionRemote = $result['session'];
			
			if($sessionid = $sessionRemote){
			     return true;
			}
			else{
			   return false;
			}
			
			
		}
		
		
		
	}
	
	// Initiiate Library
	
	$api = new API;
	$api->processApi();
?>