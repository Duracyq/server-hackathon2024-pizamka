import csv
import requests
import logging

import time
import fastapi
from fastapi import FastAPI, File, UploadFile, HTTPException
from google.cloud import vision
from pydantic import BaseModel
import openai

import os

server = fastapi.FastAPI()
EXTERNAL_API_URL = "http://localhost:11111/"
# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# PocketBase API URL and collection name
api_url = "http://localhost:8090/api/collections/harmonogram/records"

def upload_csv_to_pocketbase():
    with open('/home/dr3x_0/Downloads/hackathon-csv/wywoz_danych_rejon2_corrected.csv', 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            data = {
                "adres": row["Adres"],
                "rodzaj": row["Rodzaj wywozu"],
                "data_wywozu": row["Data wywozu"],
            }

            # Retry logic for uploads
            for _ in range(3):  # Retry up to 3 times
                logging.info(f"Uploading: Adres: {data['adres']}, Data wywozu: {data['data_wywozu']}, Rodzaj wywozu: {data['rodzaj']}")
                response = requests.post(api_url, json=data)

                if response.status_code == 200:
                    logging.info(f"Successfully uploaded: {data['adres']}")
                    break  # Exit the retry loop on success
                else:
                    logging.error(f"Failed to upload: {data['adres']}, Error: {response.text}")
                    time.sleep(1)  # Wait a bit before retrying

# Run the upload script
# upload_csv_to_pocketbase()


@server.get("/")
def read_root():
    return {"Hello": "World"}


# Set up OpenAI API Key

# Initialize Google Vision API Client
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./credentials-kolabop.json"
client = vision.ImageAnnotatorClient()

class ObjectInfo(BaseModel):
    object_description: str

@server.post("/api/upload/")
async def upload_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()

        # Use Google Vision API for label detection
        image = vision.Image(content=contents)
        response = client.label_detection(image=image)

        if response.error.message:
            raise HTTPException(status_code=500, detail=response.error.message)

        labels = response.label_annotations

        if not labels:
            return {"message": "No objects detected."}

        objects = [label.description for label in labels]
        object_description = ", ".join(objects)

        # Ask OpenAI where to throw the detected object
        answer = ask_openai(object_description)
        return {
            "recognized_objects": object_description,
            "bin_suggestion": answer
        }
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


def ask_openai(object_description: str) -> str:
    openai.api_key = 'API-KEY'
    question = f"Z podanego zestawu przedmiotów wybierz ten, który jest najbardziej precyzyjnym opisem obiektu. Następnie w krótkiej formie odpowiedz na pytanie: do jakiego kosza należy wrzucić. Nie używaj polskich znaków. Szablon odpowiedzi: Przedmiot nalezy wyrzucic do -> [nazwa kosza]. Tutaj są przedmioty: {object_description}"
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": question}
        ]
    )
    if response and 'choices' in response:
        return response['choices'][0]['message']['content']
    return "No response from OpenAI."