/**
 * countdown.js works in tandem with timer.js  
 * 
 * don't try to use them apart, it won't end well! 
 * 
 * see https://github.com/andykillen/timer
 */
var countdown = {
    /**
    * Set's up the countdown timer so that it is displayed on screen
    * @param  id string
    * @param  milliseconds int
    * @param  callback string    
    */
   countdownTimer: function(id, milliseconds, callback){    
    now = new Date()
    , deadline = new Date(now.getFullYear(), 
                          now.getMonth(), 
                          now.getDate(), 
                          now.getHours(), 
                          now.getMinutes(), 
                          now.getSeconds(), 
                          now.getMilliseconds() + (milliseconds + timer.interval + 10 )  ); // add 60 extra milliseconds for first time round
    // show clock first time. 
    countdown.clockCountDown(id, deadline);    
    // do clock countdown start
    timer.cronAdd(1000,
                  function(){countdown.clockCountDown(id, deadline);}, 
                  true, 
                  deadline.getTime());
    // end event timer
    timer.cronAdd(milliseconds, callback);
  },
  /**
   * on screen countdown, needs ID of html element where the display will happen
   * @param deadline string
   * @param id string
   */
  clockCountDown : function(id, deadline){
    if(id !== "undefined"){
      coutdownElement = document.getElementById(id);
      // compaire time now and the dealine time
      timeObj = timer.dateComp(deadline);
      // update the on-screen timer
      coutdownElement.innerHTML = (parseInt(timeObj.hours,10) !== 0 )
                                   ? timeObj.hours +":"+timeObj.minutes 
                                   : timeObj.minutes +":"+timeObj.seconds;    
    }
  }
};
