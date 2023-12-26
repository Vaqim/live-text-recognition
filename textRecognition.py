import cv2

from deskew import determine_skew

from skimage.color import rgb2gray
from skimage.transform import rotate
from pytesseract import pytesseract
import numpy as np
from PIL import Image
from io import BytesIO
from base64 import b64decode


def preprocess_image(image):
    try:
        # Resize the image (optional, adjust the dimensions as needed)
        # This step can help reduce OCR processing time
        resized_image = cv2.resize(
            image, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC
        )

        # Convert the image to grayscale
        gray_image = cv2.cvtColor(resized_image, cv2.COLOR_BGR2GRAY)

        # Apply thresholding to make text stand out from the background
        _, thresholded_image = cv2.threshold(
            gray_image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU
        )

        # Perform noise reduction and smoothing (optional, adjust parameters)
        denoised_image = cv2.fastNlMeansDenoising(
            thresholded_image, h=10, templateWindowSize=7, searchWindowSize=21
        )

        return denoised_image

    except Exception as e:
        return str(e)


def deskew_process(image):
    grayscale = rgb2gray(image)
    angle = determine_skew(image)
    rotated = rotate(image, angle, resize=True) * 255

    return rotated.astype(np.uint8)


def tesseract(imageData):
    rawImage = Image.open(BytesIO(b64decode(imageData)))

    cv_img = cv2.cvtColor(np.array(rawImage), cv2.COLOR_RGB2BGR)

    preprocessed_image = preprocess_image(cv_img)

    ready_image = deskew_process(cv2.cvtColor(preprocessed_image, cv2.COLOR_BGR2RGB))
    ready_image = Image.fromarray(ready_image)

    if ready_image:
        text = pytesseract.image_to_string(ready_image)
        print(text[:-1])
        return text
    else:
        print("no image")
        return ""
