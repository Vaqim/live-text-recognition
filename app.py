from flask import Flask, render_template, Response, request, jsonify

from textRecognition import tesseract


app = Flask(
    __name__,
    static_folder="views/static",
    template_folder="views/templates",
    static_url_path="",
)


@app.get("/")
def index():
    return render_template("index.html")


@app.get("/about")
def about():
    return render_template("about.html")


@app.get("/text-recognition")
def text_recognition():
    return render_template("text-recognition.html")


@app.post("/recognize")
def recognize_text():
    image_data = request.get_json().get("imageData")
    content = image_data.split(";")[1].split(",")[1]

    return jsonify({"message": tesseract(content)})


app.run("0.0.0.0", debug=True, port=3000)
