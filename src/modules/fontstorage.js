/**
 * @module FontStorage Used to fetch fonts from the database.
 * @author Vasile Pește <sirvasile@protonmail.ch>
*/

const FontStorage = (

    function (undefined)
    {
        "use strict";
        
        /**
         * _fetch Retrieve font data from a JSON structure stored in a file.
         * @param {String} url The URL of the file to fetch.
         * @return {Promise}
        */
        
        const _fetch = (url) => {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                const result = {};
                
                xhr.open("GET", url);
                xhr.timeout = 2000;
                xhr.onload = (e) => {
                    result.exists = e.target.status != 404;
                    
                    if (result.exists)
                        result.content = JSON.parse(e.target.responseText);
                    
                    resolve(result);
                };
                xhr.onerror = xhr.onabort = reject;
                xhr.send();
            });
        };
        
        // Return the public context.
        return (url) => _fetch(url);
    }

());

export default FontStorage;