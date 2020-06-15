// ==UserScript==
// @name         onMessage Tracker
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Userscript which helps you to analyze postMessage process
// @author       Ivars Vids
// @include      *
// @grant        unsafeWindow
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.10.2/beautify.min.js
// ==/UserScript==

(function() {
    'use strict';
    let win;
    if ('unsafeWindow' in window){
        win = window.unsafeWindow;
    }
    else {
        win = window;
        document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.10.2/beautify.min.js"><\/script>')
    }

    // fix native function on bind
    win.Function.prototype._bind = win.Function.prototype.bind;

    let _bind = win.Function.prototype.bind;
    Object.defineProperty(win.Function.prototype, '_bind', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: _bind
    });

    win.Function.prototype.bind = function(...args){
        let self = this;
        let result = this._bind(...args);
        result.toString = Function.prototype.toString._bind(self);
        return result;
    }

    let _onmessage = '';
    win.addEventListener('message', function(ev){
        const target = ev.target && ev.target.location && ev.target.location.href;
        let source;
        try{
            source = ev.source && ev.source.location && ev.source.location.href;
        } catch(e){
            source = ev.origin;
        }
        console.log(`%cpostMessage(message, "?") //${source} =>  ${target}` ,'color:blue;font-size:20px;');
        console.log(typeof ev.data === 'string'?`\`${ev.data}\``:ev.data);
    }, true)

    let _addEventListener = win.EventTarget.prototype.addEventListener;
    Object.defineProperty(win.EventTarget.prototype, '_addEventListener', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: _addEventListener
    });

    win.EventTarget.prototype.addEventListener = function(ev, func, cap){
        if (ev === 'message' && this === win){
            console.log(`%caddEventListener(message, ...) //${location.href}`, 'color:green;font-size:20px;');
            getStack();
            console.log(func);
            console.log(js_beautify(func.toString()));
        }
        if (this && '_addEventListener' in this){
            return this._addEventListener(ev, func, cap);
        }
        return win.EventTarget.prototype._addEventListener.call(this, ev, func, cap);
    }

    setInterval(function(){
        if (typeof win.onmessage === 'function' && _onmessage !== win.onmessage.toString()){
            _onmessage = win.onmessage.toString();
            console.log(`%cwindow.onmessage //${location.href}`, 'color:green;font-size:20px;');
            getStack();
            console.log(win.onmessage);
            console.log(js_beautify(_onmessage));
        }
    }, 1000);

    function getStack(){
        let err = new Error('err').stack.split('\n');
        console.log('Called from' + (err.length>=4?err[3].replace(/^ +at/,''):' *** unknown'));
    }
})();
