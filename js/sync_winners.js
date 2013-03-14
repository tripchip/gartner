window.dao =  {

    syncURL: "http://app.onlineportfolio.co.uk/sync/getDataGeneric.php",

    initialize: function(callback) {
        var self = this;
        this.db = window.openDatabase("GWCDreamshock06", "1.0", "GWCDreamshock06", 65536);

 
        this.db.transaction(
            function(tx) {
                tx.executeSql("SELECT newsID FROM sqlite_master WHERE type='table' AND name='news'", this.txErrorHandler,
                    function(tx, results) {
                        if (results.rows.length == 1) {
                            log('Using existing News table in local SQLite database');
                        }
                        else
                        {
                            log('News table does not exist in local SQLite database');
                            self.createTable(callback);
                        }
                    });
            }
        )

    },
        
   
    getLastSync: function(callback) {
        this.db.transaction(
            function(tx) {
                var sql = "SELECT MAX(lastModified) as lastSync FROM news";
                tx.executeSql(sql, this.txErrorHandler,
                    function(tx, results) {
                        var lastSync = results.rows.item(0).lastSync;
                        log('Last local timestamp is ' + lastSync);
                        callback(lastSync);
                    }
                );
            }
        );
    },




    sync: function(callback) {

        var self = this;
        log('Starting synchronization stuff...');
        this.getLastSync(function(lastSync){
	            self.getChanges(self.syncURL, lastSync,
                function (changes) {
                    if (changes.length > 0) {
                        self.applyChanges(changes, callback);
                    } else {
                        log('Nothing to synchronize');
       
                    }
                }
            );
        });

    },

    getChanges: function(syncURL, modifiedSince, callback) {

        $.ajax({
            url: syncURL,
            data: {modifiedSince: modifiedSince,table:'news'},
            dataType:"json",
            success:function (data) {
                log("The server returned " + data.length + " changes that occurred after " + modifiedSince);
                callback(data);
            },
            error: function(model, response) {
              
            }
        });

    },

    applyChanges: function(news, callback) {
        this.db.transaction(
            function(tx) {
                var l = news.length;
                var sql =
                    "INSERT OR REPLACE INTO news (newsID, dateEntered,subject,para,link,photo,published,section,siteLink,location,eventLink,lastModified, imgLink) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
 
                var e;
                for (var i = 0; i < l; i++) {
                    e = news[i];
			
         
					 eventLink=e.eventLink; 
					eventLink=eventLink.toString();
					
					section=e.section;
					section=section.toString();
					
					imgLink=e.newsID+'.jpg';
				  
                    var params = [e.newsID, e.dateEntered, e.subject, e.para, e.link, e.photo, e.published, section, e.siteLink, e.location, eventLink, e.lastModified, imgLink];
                    tx.executeSql(sql, params);
					
	  	  
					    downloadFileNews(e.newsID);		  
						
                }
			
	
            },
            this.txErrorHandler,
            function(tx) {
           
            }
        );
    },

    txErrorHandler: function(tx) {
      
    }
};




dao.initialize(function() {
    console.log('database initialized');
});




function log(msg) {
    $('#log').val($('#log').val() + msg + '\n');
}



  function downloadFileNews(newsID){
	  

		var newsItem=newsID;


	  if (navigator.platform!='Win32') {
		  

							window.requestFileSystem.newsID=newsID;	
							
						window.requestFileSystem(
									 LocalFileSystem.PERSISTENT, 0, 
									 function onFileSystemSuccess(fileSystem,newsID) {
									 fileSystem.root.getFile(
									 

																					
												 "dummy.html", {create: true, exclusive: false}, 
												 function gotFileEntry(fileEntry){
												 var sPath = fileEntry.fullPath.replace("dummy.html","");
												 var fileTransfer = new FileTransfer();
												 fileEntry.remove();
				 
		  							
				 
												 fileTransfer.download(
														    "http://gwc.dreamshock.com/newsImages/thumbs/"+newsItem+"_1.jpg",
														   sPath + newsItem+"_1.jpg",
														   function(theFile) {
														   console.log("download complete: " + theFile.toURI());
														   showLink(theFile.toURI(),newsItem);
														   },
														   function(error) {
														   console.log("download error source " + error.source);
														   console.log("download error target " + error.target);
														   console.log("upload error code: " + error.code);
														   }
														   );
												 }, 
												 fail);
									 }, 
									 fail);
									 
									 
									 
									 
									 	
						window.requestFileSystem(
									 LocalFileSystem.PERSISTENT, 0, 
									 function onFileSystemSuccess(fileSystem,newsID) {
									 fileSystem.root.getFile(
									 

																					
												 "dummy.html", {create: true, exclusive: false}, 
												 function gotFileEntry(fileEntry){
												 var sPath = fileEntry.fullPath.replace("dummy.html","");
												 var fileTransfer = new FileTransfer();
												 fileEntry.remove();
				 
		  					
				 
												 fileTransfer.download(
														    "http://gwc.dreamshock.com/newsImages/large/"+newsItem+"_1.jpg",
														   sPath + newsItem+"_L1.jpg",
														   function(theFile) {
														   console.log("download complete: " + theFile.toURI());
														   showLinkLarge(theFile.toURI(),newsItem);
														   },
														   function(error) {
														   console.log("download error source " + error.source);
														   console.log("download error target " + error.target);
														   console.log("upload error code: " + error.code);
														   }
														   );
												 }, 
												 fail);
									 }, 
									 fail);
									 
					  }
					  
					  else {

						 showLink('images/noImage.jpg',22262);  
				        showLinkLarge('images/noImage.jpg',22262);   
					  }
 
    }
 
    function showLink(url,newsItem){
		

			        db.transaction(function(transaction) {
				
				transaction.executeSql("UPDATE news SET imgLink=? WHERE newsID=?", [url, newsItem]);
				
											

 				  });
				  


    }
 
 
 
 
 
 
     function showLinkLarge(url,newsItem){
		

			        db.transaction(function(transaction) {
				
				transaction.executeSql("UPDATE news SET imgLinkLarge=? WHERE newsID=?", [url, newsItem]);
				
											

 				  });
				  
		

    }
 
 
 
 
 
 
 
 
 
 
 
    function fail(evt) {
     
    }
 
