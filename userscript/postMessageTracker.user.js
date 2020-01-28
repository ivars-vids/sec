// ==UserScript==
// @name         onMessage Tracker
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Userscript which helps you to analyze postMessage process
// @author       Ivars Vids
// @include      *
// @grant        unsafeWindow
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.10.2/beautify.min.js
// ==/UserScript==

(function() {
    'use strict';
    const win = unsafeWindow;
    let _addEventListener;
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

    _addEventListener = win.EventTarget.prototype.addEventListener;

    Object.defineProperty(win.EventTarget.prototype, '_addEventListener', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: _addEventListener
    });

    win.EventTarget.prototype.addEventListener = function(ev, func, cap){
        if (ev === 'message' && this === win){
            console.log(`%caddEventListener(message, ...) //${location.href}`, 'color:green;font-size:20px;');
            let err = new Error('err').stack.split('\n');
            console.log('Called from' + (err.length>=3?err[2].replace(/^ +at/,''):' *** unknown'));
            console.log(func);
            console.log(js_beautify(func.toString()));
        }
        this && '_addEventListener' in this && this._addEventListener(ev, func, cap);
        return win.EventTarget.prototype._addEventListener.call(this, ev, func, cap);
    }

    setInterval(function(){
        //console.log(typeof win.onmessage);
        if (typeof win.onmessage === 'function' && _onmessage !== win.onmessage.toString()){
            _onmessage = win.onmessage.toString();
            console.log(`%cwindow.onmessage //${location.href}`, 'color:green;font-size:20px;');
            let err = new Error('err').stack.split('\n');
            console.log('Called from' + (err.length>=3?err[2].replace(/^ +at/,''):' *** unknown'));
            console.log(win.onmessage);
            console.log( js_beautify(_onmessage));
        }
    }, 1000);
})();
