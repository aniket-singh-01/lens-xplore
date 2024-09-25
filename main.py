from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import cv2
import os
import json
import numpy as np
from rapidocr_onnxruntime import RapidOCR
from groq import Groq
import base64

from document_schema import DocumentSchema
from env import GROQ_API_KEY, MODEL_NAME


def img_to_b64(image_path):
    with open(image_path, "rb") as f:
        img = f.read()
    return base64.b64encode(img).decode("utf-8")


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


groq_key = GROQ_API_KEY
groq = Groq(api_key=GROQ_API_KEY)
ocr_engine = RapidOCR()


@app.get("/")
def index():
    return {
        "message": "Welcome to the Invoice Categorization API. Upload a video file to get started."
    }


@app.post("/uploadvideo")
async def upload_video(file: UploadFile = File(...)):
    video_path = os.path.join("tmp", file.filename)
    with open(video_path, "wb+") as buffer:
        buffer.write(await file.read())

    sharpest_frame = find_sharpest_frame(video_path)

    if sharpest_frame is not None:
        image_path = os.path.join("tmp", "sharpest_frame.jpg")
        cv2.imwrite(image_path, sharpest_frame)

        preprocessed_image = preprocess_image_for_ocr(image_path)

        if preprocessed_image is not None:
            cv2.imwrite(
                os.path.join("tmp", "preprocessed_image.jpg"), preprocessed_image
            )

            ocr_text = perform_ocr(os.path.join("tmp", "preprocessed_image.jpg"))

            results = categorize_invoice(ocr_text)
        return {
            "results": results,
            "sharpest_frame": f"data:image/jpeg;base64,{img_to_b64(image_path)}",
            "preprocessed_image": f"""data:image/jpeg;base64,{img_to_b64(
                os.path.join("tmp", "preprocessed_image.jpg")
            )}""",
        }

    return {"error": "No sharp frame found."}


def find_sharpest_frame(video_path):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return None

    sharpest_frame = None
    max_sharpness = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()

        if laplacian_var > max_sharpness:
            max_sharpness = laplacian_var
            sharpest_frame = frame

    cap.release()
    return sharpest_frame


def preprocess_image_for_ocr(image_path):
    image = cv2.imread(image_path)

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    denoised = cv2.GaussianBlur(gray, (3, 3), 0)

    thresh = cv2.adaptiveThreshold(
        denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )

    kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
    sharpened = cv2.filter2D(thresh, -1, kernel)

    scale_percent = 150
    width = int(image.shape[1] * scale_percent / 100)
    height = int(image.shape[0] * scale_percent / 100)
    dim = (width, height)
    resized = cv2.resize(sharpened, dim, interpolation=cv2.INTER_CUBIC)

    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
    morph = cv2.morphologyEx(resized, cv2.MORPH_CLOSE, kernel)

    return morph


def perform_ocr(image_path):
    with open(image_path, "rb") as f:
        img = f.read()

    result, _ = ocr_engine(img)
    boxes, txts, scores = list(zip(*result))
    text = "\n".join(txts)
    return text


def categorize_invoice(pages):
    try:
        chat = groq.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": f"""
                        You are an assistant tasked to extract information from Invoices. You will be provided with the output of OCR of an Invoice. Your task is to categorize the information from the bill. Make sure to include grand total amount and the document classification like groceries, electronics, services etc. Provide output in a JSON format.

                        Add all the values, and make sure it matches the grand total.

                        Play close attention to commas and decimal points. 

                        The document has the following schema
                        {json.dumps(DocumentSchema.model_json_schema(), indent=2)}
                    """,
                },
                {
                    "role": "user",
                    "content": f"The following OCR has to be categorized\n\n{pages}",
                },
            ],
            model=MODEL_NAME,
            temperature=0,
            stream=False,
            response_format={"type": "json_object"},
        )

        validated_output = DocumentSchema.model_validate_json(
            chat.choices[0].message.content
        )
        return validated_output
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
