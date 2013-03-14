window.gals =  {



    syncURL: "http://app.onlineportfolio.co.uk/sync/getDataGalls.php",

    initialize: function(callback) {
		

			
			
        var self = this;
        this.db = window.openDatabase("GWCDreamshock06", "1.0", "GWCDreamshock06", 65536);


        this.db.transaction(
            function(tx) {
                tx.executeSql("SELECT gallID FROM sqlite_master WHERE type='table' AND name='theGalleries'", this.txErrorHandler,
                    function(tx, results) {
                        if (results.rows.length == 1) {
                            alert('Using existing theGalleries table in local SQLite database');
                        }
                        else
                        {
                            alert('theGalleries table does not exist in local SQLite database');
                            self.createTable(callback);
                        }
                    });
            }
        )

    },
        
   
    getLastSync: function(callback) {
        this.db.transaction(
            function(tx) {
                var sql = "SELECT MAX(lastModified) as lastSync FROM theGalleries";
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
            data: {modifiedSince: modifiedSince,table:'theGalleries'},
            dataType:"json",
            success:function (data) {
                log("The server returned " + data.length + " changes that occurred after " + modifiedSince);
                callback(data);
            },
            error: function(model, response) {
                alert('this is '+response.responseText);
            }
        });

    },

    applyChanges: function(theGalleries, callback) {
        this.db.transaction(
            function(tx) {
                var l = theGalleries.length;
                var sql =
                    "INSERT OR REPLACE INTO theGalleries (gallID,gallTitle,dateAdded,noShots,gallDir,eventLink,description,lastModified) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
					
		
                log('Inserting or Updating in local database:');
				log('SQL IS '+sql);
                var e;
                for (var i = 0; i < l; i++) {
                    e = theGalleries[i];    	
					
					eventLink=e.eventLink.toString();
					noShots=e.noShots.toString();	
						
				  
                    var params = [e.gallID, e.gallTitle, e.dateAdded, noShots, e.gallDir, eventLink, e.description,  e.lastModified];
                    tx.executeSql(sql, params);
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

gals.initialize(function() {
    console.log('database initialized');
});


	
function log(msg) {
    $('#log').val($('#log').val() + msg + '\n');
}





