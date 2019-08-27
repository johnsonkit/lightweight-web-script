var LWS = (function() {

    // DOM related
    
    /**
     * Convert an array-like object to an array object
     * @param {object} nodeList Array-like object 
     * @returns {array}
     */
    function toArray(nodeList) {
        return Array.prototype.slice.call(nodeList);
    }

    /**
     * Get the element(s) by using the DOM selector
     * @param {string} selector DOM selector, get elements by ID, Tag, Name, Class or CSS Selector
     * @param {object} baseElement A DOM object, only matching selectors on descendants of the baseElement
     * @returns {array}
     */
    function $$(selector, baseElement) {
        return toArray((baseElement||document).querySelectorAll(selector));
    }

    // Utility

    /**
     * Input an array and output a new shuffle array
     * @param {array} array An array object
     * @returns {array} A new array
     */
    function shuffleArray(array) {
        var newArray = array.slice();
        var arraySize = newArray.length;
        
        for (var i = arraySize - 1; i > 0; i--) {
            var randomIndex = Math.floor(Math.random() * (i+1));
            var randomValue = newArray[randomIndex];
            newArray[randomIndex] = newArray[i];
            newArray[i] = randomValue;
        } 
        return newArray;
    }

  
    /**
     * This function is taken from Underscore.js 
     * https://cdn.rawgit.com/jashkenas/underscore/1.6.0/underscore.js
     * 
     * e.g.
     * Step 1
     * var efficientSayHiFn = debounce(function() { console.count('HI'); }, 100);
     * 
     * Step 2
     * window.addEventListener('scroll', efficientSayHiFn);
     * 
     * @param {function} func
     * @param {number} wait 
     * @param {boolean} immediate 
     * @returns {function}
     */
    function debounce(func, wait, immediate) {

      var timeout, args, context, timestamp, result;

      var later = function() {
        var last = Date.now() - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) {
            result = func.apply(context, args);
            context = args = null;
          }
        }
      };

      return function() {
        context = this;
        args = arguments;
        timestamp = Date.now();
        var callNow = immediate && !timeout;
        if (!timeout) {
          timeout = setTimeout(later, wait);
        }
        if (callNow) {
          result = func.apply(context, args);
          context = args = null;
        }

        return result;
      };
    };


    // UI

    /**
     * Check whether the element is in the window or not
     * @param {object} el A DOM object
     * @returns {boolean}
     */
    function isElementInWindow (el) {
      var bounding = el.getBoundingClientRect();
      return (
          bounding.top >= 0 &&
          bounding.left >= 0 &&
          bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    };

    // Animation

    var easings = {
      linear: function(t) {
        return t;
      },
      easeInQuad: function(t) {
        return t * t;
      },
      easeOutQuad: function(t) {
        return t * (2 - t);
      },
      easeInOutQuad: function(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      },
      easeInCubic: function(t) {
        return t * t * t;
      },
      easeOutCubic: function(t) {
        return (--t) * t * t + 1;
      },
      easeInOutCubic: function(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      },
      easeInQuart: function(t) {
        return t * t * t * t;
      },
      easeOutQuart: function(t) {
        return 1 - (--t) * t * t * t;
      },
      easeInOutQuart: function(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
      },
      easeInQuint: function(t) {
        return t * t * t * t * t;
      },
      easeOutQuint: function(t) {
        return 1 + (--t) * t * t * t * t;
      },
      easeInOutQuint: function(t) {
        return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
      }
    };

    /**
     * Scroll to the element that you want
     * @param {object} destination A DOM object
     * @param {number} duration Animation duration, for requestAnimationFrame and setTimeout only
     * @param {string} easing Animation ease name, for requestAnimationFrame and setTimeout only
     * @param {function} callback The callback function will be executed after the animation finished, for requestAnimationFrame and setTimeout only
     */
    function scrollToElement(destination, duration = 300, easing = 'easeOutQuint', callback) {

        // 1'st choice: using scrollIntoView
        if ('scrollIntoView' in document.body && 'scrollBehavior' in document.body.style) {
            destination.scrollIntoView({behavior: 'smooth'});
        } else {
            
                // 2'nd choice: using requestAnimationFrame
                // 3'rd choice: using setTimeout
                var start = window.pageYOffset;
                var startTime = Date.now();
        
                var documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
                var windowHeight = window.innerHeight || document.documentElement.clientHeight;
                var destinationOffset = destination.offsetTop;
                var destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);
                
                // for setTimeout only
                var fpsThatYouWant = 60; 
                var millisecondToRunAnimationFn = Math.round(1000 / fpsThatYouWant);
        
                // time function
                var timeFn = isSupportRequestAnimationFrame() ? function (animateFn) { requestAnimationFrame(animateFn) } : function (animateFn) { setTimeout(animateFn, millisecondToRunAnimationFn) };
              
                (function scroll() {
                    var now = Date.now();
                    var time = Math.min(1, ((now - startTime) / duration));
                    var timeFunction = easings[easing](time);
                    window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));
                
                    // run the callback function after the animation finished
                    if (window.pageYOffset === destinationOffsetToScroll) {
                        if (callback) {
                            callback();
                        }
                        return;
                    }
                
                    timeFn(scroll);
                    
                }) ();

        }

    }
    
    /**
     * Trigger the class name with animation, it's removed when the animation is finished
     * @param {object} el DOM elements 
     * @param {string} animationClass Class name for animation
     */
    function toggleAnimation(el, animationClass) { 
        el.classList.add(animationClass);
        el.addEventListener('animationend', function() {
            el.classList.remove(animationClass);
        }, false);
    }

    /**
     * Check the support ability of requestAnimationFrame
     * @returns {boolean}
     */
    function isSupportRequestAnimationFrame() {
        return !!(window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame);
    }

    /**
     * Check the support ability of cancelAnimationFrame
     * @returns {boolean}
     */
    function isSupportCancelAnimationFrame() {
        return !!(window.cancelAnimationFrame || window.mozCancelAnimationFrame);
    }

    /**
     * Hide the element
     * @param {object} el A DOM element
     */
    function hide(el) {
        el.style.display = 'none';
    }

    /**
     * Show the element
     * @param {object} el A DOM element
     * @param {string} display CSS display value, e.g. 'inline-block', 'block'
     */
    function show(el, display = 'block') {
        el.style.display = display;
    }

    /**
     * Fade out the element
     * @param {object} el A DOM element
     * @param {number} duration The duration of the animation
     * @param {function} callback The callback function will be executed after fadeout animation finished
     */

    function fadeOut(el, duration = 300, callback) {
        // customized setting
        var fpsThatYouWant = 60;
        var easingFnName = 'easeOutQuint';

        // initial Opacity Value
        var initOpacityValue = 1;

        // get the element's style
        var elStyle = el.style;

        var startTime = Date.now();
        var millisecondToRunAnimationFn = Math.round(1000 / fpsThatYouWant);
        var timeFn = isSupportRequestAnimationFrame() ? function (animateFn) { requestAnimationFrame(animateFn) } : function (animateFn) { setTimeout(animateFn, millisecondToRunAnimationFn) };
        elStyle.opacity = elStyle.opacity || initOpacityValue;

        (function fade() { 
            // get current time            
            var now = Date.now();
            // 0 <= progress value <= 1
            var progress = Math.min(1, ((now - startTime) / duration));
            // run the pre-defined easing function to get the delta value
            var delta = easings[easingFnName](progress);
            // each frame
            elStyle.opacity = initOpacityValue - delta;
            
            // OpacityValue is from 1 to 0
            if (elStyle.opacity <= 0) {
              elStyle.display = 'none';
              // Run the callback function after the animation if there's a callback function as an input parameter
              if (callback && typeof callback === "function") {
                callback();
              }
            } else {
              // run the fade function
              timeFn(fade);
            }

        }) ();  
    }

    
    /**
     * Fade in the elements
     * @param {object} el A DOM element
     * @param {number} duration The duration of the animation
     * @param {string} display CSS display value, e.g. 'inline-block', 'block'
     * @param {function} callback The callback function will be executed after fadeIn animation finished
     */
    function fadeIn(el, duration = 300, display = 'block', callback) {
      // customized setting
      var fpsThatYouWant = 60;
      var easingFnName = 'easeOutQuint';

      // initial Opacity Value
      var initOpacityValue = 0;

      // get the element's style
      var elStyle = el.style;

      var startTime = Date.now();
      var millisecondToRunAnimationFn = Math.round(1000 / fpsThatYouWant);
      var timeFn = isSupportRequestAnimationFrame() ? function (animateFn) { requestAnimationFrame(animateFn) } : function (animateFn) { setTimeout(animateFn, millisecondToRunAnimationFn) };
      elStyle.opacity = elStyle.opacity || initOpacityValue;
      elStyle.display = display;

      (function fade() { 
          // get current time            
          var now = Date.now();
          // 0 <= progress value <= 1
          var progress = Math.min(1, ((now - startTime) / duration));
          // run the pre-defined easing function to get the delta value
          var delta = easings[easingFnName](progress);
          // each frame
          elStyle.opacity = initOpacityValue + delta;
          
          // OpacityValue is from 0 to 1
          if (elStyle.opacity >= 1) {
            // Run the callback function after the animation if there's a callback function as an input parameter
            if (callback && typeof callback === "function") {
              callback();
            }
          } else {
            // run the fade function
            timeFn(fade);
          }

      }) ();  
    }


    // URL

    /**
     * Get the URL query string
     * e.g. 
     * The url query string is like `?name=winnie&more=likeHoney=yes;likePiglet=yes`
     * getUrlQueryString() will return an object of `{name: "winnie", more: "likeHoney=yes;likePiglet=yes"}`
     * getUrlQueryString()['name'] will return `winnie`
     * @returns {object}
     */
    function getUrlQueryString() {
        var o = {};
        window.location.href.replace(/[?&]{1,}([^=&]{1,})=([^&]{0,})/gi, function(match, key, value) { 
            o[key] = value;
        });
        return o;
    }

    /**
     * Public the functions
     */
    return {
        toArray: toArray,
        $$: $$,
        shuffleArray: shuffleArray,
        debounce: debounce,
        isElementInWindow: isElementInWindow,
        toggleAnimation: toggleAnimation,
        isSupportRequestAnimationFrame: isSupportRequestAnimationFrame,
        show: show,
        hide: hide,
        fadeIn: fadeIn,
        fadeOut: fadeOut,
        scrollToElement: scrollToElement,
        getUrlQueryString: getUrlQueryString
    }

}) ();
