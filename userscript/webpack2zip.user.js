// ==UserScript==
// @name         Export webpack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      *
// @grant        unsafeWindow
// @grant		 GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.2/jszip.min.js
// @connect      *
// ==/UserScript==

(function() {
    'use strict';

    /// GM_xmlhttpRequest to fetch
    var fetch = function(url){
        return new Promise(function(done,error){
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(req) {
                    req.text = function(){
                        return new Promise(function(done,error){
                            done(req.responseText);
                        })
                    }
                    req.json = function(){
                        return new Promise(function(done,error){
                            try{
                                done(JSON.parse(req.responseText));
                            }catch(e){
                                error(e);
                            }
                        })
                    }
                    done(req);
                }
            });
        });
    }


    function ScriptToZip(){
        console.log('*** Listing SCRIPT Tags');
        var zip = new JSZip();
        var zipPrepare = [];
        Array.from(document.getElementsByTagName('SCRIPT')).map(function(e){return e.src || ''}).filter(function(e){return !!e}).forEach(function(scriptUrl){
            zipPrepare.push( new Promise(function(done, error){
                if (scriptUrl){
                    fetch(scriptUrl).then(function(resp){return resp.text()}).then(function(source){
                        //# sourceMappingURL=runtime.5c1636b5.bundle.js.map
                        var mapFile = /^\/\/# sourceMappingURL=(.*)$/m.exec(source)
                        if (mapFile){
                            var mapUrl = (new URL(mapFile[1], scriptUrl)).href
                            fetch(mapUrl).then(function(resp){return resp.json()}).then(function(source){
                                for (var x = 0; x < source.sources.length; x++){
                                    var filename = source.sources[x].replace(/^webpack:[.\/]*/g, '').replace(/[\\*?<>:]/g,'_').replace(/\/\.+\//g,'');
                                    zip.file(filename, source.sourcesContent[x]);
                                }
                                console.log('*** ZIP - ' + mapUrl);
                                // zip file filled
                                done();

                            }).catch(function(){done();});
                        }
                        else {
                            done(); // no map file
                        }
                    })
                }
                else {
                    done(); // inline script
                }
            }))
        });
        Promise.all(zipPrepare).finally(function(){
            console.log('*** Making ZIP File');
            zip.generateAsync({type:'base64'}).then(function(content) {
                //console.log(content)
                GM_download('data:application/zip;base64,' + content, location.hostname + '.zip')
            });
        })
    }


    GM_registerMenuCommand( '[Export webpack]', function(){
        if ('webpackJsonp' in unsafeWindow){
            let LoadJS = [];
            unsafeWindow.webpackJsonp.push(
                [[2147483647],{
                    '2147483647':function(module, exports, __webpack_require__){
                        console.log('*** Adding webpack modules');
                        var appendChildOld = document.head.appendChild;
                        document.head.appendChild = function(e){
                            if (e.tagName === 'SCRIPT' && e.src.endsWith('undefined.js')){
                                var chunkId = /\/([0-9]+)[\.-]undefined\.js/.exec(e.src);
                                e.src = '';
                                e.removeAttribute('src');
                                chunkId && e.appendChild(document.createTextNode(`webpackJsonp.push([[${chunkId[1]}],{}])`))
                            }
                            return appendChildOld.call(this, e);
                        }
                        for (var chunkId = 0; chunkId < 2048 ; chunkId ++){
                            LoadJS.push(__webpack_require__.e(chunkId));
                        }
                        document.head.appendChild = appendChildOld;
                        console.log('*** Waiting for new JS files');
                        Promise.all(LoadJS).finally(ScriptToZip);
                    }
                 },[[2147483647]]]
            )
        }
        else{
            ScriptToZip();
        }
    });
})();
