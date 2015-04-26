/**
 * Stopwatch object. Instantiate like this: var stopwatch = new Stopwatch(document.getElementById('timeDisplay'));
 * 
 * @param _updateEl  A DOM object to be updated on each screen paint when the stopwatch is running.
 * 
 * @author Kip Robinson  https://github.com/kiprobinson
 */
Stopwatch = function(_updateEl) {
  this.updateEl = _updateEl;
  this.elapsedTime = 0;
  this.startTime = 0;
  this.timerPaused = true;
  
  this.draw();
};

/**
 * Draws the current time, if an update element was passed during constructor. Usually you shouldn't need to call this directly.
 * 
 * @return this
 */
Stopwatch.prototype.draw = function() {
  if(this.updateEl) {
    this.updateEl.textContent = this.getTime(true);
    if(!this.timerPaused) {
      var self = this;
      requestAnimationFrame(function() { self.draw() });
    }
  }
  
  return this;
};

/**
 * Returns current elapsed time.
 * 
 * @param makePretty  If true, will return a string formatted in 00:00:00.000 format. Otherwise, returns milliseconds. Default: false 
 */
Stopwatch.prototype.getTime = function(makePretty) {
  var ret = this.elapsedTime;
  if(!this.timerPaused)
    ret += (new Date().getTime() - this.startTime);
  
  if(!makePretty)
    return ret;
  
  //if we get here, we want output formatted as hh:mm:ss.mmm
  var ms = ret % 1000;
  ret = Math.floor(ret / 1000);
  var sec = ret % 60;
  ret = Math.floor(ret / 60);
  var min = ret % 60;
  var hr = Math.floor(ret / 60);
  
  return this.padNum(hr, 2) + ':' + this.padNum(min, 2) + ':' + this.padNum(sec, 2) + '.' + this.padNum(ms, 3);
};

/**
 * Pauses the timer. Does nothing if it is already paused.
 * 
 * @return this
 */
Stopwatch.prototype.pause = function() {
  if(!this.timerPaused) {
    this.timerPaused = true;
    this.elapsedTime += (new Date().getTime() - this.startTime);
  }
  
  return this.draw();
};

/**
 * Starts the timer. Does nothing if it is already running.
 * 
 * @return this
 */
Stopwatch.prototype.start = function() {
  if(this.timerPaused) {
    this.timerPaused = false;
    this.startTime = new Date().getTime();
  }
  
  return this.draw();
};

/**
 * Resets this timer back to 00:00:00.000. Timer will be paused after reset,
 * even if it was running prior to reset.
 * 
 * @return this
 */
Stopwatch.prototype.reset = function() {
  this.elapsedTime = 0;
  this.startTime = 0;
  this.timerPaused = true;
  
  return this.draw();
}

/**
 * Resets this timer to 00:00:00.000, then starts it. Similar to reset(), except
 * the timer will be running afterward.
 * 
 * @return this
 */
Stopwatch.prototype.restart = function() {
  return this.reset().start();
}

/**
 * Toggles status of stopwatch - starts it if it is paused, pauses if it is running.
 * 
 * @return this
 */
Stopwatch.prototype.toggle = function() {
  return this.timerPaused ? this.start() : this.pause();
}

/**
 * Pads a number with leading zeroes, up to the specified length. Helper function.
 */
Stopwatch.prototype.padNum = function(val, len) {
  if('string' != typeof val)
    val = String(val);
  
  while(val.length < len)
    val = '0' + val;
  
  return val;
};
