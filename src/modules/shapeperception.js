/**
 * @module ShapePerception Used to compare images using a method that considers human perception.
 * @dependence ImageDrawing
 * @author Vasile Pește <sirvasile@protonmail.ch>
*/

import ImageDrawing from "./imagedrawing";

const ShapePerception = (

    function (undefined)
    {
        "use strict";
        
        /**
         * _compare Compare two images using a method based on human perception.
         * @param {String} first The URL of the first image.
         * @param {String} second The URL of the second image.
         * @param {Number} [threshold = 0.1] Comparison threshold.
         * @return {Promise}
        */
        
        const _compare = (first, second, threshold = 0.1) => {
            return new Promise((resolve, reject) => {
                // Work in progress.
            });
    	};
        
        // Return the public context.
        return (first, second, threshold) => _compare(first, second, threshold);
    }

());

export default ShapePerception;