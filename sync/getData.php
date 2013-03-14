<?php 

  //--------------------------------------------------------------------------
  // Example php script for fetching data from mysql database
  //--------------------------------------------------------------------------
  include "../includes/config.php";
  		$data = array();
		
	 $query="SELECT * FROM employee";
$result=mysql_query($query)or die(mysql_error()."Query is <b>$query</b>");	
		
while($row = mysql_fetch_assoc($result)){
    while($elm=each($row))
    {
        if(is_numeric($row[$elm["key"]])){
                    $row[$elm["key"]]=intval($row[$elm["key"]]);
        }
    }
    $rows[] = $row;
}   			
		 

		echo json_encode( $rows );

 

?>