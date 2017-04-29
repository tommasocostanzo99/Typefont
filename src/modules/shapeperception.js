/**
 * @module ShapePerception Used to compare images using a method that considers human perception.
 * @author Vasile Pește <sirvasile@protonmail.ch>
*/

import ImageDrawing from "./imagedrawing";

const ShapePerception = (

    function (undefined)
    {
        "use strict";
        
        /**
         * _prepareImages Load and binarize two images as ImageDrawing instances.
         * @param {String} first The URL of the first image.
         * @param {String} second The URL of the second image.
         * @return {Promise}
        */
        
        const _prepareImages = (first, second) => {
            return new Promise((resolve, reject) => {
                const todo = 2;
                const img = new ImageDrawing();
                const img1 = new ImageDrawing();
                const finalize = () => {
                    ++done;
                    
                    if (done == todo)
                        resolve([img, img1]);  
                };
                let done = 0;
                
                img.draw(first).then(() => {
                    img.binarize(img.brightness());
                    finalize();
                }).catch(reject);
                img1.draw(second).then(() => {
                    img1.binarize(img1.brightness());
                    finalize();
                }).catch(reject); 
            });
        };
        
        /**
         * _getBinarizedPixelsMatrix Put the pixels of a binarized ImageDrawing instance in a matrix.
         * @param {ImageDrawing} img
         * @return {Array}
        */
        
        const _getBinarizedPixelsMatrix = (img) => {
            let width = img.canvas.width;
            let height = img.canvas.height;
            const data = img.context.getImageData(0, 0, width, height).data;
            const matrix = [];
            let w = 0;
            let j = 0;
            
            for (let i = 0, ll = data.length; i < ll; i += 4)
            {
                if (w == width)
                {
                    w = 0;
                    ++j;
                }
                
                if (w == 0)
                    matrix.push([]);
                
                matrix[j].push(data[i]);
                ++w;
            }
            
            return matrix;
        };
        
        /**
         * _compare Compare two images using a method based on human perception.
         * @param {String} first The URL of the first image.
         * @param {String} second The URL of the second image.
         * @param {Number} [threshold = 0.1] Comparison threshold.
         * @return {Promise}
        */
        
        const _compare = (first, second, threshold = 0.1) => {
            _prepareImages(first, second).then((res) => {
                console.log(res);
            });
    	};
        
        // Return the public context.
        return (first, second, threshold) => _compare(first, second, threshold);
    }

());

export default ShapePerception;