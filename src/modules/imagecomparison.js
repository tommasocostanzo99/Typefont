/**
 * @module ImageComparison Used to compare images using methods based on perception and pixels comparison.
 * @dependence Jimp <https://cdn.rawgit.com/oliver-moran/jimp/v0.2.27/browser/lib/jimp.min.js>
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

export default ImageComparison;