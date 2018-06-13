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
     * Public function
     */
    return {
        $$: $$,
        addClass: addClass,
        removeClass: removeClass,
        toggleClass: toggleClass
    }

}) ();
