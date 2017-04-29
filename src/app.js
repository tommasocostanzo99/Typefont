/**
 * @module Typefont Used to recognize the font of a text in a image.
 * @author Vasile Pește <sirvasile@protonmail.ch>
*/

import FontStorage from "./modules/fontstorage";
import ImageDrawing from "./modules/imagedrawing";
import OpticalRecognition from "./modules/opticalrecognition";
import ImageComparison from "./modules/imagecomparison";

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
                    
                    symbolsBase64[key] = new ImageDrawing();
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
                const image = new ImageDrawing();
                
                image.draw(url).then(() => {
                    const brightness = image.brightness();
                    
                    // Binarize the image if its brightness is in this specific range (better results).
                    if (brightness > 25 && brightness < 125)
                        image.binarize(brightness);
                    
                    OpticalRecognition(image.toDataURL()).then((res) => {
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
                FontStorage(url).then((res) => {
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
                FontStorage(`${url}${name}/${data}`).then((res) => {
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
                const buff = ImageDrawing.base64ToBuffer;
                let done = 0;
                
                for (let symbol in first)
                    ImageComparison(buff(first[symbol]), buff(second[symbol]), _OPTIONS.analyticComparisonThreshold, _OPTIONS.sameSizeComparison)
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

export default Typefont;