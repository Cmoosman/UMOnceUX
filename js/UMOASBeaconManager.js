var UMOASBeaconManager = (function () {

    //Private Variables
	var _currentBeaconURL;
	var _firstQuartile = "firstQuartile"; 
					
    //Private Methods
   	
	
    return {

        //Public Variables
	    currentBeaconURL: _currentBeaconURL,
        
        //Public Methods
        
        /**
		 * Fires beacon URLs from client
		 * 
		 * @beaconURL : beacon URL for the specific beacon event to be fired
		 *
		 * 
		 */
		beaconEventHandler: function(adBreakTracking, currentAd){
			
			for(var r=0; r < adBreakTracking.length; r++){
				if(adBreakTracking[r].adBreakID == currentAd){
				
					_currentBeaconURL = adBreakTracking[r].firstQuartile;
					var adBeaconEvent = "Ad with breakId: " + currentAd + " Beacon URL: " + _currentBeaconURL; 
					writeToEventConsole(adBeaconEvent);
					break;
				}
			}
		  	
		  	currentBeaconURL = _currentBeaconURL;
		  	
		  	$.ajax({
                type: 'POST',
                url: currentBeaconURL,
                success: function (data) {
                    //$("#vmapResponse").text(data);
                   
                }
            });	
            
        
		}

    };

})();


     