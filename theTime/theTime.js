/**
 * Creates a digital 24 clock with flashing second ticker
 * 
 * usage 
 * 
 *  theTime.setupClock(id, htmlHolder);
 * 
 *  i.e.
 *  theTime.setupClock('clock', 'h1');
 *  
 *  needs timer.js to work  see https://github.com/andykillen/timer
 */

var theTime = {
  /**
   * makes the clock change time as needed 
   * @param string id   
   */
  clockTick : function (id, holder){
    now = new Date();        
    divider = (now.getSeconds()%2)? ":" : "&nbsp;";
    //divider = ":" ;
    document.getElementById(id).innerHTML = "<"+holder+">" 
                                            + timer.pad(now.getHours(),2)
                                            +"<span>"
                                            +divider
                                            +"</span>"
                                            + timer.pad( now.getMinutes(),2) 
                                            +"</"+holder+">" ;
  },
  
  setupClock : function(id, holder){
    timer.cronAdd(1000,function(){theTime.clockTick(id, holder);},true);
  }
};
