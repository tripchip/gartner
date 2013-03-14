window.dao =  {

    syncURL: "/sync/getDataGeneric.php",

    initialize: function(callback) {
        var self = this;
        this.db = window.openDatabase("GWCApp2k27", "1.0", "GWCApp2k27", 65536);


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
                        callback();
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
                alert(response.responseText);
            }
        });

    },

    applyChanges: function(news, callback) {
        this.db.transaction(
            function(tx) {
                var l = news.length;
                var sql =
                    "INSERT OR REPLACE INTO news (newsID, dateEntered,subject,para,link,photo,published,section,siteLink,location,eventLink,lastModified) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                log('Inserting or Updating in local database:');
				log('SQL IS '+sql);
                var e;
                for (var i = 0; i < l; i++) {
                    e = news[i];
			
         
				  eventLink='1006';
				 eventLink=e.eventLink; 
			
				  
                    var params = [e.newsID, e.dateEntered, e.subject, e.para, e.link, e.photo, e.published, e.section, e.siteLink, e.location, eventLink, e.lastModified];
                    tx.executeSql(sql, params);
                }
                log('Synchronization complete (' + l + ' items synchronized)');
            },
            this.txErrorHandler,
            function(tx) {
                callback();
            }
        );
    },

    txErrorHandler: function(tx) {
        alert(tx.message);
    }
};

dao.initialize(function() {
    console.log('database initialized');
});


function emptyTable() {
		alert ('emptying Table');
        this.db.transaction(
            function(tx) {
                var sql = "delete * from news";
                tx.executeSql(sql, this.txErrorHandler,
                    function(tx, results) {
                 
                       console.log('Table empty');
                       
                    }
					);
            })};


	
	

$('#reset').on('click', function() {
  emptyTable();
});




$('#clearLog').on('click', function() {
    $('#log').val('');
});


function log(msg) {
    $('#log').val($('#log').val() + msg + '\n');
}
