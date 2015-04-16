# timer JS

A single timeout driven cron task runner, that will execute named of anonymous 
functions when the time is right. 

Either read the Blurb below first of jump down to the [syntax / usage](#syntaxUsage)

## What's it all about?

The idea is simple.  Browsers perform better when there is only one timer running
on a page, rather than many.  It just gives it less to think about, and thus less 
processing to do. 

So all of the cron jobs get set into an object and are run as soon as the milliseconds
now is greater than the job's milliseconds value. (Yes all milliseconds are in EPOCH,
 number of milliseconds since 1-1-1970 - othewise know as UNIX time).

## What about things that happen on the same millisecond?

The system has no problem with running tasks that are due on the same millisecond. 
They are just run in order of when they were added to the cron. 

## What sort of events can I run?

- Repeated events that run every X milliseconds, every X minutes past the hour, or daily
- Repeated event that runs every X milliseconds until a time has been met then will no longer run
- One off events that run one time only

## What sort of functions can I run?

Anonymous functions like this:

`function(){//do something in here}`

Or named functions like this:

`myLoveyFunction()`

## Things to understand.

### 1 variable
It is only 1 variable called `timer` that is used throughout the whole setup.  This is 
so that everything is kept in the same object and uses the same cron runner

### Dormant when not in use
The system will not perform any kind of processing until there is actually something 
in the cron.  When there is nothing, it will be dormant. Thus no processing power used.

### Structure of the Timer object
````
timer - interval ( int var that can be set to define how often it loops the cron )
      - cron ( object that holds all the events by millisecond keys )
          [ MILLISECOND VALUE ]
            array 
            { 
              [interval,functionToRun, repeat, until]
              [interval,function(){// anon function;}, repeat , until]
            }
          [ 1429166243679 ]
            array 
            { 
              [1000, functionToRunInOneSecond, false, false]
              [5000, function(){//every 5s till 2020-12-31}, true, 1609455600000]
            }
      - t ( true or false if anything is in the cron or not)
````

# <a name="syntaxUsage"></a> Syntax and Usage