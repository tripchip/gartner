<?php include("includes/config.php") ?> 
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Untitled Document</title>
</head>

<body>
<p><b>Tours</b></p>
<p>
  <?php
 $query="SELECT * from tours";
$result=mysql_query($query)or die(mysql_error()."Query is <b>$query</b>");
$numrows=mysql_numrows($result);

while ($row = mysql_fetch_array($result,MYSQL_ASSOC)) {
	
	$fieldlist="";
	$valuelist="";
	
			foreach($row as $k => $v){
				$fieldlist.="$k,";
				
				$v= str_replace("“","\"",$v);
				$v= str_replace("'","",$v);
				$v= str_replace("\n","~",$v);
				$v = iconv("UTF-8","ISO-8859-1//IGNORE",$v);
				
				$v= str_replace("\"","",$v);
				
				$$k = $v;			
				$valuelist.='"'.$$k.'",';
			} 
			
			
	
	$fieldlist=removeComma($fieldlist);
	$valuelist=removeComma($valuelist);
			
			 ?>
<br>

  transaction.executeSql('INSERT INTO tours  (tourID,tourTitle,tourPackage,tourTransfer,tourDuration,tourMeal,tourDescription,tourNotes,tourDistance,imgLink,imgLinkLarge,lastModified) VALUES (<?php echo $tourID?>,"<?php echo $tourTitle?>","<?php echo $tourPackage?>","<?php echo $tourTransferTime?>","<?php echo $tourDuration?>","<?php echo $tourMeal?>","<?php echo $tourDescription?>","<?php echo $tourNotes?>","<?php echo $tourDistance?>","images/tours/thumbs/<?php echo $tourID?>.jpg","images/tours/<?php echo $tourID?>_1.jpg","<?php echo $lastModified?>");'); <br>
<br>

  
  <?  } ?>
  
  <b>Yearbook</b><BR /><BR />
  
  <?php
 $query="SELECT * from yearbookStaff ";
$result=mysql_query($query)or die(mysql_error()."Query is <b>$query</b>");
$numrows=mysql_numrows($result);

while ($row = mysql_fetch_array($result,MYSQL_ASSOC)) {
			foreach($row as $k => $v){$$k = $v;} 
			
			 ?>
  transaction.executeSql('INSERT INTO yearbookStaff  (yearbookID, lastName,firstName,jobTitle,region,jobtype) VALUES (<?php echo $yearbookID?>,"<?php echo $lastName?>","<?php echo $firstName?>","<?php echo $jobTitle?>","<?php echo $region?>","<?php echo $jobtype?>");');
</p>
<? } ?>



 <b>Videos</b><BR /><BR />
  
  <?php
 $query="SELECT * from theVideos ";
$result=mysql_query($query)or die(mysql_error()."Query is <b>$query</b>");
$numrows=mysql_numrows($result);

while ($row = mysql_fetch_array($result,MYSQL_ASSOC)) {
			foreach($row as $k => $v){$$k = $v;} 
			
			 ?><br>
<br>

  transaction.executeSql('INSERT INTO theVideos  (vidID,vidTitle,dateAdded,description,vidFile,vidDuration,eventLink,ranking,views,lastModified) VALUES (<?php echo $vidID?>,"<?php echo $vidTitle?>","<?php echo $dateAdded?>","<?php echo $description?>","<?php echo $vidFile?>","<?php echo $vidDuration?>","<?php echo $eventLink?>","<?php echo $ranking?>","<?php echo $views?>","<?php echo $lastModified?>");');


<? } ?>




<br>
<b><br>
Galleries</b><BR /><BR />
  
  <?php
 $query="SELECT * from theGalleries ";
$result=mysql_query($query)or die(mysql_error()."Query is <b>$query</b>");
$numrows=mysql_numrows($result);

while ($row = mysql_fetch_array($result,MYSQL_ASSOC)) {
			foreach($row as $k => $v){$$k = $v;} 
			
			 ?><br>

  transaction.executeSql('INSERT INTO theGalleries  (gallID, gallTitle,dateAdded,noShots,gallDir,eventLink,description,published,tempStore,lastModified) VALUES (<?php echo $gallID?>,"<?php echo $gallTitle?>","<?php echo $dateAdded?>","<?php echo $noShots?>","<?php echo $gallDir?>","<?php echo $eventLink?>","<?php echo $description?>","<?php echo $published?>","<?php echo $tempStore?>","<?php echo $lastModified?>");');<? } ?><br>
<br>





<br>
<b><br>
Winners Diary</b><BR /><BR />
<?php
 $query="SELECT *,date_format(dateEntered, '%W %D %M %Y') as dateF from news ";
$result=mysql_query($query)or die(mysql_error()."Query is <b>$query</b>");
$numrows=mysql_numrows($result);

while ($row = mysql_fetch_array($result,MYSQL_ASSOC)) {
			foreach($row as $k => $v){$$k = $v;} 
			
		$para= str_replace("'","",$para);
				
		$para= str_replace("&#039;","",$para);
			$para= str_replace("\n","~",$para);	
			 ?>
  <br> <br> transaction.executeSql('INSERT INTO news  (newsID, dateEntered,subject,para,link,photo,published,section,siteLink,location,eventLink,lastModified,imgLink,imgLinkLarge) VALUES (<?php echo $newsID?>,"<?php echo $dateF?>","<?php echo $subject?>","<?php echo $para?>","<?php echo $link?>","<?php echo $photo?>","<?php echo $published?>","<?php echo $section?>","<?php echo $siteLink?>","<?php echo $location?>","<?php echo $eventLink?>","<?php echo $lastModified?>","images/news/thumbs/<?php echo $newsID?>_1.jpg","images/news/<?php echo $newsID?>_1.jpg");');<? } ?>
  <br>
<br>

</body>
</html>