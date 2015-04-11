/**
 **
 * Timer.JS
 * 
 * A self contained cron and runner of callback functions
 * 
 * 
 * 
 */

var timer = {
  /**
   * The object were all cron jobs are stored
   * @type object
   */
  cron : {},
  /**
   * Where the setTimeout is saved, defaults to false, so that the timeout is not running unless there is a thing to run
   * @type Boolean or time 
   */
  t : false,
  /**
   * Number in milliseconds for the run frequency of the cron, best to keep 
   * @type Number
   */
  interval : 50,
  /**
   * Pad numbers so that there is leading zero's.  used for turning 5 into 05 for a nicer clock
   * @param {type} num
   * @param {type} size
   * @returns {timer.pad.s|String}
   */
  pad : function(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  },
  /**
   * Checks if a thing (object callback) is a function or a string, if a string it is split up and remade as a function
   * @param {type} functionToCheck
   * @returns {Boolean}
   */
  isFunction: function(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
  },
  /**
   * compairs wanted end time and current time, returning an object with is used in the coundown timer
   * @param dest date
   * @returns time object
   */
  dateComp : function (dest){
    // get the difference in milliseconds between times
    ms = Math.abs(dest - new Date());    
    // convert into an object of time and return
    return timer.millisecondsConvToTime(ms);
   },
   /**
    * convert to hours minutes and seconds.
    * @param ms int
    * @returns time object
    */
   millisecondsConvToTime : function (ms){
    hours = Math.floor(ms / 3600000), // 1 Hour = 36000 Milliseconds
    minutes = Math.floor((ms % 3600000) / 60000), // 1 Minutes = 60000 Milliseconds
    seconds = Math.floor(((ms % 360000) % 60000) / 1000); // 1 Second = 1000 Milliseconds
        return {
        hours : hours,
        minutes : minutes,
        seconds : timer.pad(seconds, 2),
        clock : hours + ":" + minutes + ":" + seconds
    };
   },
  /**
   * Change the interval of the timer so that it can load more often than every second. 
   * (not recommended to go below 28ms as not all browsers can do it, not a massive
   * problem if they can't it will just run it the next time)
   * 
   * @param milliseconds int
   */
  cronSetInterval : function (milliseconds){
    timer.interval = milliseconds;
  },
  /**
   * Check if there is any objects in the cron object that have a time that is in 
   * the past, and ask to run them.
   */
  cronCheck : function (){
      currentCronSize = timer.cronSize();            
      // check if cron is greater than 0      
      if (currentCronSize  > 0){        
        now = new Date( ) ;
        timeNow = now.getTime();      
        // get the keys for cron which is the time in milliseconds (epoch style)
        for (var key in timer.cron) {
          // check if time now is greater than the cron job time
          if(parseInt(key,10) <= timeNow){            
            // if it is run the cronJob set            
            timer.runCron(key);
          }
        }                
      }
      if(timer.t === false){
        timer.t = setInterval(function(){timer.cronCheck();}, timer.interval );
      }
          
  },
  /**
   * Run the cron job that is dated in the past, with optional setup of new 
   * repeated cron jobs
   * 
   * @param key int
   */
  runCron : function(key){      
      // get size of set of cron jobs for this time 
      sizeOfSet = timer.cron[key].length;
      // make sure it is not empty
      if(sizeOfSet > 0 ){
        //loop available cron items
        for(i=0;i < sizeOfSet; i++){
          // check if anonymous function or not.
          if(timer.isFunction(timer.cron[key][i].fn)){
             timer.cron[key][i].fn();
          }else{
            window[timer.cron[key][i].fn]();
          }
          // if needed re-create a new cron item
          if(timer.cron[key][i].repeater === true 
             && (timer.cron[key][i].enddate === false 
                 || timer.cron[key][i].enddate > key 
                )
             ){                  
             timer.cronAdd(timer.cron[key][i].interval, 
                           timer.cron[key][i].fn, 
                           timer.cron[key][i].repeater, 
                           timer.cron[key][i].enddate
                           );
          }
        }
      }
      // delete all items in this cron key set
      delete timer.cron[key];    
  },
  /** 
   * cronAdd, adds a single cron element with the oppertunity to "repeat" it endlessly
   * or "until" a defined number of seconds has passed.
   * @param seconds int (how long to wait till it runs)
   * @param callback string
   * @param repeat bool (repeat yes or no)
   * @param until int (seconds to run for)
   */
  cronAdd :  function (milliseconds, callback, repeat, until){      
      if(typeof repeat === "undefined"){
        repeat = false;
      }
      now = new Date() ;      
      datestamp = now.getTime() + milliseconds;
      if(typeof until === "undefined"){
        endstamp = false;
      }else{
        endstamp = until;
      }
      // check if a timer event at that milliscond already exists
      if(timer.cron.hasOwnProperty(datestamp) === false){
        // add new cron time if needed
        timer.cron[datestamp] = [];
      }            
      // add new cron item
      timer.cron[datestamp].push ( {fn:callback, 
                              repeater: repeat, 
                              interval:milliseconds,
                              enddate:endstamp
                             }); 
      timer.startCron();
  },
  /**
   * Stop and remove all cron jobs 
   * 
   */
  cronStopAll : function (){
    timer.cron = {};
    timer.t = false;
  },
  /**
   * Remove all cron jobs with a defined callback. 
   * 
   * Does not work with anonyoums functions
   * 
   * @param callback function name   
   */
  cronRemoveByCallback : function(callback){
      for (var key in timer.cron){
        if(timer.cron[key].fn === callback){
          delete timer.cron[key];
        }
      } 
  },
  /**
   * Hourly cron jobs
   * 
   * @param minutes int
   * @param callback string   
   */
  cronAddHourly: function(minutes, callback){
    now = new Date();
    minutesPastTheHour = now.getMinutes();
    if(minutes > parseInt(minutesPastTheHour, 10)){
      datestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), minutes);       
    }else{
      datestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, minutes);       
    }
    if(timer.cron.hasOwnProperty(datestamp.getTime()) === false){
        // add new cron time if needed
        timer.cron[datestamp.getTime()] = [];
    }    
    timer.cron[datestamp.getTime()].push( 
           {fn:callback, 
            repeater: true, 
            interval: (1000*60*60), // 1 hour = one second * 60 seconds * 60 minutes
            enddate: false
            });        
    timer.startCron();   
  },
  /**
   * Daily cron jobs
   * 
   * 
   * @param hours int
   * @param minutes int
   * @param callback string   
   */
  cronAddDaily: function(hours, minutes, callback){
    now = new Date();
    hourOfTheDay = now.getHours();
    minutesPastTheHour = now.getMinutes();
    theDate = (hours >= parseInt(hourOfTheDay, 10) &&
               minutes > parseInt(minutesPastTheHour, 10) 
              )? now.getDate() : now.getDate()+1;         
    datestamp = new Date(now.getFullYear(), now.getMonth(), theDate , hours, minutes);       
    if(timer.cron.hasOwnProperty(datestamp.getTime()) === false){
        // add new cron time if needed
        timer.cron[datestamp.getTime()] = [];
    }    
    timer.cron[datestamp.getTime()].push( 
           {fn:callback, 
            repeater: true, 
            interval: (1000*60*60*24), // 1 hour = one second * 60 seconds * 60 minutes * 24 hours
            enddate: false
            });        
    timer.startCron();   
  },
  /**
   * 
   * @returns {Number}
   */
  startCron: function(){
    if(timer.t === false){
      timer.cronCheck();
    } 
  },
  /**
   * Get the size of the cron object so that we know if it is empty or not
   * @returns int
   */
  cronSize : function() {
    var size = 0, key;
    for (key in timer.cron) {
        if (timer.cron.hasOwnProperty(key)) size++;
    }
    return size;
  }
} ;