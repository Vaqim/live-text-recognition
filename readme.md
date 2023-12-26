# Live Text Recognition

The application is designed for live recognition and transforming data into text format

## Installation

Install packages with pip

```bash
  pip install -r ./requirements.txt
```

Launch the application

```bash
  python3 app.py
```

## API Reference

#### Index page

```http
  GET localhost:3000/
```

#### Text Recognition app

```http
  GET localhost:3000/text-recognition
```

#### About project

```http
  GET localhost:3000/about
```

## Tech Stack

**Server:** Python, Flask

**Packages:** pytesseract, opencv-python, deskew, numpy

## Author

- [Vadym Saiko](https://github.com/Vaqim)
