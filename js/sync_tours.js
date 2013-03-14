window.tours =  {

 
    syncURL: "http://app.onlineportfolio.co.uk/sync/getDataTours.php",

    initialize: function(callback) {
        var self = this;
        this.db = window.openDatabase("GWCDreamshock06", "1.0", "GWCDreamshock06", 65536);

        this.db.transaction(
            function(tx) {
                tx.executeSql("SELECT tourID FROM sqlite_master WHERE type='table' AND name='tours'", this.txErrorHandler,
                    function(tx, results) {
                        if (results.rows.length == 1) {
                            alert('Using existing tours table in local SQLite database');
                        }
                        else
                        {
                            alert('tours table does not exist in local SQLite database');
                            self.createTable(callback);
                        }
                    }); 
            }
        )

    },
        
   
    getLastSync: function(callback) {
        this.db.transaction(
            function(tx) {
                var sql = "SELECT MAX(lastModified) as lastSync FROM tours";
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
            data: {modifiedSince: modifiedSince,table:'tours'},
            dataType:"json",
            success:function (data) {
    
                callback(data);
            },
            error: function(model, response) {
                
            }
        });

    },

    applyChanges: function(tours, callback) {
        this.db.transaction(
            function(tx) {
                var l = tours.length;
                var sql =
                    "INSERT OR REPLACE INTO tours (tourID,tourTitle,tourPackage,tourTransfer,tourDuration,tourMeal,tourDescription,tourNotes,tourDistance,lastModified) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
					
					
				
					
		


                var e;
                for (var i = 0; i < l; i++) {
                    e = tours[i];    	
				  
                    var params = [e.tourID, e.tourTitle, e.tourPackage, e.tourTransferTime, e.tourDuration, e.tourMeal, e.tourDescription,  e.tourNotes, e.tourDistance, e.lastModified];
                    tx.executeSql(sql, params);
					
					
						  
					downloadFileTour(e.tourID);					
									
                }
                log('Synchronization complete (' + l + ' items synchronized)');
            },
            this.txErrorHandler,
            function(tx) {
          
            }
        );
    },

    txErrorHandler: function(tx) {
        alert('point 2 '+ tx.message);
    }
};

tours.initialize(function() {
    console.log('database initialized');
});


	
function log(msg) {
    $('#log').val($('#log').val() + msg + '\n');
}



  function downloadFileTour(tourID){
	  

		var tourItem=tourID;



							
									  
									  
									  
	  if (navigator.platform!='Win32') {


							window.requestFileSystem.tourID=tourID;	
							
						window.requestFileSystem(
									 LocalFileSystem.PERSISTENT, 0, 
									 function onFileSystemSuccess(fileSystem,tourID) {
									 fileSystem.root.getFile(
									 

																					
												 "dummy.html", {create: true, exclusive: false}, 
												 function gotFileEntry(fileEntry){
												 var sPath = fileEntry.fullPath.replace("dummy.html","");
												 var fileTransfer = new FileTransfer();
												 fileEntry.remove();
				 
		  					
			 		  
		  
												 fileTransfer.download(
														    "http://app.onlineportfolio.co.uk/images/tours/thumbs/"+tourItem+".jpg",
														   sPath + tourItem+"_1.jpg",
														   function(theFile) {
														   console.log("download complete: " + theFile.toURI());
														   showLinkTour(theFile.toURI(),tourItem);
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
									 function onFileSystemSuccess(fileSystem,tourID) {
									 fileSystem.root.getFile(
									 

																					
												 "dummy.html", {create: true, exclusive: false}, 
												 function gotFileEntry(fileEntry){
												 var sPath = fileEntry.fullPath.replace("dummy.html","");
												 var fileTransfer = new FileTransfer();
												 fileEntry.remove();
				 
		  					
				 
												 fileTransfer.download(
														    "http://app.onlineportfolio.co.uk/images/tours/"+tourItem+"_1.jpg",
														   sPath + tourItem+"_L1.jpg",
														   function(theFile) {
														   console.log("download complete: " + theFile.toURI());
														   showLinkLargeTour(theFile.toURI(),tourItem);
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

						 showLinkTour('images/noImage.jpg',30031);  
				        showLinkLargeTour('images/noImage.jpg',30031);   
					  }
 
    }
 
    function showLinkTour(url,tourItem){
		

			
			        db.transaction(function(transaction) {
				
				transaction.executeSql("UPDATE tours SET imgLink=? WHERE tourID=?", [url, tourItem]);
				
											

 				  });
				  


    }
 
 
 
 
 
 
     function showLinkLargeTour(url,tourItem){
		
	

			        db.transaction(function(transaction) {
				
				transaction.executeSql("UPDATE tours SET imgLinkLarge=? WHERE tourID=?", [url, tourItem]);
				
											

 				  });
				  
		

    }
 
 
 
 
 
 
 
 
 
 
 
    function fail(evt) {
    
    }
 

