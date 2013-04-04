var UMOASBeaconManager = (function () {

    //Private Variables
	var _currentBeaconURL;
	var _firstQuartile = "firstQuartile"; 
	var _value;
					
    //Private Methods
   	
	
    return {

        //Public Variables
	    currentBeaconURL: _currentBeaconURL,
       
        /**
		 * Fires beacon URLs from client
		 * 
		 * @beaconURL : beacon URL for the specific beacon event to be fired
		 *
		 * 
		 */
		beaconEventHandler: function(currentAd, currentTime, currentTrackingURL){
			
			
			_currentBeaconURL = currentTrackingURL;
			var currentRawTime = currentTime;
			var player = document.getElementById('videoPlayer');
			var humanReadableTime = formatTime(player.currentTime);
			var playheadTime = player.currentTime * 1000;
		
			var adBeaconEvent = "Ad with breakId: " + currentAd + "\n" + " Beacon fired time (milliseconds): " + currentRawTime + "\n" + " Readable play head time: " + humanReadableTime + "\n" + " Current play head time (milliseconds): " + playheadTime + "\n" + " Beacon URL: " + _currentBeaconURL; 
			writeToEventConsole(adBeaconEvent);
		  	
		  	
		  	
		  	$.ajax({
                type: 'POST',
                url: _currentBeaconURL,
                success: function (data) {
                    //$("#vmapResponse").text(data);
                   
                }
            });	
            
        
		},
		
		getRawTime: function(seconds) {
		  
			var b = seconds.split(/\D/);
			var secTime = (+b[0])*60*60 + (+b[1])*60 + (+b[2]); 
			return secTime;
		},
		 
		 /**
		 * Converts raw time into formated human readable time 
		 *
		 * 
		 */
		formatTime: function(secs) {
		   var hours = Math.floor(secs / (60 * 60));

		    var divisor_for_minutes = secs % (60 * 60);
		    var minutes = Math.floor(divisor_for_minutes / 60);
		
		    var divisor_for_seconds = divisor_for_minutes % 60;
		    var seconds = Math.ceil(divisor_for_seconds);
		
			// This line gives you 12-hour (not 24) time
			if (hours > 12) {hours = hours - 12;}
			
			// These lines ensure you have two-digits
			if (hours < 10) {hours = "0"+hours;}
			if (minutes < 10) {minutes = "0"+minutes;}
			if (seconds < 10) {seconds = "0"+seconds;}
			
			// This formats your string to HH:MM:SS
			var t = hours+":"+minutes+":"+seconds;
		
		    return t;
		}

    };

})();


     