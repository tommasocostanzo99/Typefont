/**
 * @module OpticalRecognition Used as Optical Character Recognition module.
 * @dependence Tesseract <https://cdn.rawgit.com/naptha/tesseract.js/1.0.10/dist/tesseract.js>
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

export default OpticalRecognition;