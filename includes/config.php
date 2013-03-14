<?php
$user="gartner";
$password="impact";
$database="gartnerApp";
mysql_connect("localhost",$user,$password);
@mysql_select_db($database) or die( "Unable to select database $database $user $password");



						
function getSEOTerms($pageID){
			
			global $metaTitle;
			global $metaDesc;
			global $metaKeywords;
				
			$query="SELECT * FROM seo where pageID = $pageID";
			$result=mysql_query($query)or die(mysql_error()."Query is: <b>$query</b>"); 
			$row = mysql_fetch_assoc($result);
			if ($row){foreach($row as $k => $v){$$k = $v;}}	
			
		  eval("\$metaTitle = \"$metaTitle\";");
		  eval("\$metaDesc = \"$metaDesc\";");
		  eval("\$metaKeywords = \"$metaKeywords\";");
			
}


function getCatLink ($catsLink){

	$cats = explode(",", $catsLink); 
	$catFirst=$cats[0];
	
	$query="SELECT catTitle,catID FROM cats where catID = $catFirst";
	$result=mysql_query($query)or die(mysql_error()."Query is: <b>$query</b>"); 
	$row = mysql_fetch_assoc($result);
	if ($row){foreach($row as $k => $v){$$k = $v;}}
	
	
	echo "<a class=nl href=/".encLink($catTitle)."/cat/$catID/>$catTitle</a>";
}

function encLink($name){
	$name=trim($name);
	$name=strtolower($name);
$name=str_replace("(","",$name);
$name=str_replace(")","",$name);
$name=str_replace(" ","-",$name);
$name=str_replace("&amp;","and",$name);
$name=str_replace("&","and",$name);
return "$name";
	
	
}

function decLink($name){
	$name=strtoupper($name);
$name=str_replace("-"," ",$name);
return "$name";
	
	
}



function createCatList(){
	
$query="SELECT * from cats order by catTitle";
$result=mysql_query($query)or die(mysql_error()."Query is <b>$query</b>");
$numrows=mysql_numrows($result);

while ($row = mysql_fetch_array($result,MYSQL_ASSOC)) {
			foreach($row as $k => $v){$$k = $v;}
			
			echo "<option value='$catID'>$catTitle</option>";

}

}



function multiInsert($table,$cols){
				$cols= explode(",", $cols);
				
					 foreach ($cols as $colname) {
											$sqlinsert1.= "$colname, ";
											global $$colname;
				                            $$colname=htmlentities($$colname,ENT_QUOTES)  ;
											if ($colname=="dateAdded" || $colname=="dateEntered")
														{
														$sqlinsert2.= "Now(), ";
														}
													else {
														$sqlinsert2.= "'".$$colname."', ";
														}
											  }
						$sqlinsert1=removeComma($sqlinsert1);
						$sqlinsert2=removeComma($sqlinsert2);				
						$sqlinsert= "($sqlinsert1) values ($sqlinsert2)";
				
				$query="insert into $table $sqlinsert ";
				$result=mysql_query($query)or die(	mysql_error()."<BR><BR><B>$query</b>");

                return mysql_insert_id();

}

function removeComma($var){
		if(substr($var, -2)==", "){$var = substr($var,0,-2);}
		if(substr($var, -1)==","){$var = substr($var,0,-1);}
		return $var;
						}
						
						
function conv($size){

$converted=2.54*$size;
$converted= sprintf("%01.0f", $converted);

if ($converted=="0"){$converted="N/A ";}
return $converted;
}

function checkSection(){
	
global $sectionName;
global $section;
global $eventName;

			if ($sectionName){
				
				$query="SELECT eventName,eventID as section FROM events where destlink = '$sectionName'	";
			$result=mysql_query($query)or die(mysql_error()."Query is: <b>$query</b>"); 
			$row = mysql_fetch_assoc($result);
			if ($row){foreach($row as $k => $v){$$k = $v;}}
				
			}
			if (!isset($section)){$section=1000;}	
}

function dispNewsImagesTH($newsID,$max_i,$size){

        for ($i=1; $i<=$max_i; $i++)  {

         $filename=$_SERVER['DOCUMENT_ROOT']."/newsImages/large/".$newsID."_".$i.".jpg";

            if (file_exists($filename)) {
                echo "<a rel='enlargeimage::click' rev='loadArea' href='/newsImages/large/".$newsID."_".$i.".jpg'>";
				echo "<img width=109 height=63 src=/newsImages/large/".$newsID."_".$i.".jpg></a>";
                }
                }

}



		function open_dir ($dir){
		if (is_dir($dir)) {
			if ($dh = opendir($dir)) {
				while (($file = readdir($dh)) !== false) {
						if (preg_match ("/.jpg/i", "$file")){
						$files.="$file,";
					}
				}
				closedir($dh);
			}
		}
		if(substr($files, -1)==","){$files = substr($files,0,-1);}
		return $files;
}



  function sec2hms ($sec, $padHours = false) 
  {

    $hms = "";
    
    $hours = intval(intval($sec) / 3600); 

//    $hms .= ($padHours) 
   //       ? str_pad($hours, 2, "0", STR_PAD_LEFT). ':'
  //       : $hours. ':';

    $minutes = intval(($sec / 60) % 60); 

    $hms .= str_pad($minutes, 2, "0", STR_PAD_LEFT). ':';

    $seconds = intval($sec % 60); 

    $hms .= str_pad($seconds, 2, "0", STR_PAD_LEFT);

    return $hms;
    
  }
  
     function checkIMG($imgLink){

    if (file_exists($_SERVER['DOCUMENT_ROOT'].$imgLink)) {
        echo $imgLink;
        }
        else {
         echo "/images/nophoto.jpg";
        }

   }
   
        function checkTH($imgLink){

    if (file_exists($_SERVER['DOCUMENT_ROOT'].$imgLink)) {
        echo $imgLink;
        }
        else {
         echo "/content/images/noTH.gif";
        }

   }
   
function getIMGsize($img){
	

list($width, $height, $type, $attr) = getimagesize($_SERVER['DOCUMENT_ROOT'].$img);
echo "width=$width height=$height";

}


?>