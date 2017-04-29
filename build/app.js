/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = (FontStorage);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * @module ImageComparison Used to compare images using methods based on perception and pixels comparison.
 * Jimp <https://cdn.rawgit.com/oliver-moran/jimp/v0.2.27/browser/lib/jimp.min.js>
 * @author Vasile Pește <sirvasile@protonmail.ch>
*/

const ImageComparison = (

    function (undefined)
    {
        "use strict";
        
        /**
         * _compare Compare two images using pixel based and perceptual methods.
         * @param {String} first The URL of the first image.
         * @param {String} second The URL of the second image.
         * @param {Number} [threshold = 0.1] Comparison threshold.
         * @param {Boolean} [scaleToSameSize = false] Scale the first and the second image to the same size before comparison?
         * @return {Promise}
        */
        
        const _compare = (first, second, threshold = 0.1, scaleToSameSize = false) => {
            return new Promise((resolve, reject) => {
                let firstResult;
                let secondResult;
                const result = {};
                const finalize = () => {
                    if (!firstResult || !secondResult)
                        return;
                    
                    if (scaleToSameSize) {
                        firstResult.resize(64, Jimp.AUTO);
                        secondResult.resize(64, Jimp.AUTO);
                    }
                    
                    firstResult.greyscale();
                    secondResult.greyscale();
                    
                    result.analytical = 100 - (Jimp.diff(firstResult, secondResult, threshold).percent * 100);
                    result.perceptual = 100 - (Jimp.distance(firstResult, secondResult) * 100);
                    
                    resolve(result);
                };
                
                Jimp.read(first).then((res) => {
                    firstResult = res;
                    finalize();
                }).catch(reject);
                
                Jimp.read(second).then((res) => {
                    secondResult = res;
                    finalize();
                }).catch(reject);
            });
    	};
        
        // Return the public context.
        return (first, second, threshold, scaleToSameSize) => _compare(first, second, threshold, scaleToSameSize);
    }

());

/* harmony default export */ __webpack_exports__["a"] = (ImageComparison);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * @module ImageDrawing Used to create and manipulate images.
 * @author Vasile Pește <sirvasile@protonmail.ch>
*/

const ImageDrawing = class {
    constructor () {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
    }
    
    /**
     * draw Load a image inside the canvas (overriding the current frame).
     * @param {String} url The URL of the image to draw.
     * @param {Number} [scale = 1] Scale factor.
     * @return {Promise}
    */
    
    draw (url, scale = 1)
    {
        return new Promise((resolve, reject) => {
            const image = document.createElement("img");
            
            image.onload = () => {
                let width = image.width * scale;
                let height = image.height * scale;
                
                this.canvas.width = width;
                this.canvas.height = height;
                this.context.drawImage(image, 0, 0, width, height);
                
                resolve();
            };
            image.onerror = image.onabort = reject;
            image.src = url;
        });
    }
    
    /**
     * crop Extract a specific area from the current frame.
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @return {String} The base64 data image/png of the cropped portion.
    */
    
    crop (x, y, width, height)
    {
        const fragment = document.createElement("canvas").getContext("2d");
        const data = this.context.getImageData(x, y, width - x, height - y);
        
        fragment.canvas.width = data.width;
        fragment.canvas.height = data.height;
        fragment.putImageData(data, 0, 0);
        
        return fragment.canvas.toDataURL();
    }
    
    /**
     * grayscale Turn the canvas into grayscale.
    */

    grayscale ()
    {
        const canvas = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = canvas.data;
        
        for (let i = 0, ll = data.length; i < ll; i += 4)
        {
            let luma = data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;
            
            data[i] = data[i + 1] = data[i + 2] = luma;
        }
        
        this.context.putImageData(canvas, 0, 0);
    }
    
    /**
     * binarize Binarize Turn the canvas into black and white.
     * @param {Number} [threshold = 100] Threshold.
    */
    
    binarize (threshold = 100)
    {
        const canvas = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = canvas.data;
        
        for (let i = 0, ll = data.length; i < ll; i += 4)
        {
            let luma = data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;
            
            data[i] = data[i + 1] = data[i + 2] = luma > threshold ? 255 : 0;
        }
        
        this.context.putImageData(canvas, 0, 0);
    }
    
    /**
     * brightness Get the average brightness of the current frame.
     * @return {Number}
    */
    
    brightness ()
    {
        const data = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
        let union = 0;
        
        for (let i = 0, ll = data.length; i < ll; i += 4)
            union += (data[i] + data[i + 1] + data[i + 2]) / 3;
        
        return union / data.length / 3;
    }
    
    /**
     * toDataURL Get the base64 data image/png of the current frame.
     * @return {String}
    */
    
    toDataURL () {
        return this.canvas.toDataURL();
    }
    
    /**
     * base64ToBuffer Serialize a base64 string to ArrayBuffer.
     * @param {String} base64 The base64 string.
     * @return {ArrayBuffer}
    */
    
    static base64ToBuffer (base64)
    {
        const decode = atob(base64);
        const buffer = new ArrayBuffer(decode.length);
        const uint = new Uint8Array(buffer);
        let ll = 0;
        
        for (let ch of decode)
            uint[ll++] = ch.charCodeAt(0);
        
        return buffer;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (ImageDrawing);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * @module OpticalRecognition Used as Optical Character Recognition module.
 * Tesseract <https://cdn.rawgit.com/naptha/tesseract.js/1.0.10/dist/tesseract.js>
 * @author Vasile Pește <sirvasile@protonmail.ch>
*/

const OpticalRecognition = (

    function (undefined)
    {
        "use strict";
        
        // Used as recognition options.
        const _OPTIONS = {
            lang: "eng",
            tessedit_char_whitelist: "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789"
        };
        
        /**
         * _recognize Recognize the text in a image.
         * @param {String} url The URL of the image to recognize.
         * @return {Promise}
        */
        
        const _recognize = (url) => {
            return Tesseract.recognize(url, _OPTIONS);
    	};
        
        // Return the public context.
        return (url) => _recognize(url);
    }

());

/* harmony default export */ __webpack_exports__["a"] = (OpticalRecognition);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_fontstorage__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_imagedrawing__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__modules_opticalrecognition__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_imagecomparison__ = __webpack_require__(1);
/**
 * @module Typefont Used to recognize the font of a text in a image.
 * @author Vasile Pește <sirvasile@protonmail.ch>
*/






const Typefont = (

    function (undefined)
    {
        "use strict";
        
        // Used as recognition global options.
        const _OPTIONS = {
            // The minimum confidence that a symbol must have to be accepted in the comparison queue.
            minSymbolConfidence: 30,
            // Used as pixel based image comparison threshold.
            analyticComparisonThreshold: 0.52161,
            // Scale the images to the same size before comparison?
            sameSizeComparison: true
        };
        
        /**
         * _symbolsToBase64 Get the base64 data image/png of the symbols recognized in a image.
         * @param {ImageDrawing} img The ImageDrawing instance of the recognized image.
         * @param {Object} res The result of the recognition process.
         * @return {Object}
        */
        
        const _symbolsToBase64 = (img, res) => {
            const data = {};
            const symbols = res.symbols;
            
            // This will skip double letters! Note the confidence condition.
            for (let symbol of symbols)
                if (symbol.confidence > _OPTIONS.minSymbolConfidence)
                    data[symbol.text] = img.crop(symbol.bbox.x0, symbol.bbox.y0, symbol.bbox.x1, symbol.bbox.y1).substr(22);
            
            // Note that all "data:image/png;base64," are trimmed with substr(22)!
            return data;
        };
        
        /**
         * _symbolsToDomain Remove the single symbols from two lists of symbols.
         * @param {Object} first The first list of symbols.
         * @param {Object} second The second list of symbols.
        */
        
        const _symbolsToDomain = (first, second) => {
            for (let key in first)
                if (!second[key])
                    delete first[key];
            
            for (let key in second)
                if (!first[key])
                    delete second[key]; 
        };
        
        /**
         * _base64ToDrawing Transform a list of base64 data image/png symbols into ImageDrawing instances (and load them).
         * @param {Object} symbolsBase64
         * @return {Promise}
        */
        
        const _base64ToDrawing = (symbolsBase64) => {
            return new Promise((resolve, reject) => {
                const todo = Object.keys(symbolsBase64).length;
                const finalize = () => {
                    ++done;
                    
                    if (done == todo)
                        resolve(symbolsBase64);
                };
                let done = 0;
                
                for (let key in symbolsBase64)
                {
                    const data = symbolsBase64[key];
                    
                    symbolsBase64[key] = new __WEBPACK_IMPORTED_MODULE_1__modules_imagedrawing__["a" /* default */]();
                    symbolsBase64[key].draw(data).then(finalize).catch(reject);
                } 
            });
        };
        
        /**
         * _prepareImageRecognition Load and recognize the symbols and text in a image.
         * @param {String} url The URL of the image to recognize.
         * @return {Promise}
        */
        
        const _prepareImageRecognition = (url) => {
            return new Promise((resolve, reject) => {
                const image = new __WEBPACK_IMPORTED_MODULE_1__modules_imagedrawing__["a" /* default */]();
                
                image.draw(url).then(() => {
                    const brightness = image.brightness();
                    
                    // Binarize the image if its brightness is in this specific range (better results).
                    if (brightness > 25 && brightness < 125)
                        image.binarize(brightness);
                    
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__modules_opticalrecognition__["a" /* default */])(image.toDataURL()).then((res) => {
                        res.symbolsBase64 = _symbolsToBase64(image, res);
                        res.pivot = image;
                        resolve(res);
                    }).catch(reject);
                }).catch(reject);
            });
        };
        
        /**
         * _prepareFontsIndex Request the index of the fonts.
         * Established the following JSON structure for a fonts index file.
         * {
         *     "index": [
         *         "font-name",
         *         "font-name-1",
         *         "font-name-2",
         *         ...
         *     ]
         * }
         * @param {String} [url = "storage/index.json"] The url of the fonts index JSON file.
         * @return {Promise}
        */
        
        const _prepareFontsIndex = (url = "storage/index.json") => {
            return new Promise((resolve, reject) => {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__modules_fontstorage__["a" /* default */])(url).then((res) => {
                    if (res.content)
                        resolve(res.content);
                    else
                        reject();
                }).catch(reject);
            });
        };
        
        /**
         * _prepareFont Request a font.
         * Established the following JSON structure for a font file.
         * {
         *     "meta": {
         *         "name": "...,
         *         "author": "...",
         *         "uri": "...",
         *         ...
         *     },
         *     "alpha": {
         *         "a": "base64",
         *         "b": "base64",
         *         "c": "base64",
         *         ...
         *     }
         * }
         * @param {String} name The name of the font.
         * @param {String} [url = "storage/fonts/"] The url of the directory containing the fonts.
         * @param {String} [data = "data.json"] The name of the JSON file containing the font data.
         * @return {Promise}
        */
        
        const _prepareFont = (name, url = "storage/fonts/", data = "data.json") => {
            return new Promise((resolve, reject) => {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__modules_fontstorage__["a" /* default */])(`${url}${name}/${data}`).then((res) => {
                    if (res.content)
                        resolve(res.content);
                    else
                        reject();
                }).catch(reject);
            });
        };
        
        /**
         * _prepare Load the font index and the image recognition process by calling _prepareFontsIndex and _prepareImageRecognition.
         * @param {String} url The URL of the image to recognize.
         * @return {Promise}
        */
        
        const _prepare = (url) => {
            return new Promise((resolve, reject) => {
                const todo = 2;
                const result = {};
                const finalize = () => {
                    ++done;
                    
                    if (done == todo)
                        resolve(result);
                };
                let done = 0;
                
                _prepareImageRecognition(url).then((res) => {
                    result.recognition = res;
                    finalize();
                }).catch(reject);
                _prepareFontsIndex().then((res) => {
                    result.fonts = res;
                    finalize();
                }).catch(reject); 
            });
        };
        
        /**
         * _compare Compare two lists of symbols using perceptual and pixel based image comparison.
         * @param {Object} first The first list of symbols.
         * @param {Object} second The second list of symbols.
         * @return {Promise}
        */
        
        const _compare = (first, second) => {
            return new Promise((resolve, reject) => {
                const todo = Object.keys(first).length;
                const result = {};
                const finalize = (symbol, res) => {
                    ++done;
                    
                    result[symbol] = res;
                    
                    if (done == todo)
                        resolve(result);
                };
                const buff = __WEBPACK_IMPORTED_MODULE_1__modules_imagedrawing__["a" /* default */].base64ToBuffer;
                let done = 0;
                
                for (let symbol in first)
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__modules_imagecomparison__["a" /* default */])(buff(first[symbol]), buff(second[symbol]), _OPTIONS.analyticComparisonThreshold, _OPTIONS.sameSizeComparison)
                        .then((res) => finalize(symbol, res))
                        .catch(reject);
            });
        };
        
        /**
         * _average Used to compute the average similarity of a given result of the _recognize process.
         * @param {Object} res
         * @return {Number}
        */
        
        const _average = (res) => {
            let calc = 0;
            let ll = 0;
            
            for (let symbol in res)
            {
                ++ll;
                calc += (res[symbol].perceptual + res[symbol].analytical) / 2;
            }
            
            return calc / ll;
        };
        
        /**
         * _recognizeForStorage Given a screenshot with the a font aplhabet return the single symbols with a format ready to be storaged.
         * @param {String} url The URL of the image.
         * @return {Promise}
        */
        
        const _recognizeForStorage = (url) => {
            return new Promise((resolve, reject) => {
                _prepare(url).then((res) => {
                    resolve({
                        meta: {
                            name: "",
                            author: "",
                            uri: ""
                        },
                        alpha: res.recognition.symbolsBase64
                    });
                }).catch(reject);
            });
        };
        
        /**
         * _recognize Start the process to recognize the font of a text in a image.
         * @param {String} url The URL of the image.
         * @param {Function} progress A function to call when there is a progress (called every time the input text is compared with a font in the database).
         * @return {Promise}
        */
        
        const _recognize = (url, progress) => {
            return new Promise((resolve, reject) => {
                _prepare(url).then((res) => {
                    const fonts = res.fonts.index;
                    const todo = fonts.length;
                    const result = {};
                    const recognition = res.recognition.symbolsBase64;
                    const finalize = (name, val, font) => {
                        ++done;
                        
                        result[name] = {
                            author: font.meta.author,
                            uri: font.meta.uri,
                            similarity: _average(val)  
                        };
                        
                        if (progress)
                            progress(name, val, done, todo);
                        
                        if (done == todo)
                            resolve(result);
                    };
                    let done = 0;
                    
                    for (let name of fonts)
                        _prepareFont(name).then((font) => {
                            _symbolsToDomain(recognition, font.alpha);
                            _compare(recognition, font.alpha).then((fin) => finalize(name, fin, font)).catch(reject);
                        });
                }).catch(reject); 
            });
        };
        
        // Return the public context.
        return (url, progress) => _recognize(url, progress);
    }

());

/* harmony default export */ window.Typefont = __webpack_exports__["default"] = (Typefont);

/***/ })
/******/ ]);