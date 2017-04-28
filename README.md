# Typefont
Here I’m working on this algorithm that tries to recognize the font of a text in a photo. My goal is to obtain accurate results with the image as only input avoiding other manual processes.

## Why
I had just discovered the version of [Tesseract](http://tesseract.projectnaptha.com/) written in JavaScript and I noticed that he was also trying to identify the font, I wondered how to improve this process then I used Tesseract to
extract the letters from the input image, I created a new system that uses the [Jimp](https://github.com/oliver-moran/jimp) image processing library to compare the extracted letters with the fonts stored in a dedicated library.

## Usage
Import the compiled module then call the main function like in the following script.
The first argument can be: a string with the path of the image, a string with the base64 data of the image, the instance of a canvas or the instance of a image.
```javascript
import Typefont from "app";

Typefont("path/image.png")
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
```

You can build the project by using webpack.
```shell
webpack src/app.js build/app.js
```

## Preview
Here I used it with my favorite apple juice and other objects in my house (texts are in italian because I live in Italy).
![](http://i.imgur.com/SiMymFN.jpg)

Text on the cover of a book.
![](http://i.imgur.com/UOvT7xH.jpg)

In the result I included a similarity percentage and a piece of information about each font.

## How it works?
The input image is passed to the optical character recognition after some filters based on its brightness. Then the symbols (letters) are extracted from the input image and compared with the symbols of the fonts in the database using a perceptual (Hamming distance) comparison and a pixel based comparison in order to obtain a percentage of similarity.

The symbols of fonts are just a JSON structure with letters as keys and the base64 of the image of the letter as value.
If you want to add a new font you must follow this structure.
```javascript
{
    "meta": {
        "name": "font-name",
        "author": "font-author",
        "uri": "font-uri"
    },
    "alpha": {
        "a": "base64",
        "b": "base64",
        "c": "base64",
        ...
    }
}
```
Each key of the meta object is included in the final result.

## Todo
I'm trying to create a comparison method dedicated to this project that considers human perception to get more accurate results. I'm completely new to this technology so maybe my approach is completely wrong but it seems to work and I'm learning new things with much fun.
You are free to collaborate, you can contact me, we can discuss about ideas.