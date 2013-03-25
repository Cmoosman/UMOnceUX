var UMOASAdManager = (function () {

    //Private Variables
	var _preRollAdManager = [];
	var _midRollAdManager = [];
	var _postRollAdManager = [];
	var _totalNumberPrerollAds;
	var _totalPrerollTime;
	var _totalPostrollTime;
	var _totalMidrollTime;
	var _prerollAd;
	var _midrollAd;
	var _postrollAd;

    //Private Methods
   	var getRawTime;
   	var formatTime;
   	var clearDataProviders;
	
    return {

        //Public Variables
	    preRollAdManager: _preRollAdManager,
		midRollAdManager: _midRollAdManager,
		postRollAdManager: _postRollAdManager,
		totalPrerollTime: _totalPrerollTime,
		totalPostrollTime: _totalPostrollTime,
		totalMidrollTime: _totalMidrollTime,
		
        //Public Methods
        
        /**
		 * Gets the total ad slot time and checks for multiple ads
		 * 
		 * @adBreakNodes : an array of all the ad breaks 
		 * 
		 * @adBreakNodes : properties
		 * 	 breakType :  generally linear
	     *   breakId : preroll/midroll/postroll
	     *   timeOffset : vmap slot identifier
	     *   adDuration : actual running time of ad
		 *
		 */
		GetTotalAdSlotProperties: function(adBreakNodes){
        	   

		    for (var j = 0; j < adBreakNodes.length; j++)
		    {
		    	
				if(adBreakNodes[j].timeOffset == "start"){
					
					var adDuration = adBreakNodes[j].adDuration;
					var rawTime = UMOASAdManager.getRawTime(adDuration);
					
					if(_totalPrerollTime){
						_totalPrerollTime = _totalPrerollTime + rawTime;
					}
					else{
						_totalPrerollTime = rawTime;
					}
					_prerollAd = {};							
					_prerollAd["adNumber"] = adBreakNodes[j].breakId;
					_prerollAd["duration"] = adDuration;
					_prerollAd["type"] = "preroll";
					
					_totalNumberPrerollAds = j;
					
					_preRollAdManager.push(_prerollAd);
				}
				else if(adBreakNodes[j].timeOffset == "end"){
					
					var adDuration = adBreakNodes[j].adDuration;
					var rawTime = UMOASAdManager.getRawTime(adDuration);
					
					if(_totalPostrollTime){
						_totalPostrollTime = _totalPostrollTime + rawTime;
					}
					else{
						_totalPostrollTime = rawTime;
					}
					
					_postrollAd = {};
					_postrollAd["adNumber"] = adBreakNodes[j].breakId;
					_postrollAd["duration"] = adBreakNodes[j].adDuration;
					_postrollAd["type"] = "postroll";
					
					_postRollAdManager.push(_postrollAd);
				}
				else{
					
					var adDuration = adBreakNodes[j].timeOffset;
					var rawTime = UMOASAdManager.getRawTime(adDuration);
					
					if(_totalMidrollTime){
						_totalMidrollTime = _totalMidrollTime + rawTime;
					}
					else{
						_totalMidrollTime = rawTime;
					}
					
					_midrollAd = {};
					_midrollAd["adNumber"] = adBreakNodes[j].breakId;
					_midrollAd["duration"] = adBreakNodes[j].adDuration;
					_midrollAd["timeOffset"] = adBreakNodes[j].timeOffset;
					_midrollAd["type"] = "midroll";
					
					_midRollAdManager.push(_midrollAd);
				}   
            }
            
           	totalPrerollTime = UMOASAdManager.formatTime(_totalPrerollTime);
            totalMidrollTime = UMOASAdManager.formatTime(_totalMidrollTime);
            totalPostrollTime = UMOASAdManager.formatTime(_totalPostrollTime);
            
		},


        //=======================================Utility methods================================================//

		/**
		 * Clears all data providers 
		 * 
		 * Should be called on load of new OAS URL
		 * 
		 */
        clearDataProviders: function () {
            
            _preRollAdManager = [];
			_midRollAdManager = [];
			_postRollAdManager = [];
			
			_totalPrerollTime = "";
			_totalPostrollTime = "";
			_totalMidrollTime = "";
			
        },
        
        getRawTime: function(seconds) {
		  
			var b = seconds.split(/\D/);
			var secTime = (+b[0])*60*60 + (+b[1])*60 + (+b[2]); 
			return secTime;
		},
		
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

// Usage:

/*
* Adds a object to our path dataprovider
*  beaconTemplateData.addPath(id, path);
*
* Updates a object to our path dataprovider
*  beaconTemplateData.createUpdatePath(id, path);
*
* Removes a object to our path dataprovider
*  beaconTemplateData.removePath(id, path);
*
* Updates a object to our querystring dataprovider
*   beaconTemplateData.createUpdateQueryStringKVP(keyid, keyname, keyvalue);
*
* Removes a object to our querystring dataprovider
*  beaconTemplateData.removeQueryStringKVP(keyid, keyname, keyvalue);
*
*
*
*/
     