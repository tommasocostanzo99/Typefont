# Typefont
Here I’m working on this algorithm that tries to recognize the font of a text in a photo.
Why? I had just discovered the version of [Tesseract](http://tesseract.projectnaptha.com/) written in JavaScript and I noticed that he was also trying to identify the font, I wondered how I could improve this process. That’s how the idea came about.
My goal is also that the image must be the only input avoiding other manual processes by the user.

## Usage
Just call this function.
```javascript
import Typefont from "app";

Typefont("path/image.png")
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
```
The first argument can be: a string with the path to the image, a string with the base64 data of the image, the instance of a canvas, the instance of a image.

To build the project.
```shell
webpack src/app.js build/app.js
```

Here I used it with my favorite Italian apple juice and other objects in my house.

![](http://i.imgur.com/SiMymFN.jpg)

Text on the cover of a book.

![](http://i.imgur.com/UOvT7xH.jpg)

In the result I included a similarity percentage and a piece of information about each font.

## How it works?
The input image is passed to the OCR algorithm after some filters based on its brightness. Then the symbols (letters) are extracted from the input image and compared with the symbols of the fonts in the database using a perceptual (Hamming distance) comparison and a pixel based comparison.

The symbols of fonts are just a JSON structure with the alphabet of a font and the base64 string of the image of each letter. For example.
```javascript
{
    "meta": {
        "name": "font-name"
    },
    "alpha": {
        "a": "base64",
        "b": "base64",
        "c": "base64",
        ...
    }
}
```