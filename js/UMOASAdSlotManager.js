var UMOASAdSlotManager = (function () {

    //Private Variables
    var _adType;
    var _totalAdSlotAds;
    var _totalAdSlotTime;
	var _currentAdState;
	var _currentAd;
	var _currentAdId;
	var _currentAdSlot; 
	var _currentPrerollAdDuration;
	var _currentMidrollAdDuration;
	var _currentAdManager;
	var _hasAdStarted;
	var _adSlotComplete;
	var _midRollStartTime;
	var _midRollEndTime;
	var _postRollStartTime;
	var _postRollEndTime;
	var _currentAdDuration;
	var _currentRunningAdTime = 0;
	var _midRollAdOverlayFlag = false;
	var _postRollAdOverlayFlag = false;
	var _formatedMidRollFirstEndDuration;
	var _formatedPostRollFirstEndDuration;
	var _currentAdClickURL;
	var _currentBannerURL;
					
    //Private Methods
   	var getRawTime;
   	var formatTime;
   	var clearDataProviders;
   	var adTimer;
   	var updateCurrentAdId;
   	var handleAdCountDownDisplay;
   	var handleCompanionBanners;
	
    return {

        //Public Variables
        adType: _adType,
        totalAdSlotAds: _totalAdSlotAds,
        totalAdSlotTime: _totalAdSlotTime,
        currentAdManager: _currentAdManager,
	    currentAdState: _currentAdState,
	    currentAd: _currentAd,
	    currentAdId: _currentAdId,
		currentAdSlot: _currentAdSlot, 
		hasAdStarted: _hasAdStarted, 
		midRollStartTime: _midRollStartTime,
		midRollEndTime: _midRollEndTime,
		postRollStartTime: _postRollStartTime,
		postRollEndTime: _postRollEndTime,
	    
        //Public Methods
        
        /**
		 * Ad slot configuration
		 * 
		 * We need to setup ad slots for pre/mid/post roll ads that can handle multiple ads per ad slot
		 * 
		 * @adtype : type of ad were expecting preroll/midroll/postroll
		 *
		 * @totalAdSlotAds : total number of ads in each ad slot
		 * 
		 * @currentTime : current playback time
		 * 
		 * @totalAdSlotTime : total time of all ads in the ad slot
		 * 
		 * @midRollStartTime : actual start time for the midroll ad slot
		 * 
		 * @postRollStartTime : actual start time for the postroll ad slot
		 * 
		 * @currentAdManager : current ad manager array
		 * 
		 * @currentAdState : boolean that signals the player is in an ad play state
		 * 
		 * @hasAdStarted : boolean that signals current ad is started
		 * 
		 * 
		 */
		AdSlotConfiguration: function(adtype, totalAdSlotAds, currentTime, totalAdSlotTime, midRollStartTime, midRollEndTime, postRollStartTime, postRollEndTime, currentAdManager, currentAdState, hasAdStarted){
			
			//set vars for ad slot configuration
			_adType = adtype;
			_totalAdSlotAds = totalAdSlotAds;
			_totalAdSlotTime = totalAdSlotTime;
			_currentAdState = currentAdState;
			_currentAdManager = currentAdManager;
			_hasAdStarted = hasAdStarted;
			_midRollStartTime = midRollStartTime;
			_midRollEndTime = midRollEndTime;
			_postRollStartTime = postRollStartTime;
			_postRollEndTime = postRollEndTime;
				
			switch(adtype){
				case "preroll":
					
					//set preroll ad slot window 
					if(currentTime <= totalAdSlotTime){
						
						//sets adSlotComplete true and resets the current ad id
						_adSlotComplete = false;							
						UMOASAdSlotManager.updateCurrentAdId();
						
						if(_currentAdId == _currentAdManager[0].adNumber){
							
							//writeToEventConsole("Current Ad: breakId " + _currentAdId);
							
						}
						else if(_currentAdId == _currentAdManager.length){
							
							//writeToEventConsole("Current Ad: breakId " + _currentAdId);
						}	
						else{
							
							//writeToEventConsole("Current Ad: breakId " + _currentAdId);
						}
					}
					
				break;
				case "midroll":
					
					//set midroll ad slot window 
					if(currentTime >= midRollStartTime){
						
						//sets adSlotComplete true and resets the current ad id
						_adSlotComplete = true;
						UMOASAdSlotManager.updateCurrentAdId();
						
						if(_currentAdId == _currentAdManager[0].adNumber){
							
							//writeToEventConsole("Current Ad: breakId " + _currentAdId);	
							
						}
						else if(_currentAdId > _currentAdManager[0].adNumber){
							
							//writeToEventConsole("Current Ad: breakId " + _currentAdId);
						}	
						else{
							//writeToEventConsole("Current Ad: breakId " + _currentAdId);
						}
					}
					
				break;
				case "postroll":
					
					//sets adSlotComplete true and resets the current ad id
					_adSlotComplete = true;
					UMOASAdSlotManager.updateCurrentAdId();
					
					//set postroll ad slot window 
					if(currentTime >= postRollStartTime){
						
						if(_currentAdId == _currentAdManager[0].breakId){
							
							//writeToEventConsole("Current Ad: breakId " + _currentAdId);
							
						}
						else if(_currentAdId > _currentAdManager[0].adNumber){
							//writeToEventConsole("Current Ad: breakId " + _currentAdId);
						}	
						else{
							//writeToEventConsole("Current Ad: breakId " + _currentAdId);
						}
					}
					
				break;
				default:
				
				break;
			}
        
		},

        //=======================================Utility methods================================================//

		 /**
		 * Update the current ad ID per ad slot
		 * 
		 * We have to account for multiple ads in each of the ad slots pre/mid/post
		 *
		 * 
		 */
		updateCurrentAdId: function(){
			
			
			//set current ad id
			if(currentTime <= _totalAdSlotTime && _hasAdStarted == true && _adSlotComplete == false){
				
				if(adType == "preroll" && currentTime <= _currentAdManager[0].duration){
					
					//set the current ad ID and the current ad duration
					_currentAdId = _currentAdManager[0].adNumber	
					_currentAdDuration = _currentAdManager[0].duration;
					
					//show/hide ad overlay counter
					UMOASAdSlotManager.handleAdCountDownDisplay();
					
				}
				else{
					
					//loop over totalAdSlots array to get the next ad slot
					for(var c=0; c <_totalAdSlotAds; c++){
						
						var currentAdIdNumber = parseInt(_currentAdId);	
						var currentAdSlotNumber = c; 	
						if(currentAdSlotNumber > 0){
							
							//set the current ad ID and the current ad duration
							_currentAdId = _currentAdManager[c].adNumber;
							_currentAdDuration = _currentAdManager[c].duration;
							
							//show/hide ad overlay counter
							UMOASAdSlotManager.handleAdCountDownDisplay();
							break;
						}
					}
					
				}
			}
			else if(currentTime >= _midRollStartTime && _adSlotComplete == true && currentTime < _postRollStartTime){
				
				//we need to get the end time of the first midroll ad if the ad slot has multiple ads
				var midRollFirstAd = UMOASAdSlotManager.getRawTime(_currentAdManager[0].duration);
				var midRollStartTime = UMOASAdSlotManager.getRawTime(_midRollStartTime);
				var rawMidRollFirstEndDuration = midRollStartTime + midRollFirstAd;
				_formatedMidRollFirstEndDuration = UMOASAdSlotManager.formatTime(rawMidRollFirstEndDuration);
				
				//set current ad id
				if(adType == "midroll" && currentTime <= _formatedMidRollFirstEndDuration){
					
					//set the current ad ID and the current ad duration
					_currentAdId = _currentAdManager[0].adNumber	
					_currentAdDuration = _currentAdManager[0].duration;
					
					//show/hide ad overlay counter
					UMOASAdSlotManager.handleAdCountDownDisplay();
				}
				else{
					
					//loop over totalAdSlots array to get the next ad slot
					for(var b = 0; b < _totalAdSlotAds; b++){
						
						var currentAdSlotNumber = b; 	
						if(currentAdSlotNumber > 0){
							
							//set the current ad ID and the current ad duration
							_currentAdId = _currentAdManager[b].adNumber;
							_currentAdDuration = _currentAdManager[b].duration;
							
							//show/hide ad overlay counter
							UMOASAdSlotManager.handleAdCountDownDisplay();
							break;
						}
					}
					
				}
			}	
			else if(currentTime >= _postRollStartTime && _adSlotComplete == true){
				
				//we need to get the end time of the first postroll ad if the ad slot has multiple ads
 				var postRollFirstAd = UMOASAdSlotManager.getRawTime(_currentAdManager[0].duration);
				var postRollStartTime = UMOASAdSlotManager.getRawTime(formattedPostRollStartTime);
				var rawPostRollFirstEndDuration = postRollFirstAd + postRollStartTime;
				_formatedPostRollFirstEndDuration = UMOASAdSlotManager.formatTime(rawPostRollFirstEndDuration);
				
				//set current ad id
				if(adType == "postroll" && currentTime <= _formatedPostRollFirstEndDuration){
					
					//set the current ad ID and the current ad duration
					_currentAdId = _currentAdManager[0].adNumber	
					_currentAdDuration = _currentAdManager[0].duration;
					
					//show/hide ad overlay counter
					UMOASAdSlotManager.handleAdCountDownDisplay();
				}
				else{
					
					//loop over totalAdSlots array to get the next ad slot
					for(var a = 0; a < _totalAdSlotAds; a++){
						
						var currentAdIdNumber = parseInt(_currentAdId);	
						var currentAdSlotNumber = a; 
						if(currentAdSlotNumber > 0){
							
							//set the current ad ID and the current ad duration
							_currentAdId = _currentAdManager[a].adNumber;
							_currentAdDuration = _currentAdManager[a].duration;
							
							//show/hide ad overlay counter
							UMOASAdSlotManager.handleAdCountDownDisplay();
							break;
						}
					}
				}			
			}
		},
		
		 /**
		 * Handle the UI display of the ad overy count down
		 * 
		 * We have to account for multiple ads in each of the ad slots pre/mid/post
		 *
		 */
		handleAdCountDownDisplay: function(){
			
			//we have to reset the _currentRunningAdTime = 0 at the start of each ad slot
			if(currentTime >= _midRollStartTime && _midRollAdOverlayFlag == false){
				
				//use the _midRollAdOverlayFlag to make sure we dont fire duplicate start events
				if(currentTime < _midRollEndTime && _midRollAdOverlayFlag == false){
					_currentRunningAdTime = 0;
					_midRollAdOverlayFlag = true;	
				}
				
			}
			
			//we have to reset the _currentRunningAdTime = 0 at the start of each ad slot
			if(currentTime >= _postRollStartTime && _postRollAdOverlayFlag == false){
				
				//use the _postRollAdOverlayFlag to make sure we dont fire duplicate start events
				if(currentTime < _postRollEndTime && _postRollAdOverlayFlag == false){
					_currentRunningAdTime = 0;
					_postRollAdOverlayFlag = true;	
				}
				
			}
			
			//convert formated time so we can use it in our interval timer
			var rawAdTime = UMOASAdSlotManager.getRawTime(_currentAdDuration);
						
			if(_currentRunningAdTime == 0){
				
				//set the current running time to the ad duration and then start the countdown
				_currentRunningAdTime = rawAdTime;	
				_currentRunningAdTime = _currentRunningAdTime - 1;
				adStartEventHandler(_currentAdId);
				UMOASBeaconManager.beaconEventHandler(adBreakTracking, _currentAdId);
			}
			else{
				_currentRunningAdTime = _currentRunningAdTime - 1;	
				
			}
			
			//handles UI for ad messaging overlay
			var adOverlayMessage = 	"Ad slot: " + _currentAdId + " has " + _currentRunningAdTime + " seconds left.";
			$("#adOverlay").html(adOverlayMessage);	
			
			//handles loading the companion banner with click through URL
			UMOASAdSlotManager.handleCompanionBanners();
		},
		
		 /**
		 * Handle the UI display of the companion banner ads
		 * 
		 * We have to account for multiple ads in each of the ad slots pre/mid/post
		 *
		 * 
		 */
		handleCompanionBanners: function(){
			
			//clear the preroll banner
        	$("#bannerContainer").html("");
        	
  			//loop over the adBreakCompanionBanners array to get the banner and click through URL					
			for(var m = 0; m < adBreakCompanionBanners.length; m++){
				if(adBreakCompanionBanners[m].adBreakID == _currentAdId){
					_currentAdClickURL = adBreakCompanionBanners[m].companionClickThrough;
					_currentBannerURL = adBreakCompanionBanners[m].staticResource;
					break;		
				}
			}	
			
			$("#umvideo").click(function(){
			    //window.location = _currentAdClickURL;
			    window.open(_currentAdClickURL, "_blank");
			});
			   
			//Set up preroll ad slot configuration for companion banners
			var companionBannerTag = "";
    		companionBannerTag += '<a href="' + _currentAdClickURL +'" target="_blank"><img id="companionBanner"  width="300" height="250" alt="" src="' + _currentBannerURL +'"/></a>';
    		$("#bannerContainer").html(companionBannerTag);	
		    
		},
		
		/**
		 * Clears all data providers 
		 * 
		 * Should be called on load of new OAS URL
		 * 
		 */
        clearDataProviders: function () {
            
            _adBreakNodes = [];
    		_adBreakTracking = [];
   			_adBreakCompanionBanners = [];
        },
        
        /**
		 * Converts formated time into numbers that can be added 
		 *
		 * 
		 */
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


     