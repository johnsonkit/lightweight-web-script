var LWS = (function() {

    /**
     * DOM manipulation
     */

    // Array-liked list to real array
    var toArray = function (list) {
        return Array.prototype.slice.call(list); 
    }

    // DOM selecor
    var $$ = function (selector, parentDOM) {
        return toArray((parentDOM||document).querySelectorAll(selector));
    }

    // Add/remove/toggle class(es)
    var addClass = function (el, ...className) {
        el.classList.add(...className);
    }
    var removeClass = function (el, ...className) {
        el.classList.remove(...className);
    }
    var toggleClass = function (el, ...className) {
        el.classList.toggle(...className);
    }

    /**
     * URL
     */

    // Get URL Query String
    function getUrlQueryString() {
        var o = {};
        window.location.href.replace(/[?&]{1,}([^=&]{1,})=([^&]{0,})/gi, function(match, key, value) { 
          o[key] = value;
        });
        return o;
    }    



        
    

    /**
     * Public function
     */
    return {
        $$: $$,
        addClass: addClass,
        removeClass: removeClass,
        toggleClass: toggleClass,
        getUrlQueryString: getUrlQueryString
    }

}) ();
