from transformers import SpeechT5Processor, SpeechT5ForTextToSpeech, SpeechT5HifiGan
from datasets import load_dataset
import torch
import soundfile as sf
import nltk
from nltk.tokenize import word_tokenize
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import subprocess

nltk.download('punkt')

app = Flask(__name__)
nltk.download('punkt')

# Enable CORS for all domains on all routes
CORS(app, resources={r"/*": {"origins": "http://localhost"}})

processor = SpeechT5Processor.from_pretrained("microsoft/speecht5_tts")
model = SpeechT5ForTextToSpeech.from_pretrained("microsoft/speecht5_tts")
vocoder = SpeechT5HifiGan.from_pretrained("microsoft/speecht5_hifigan")
embeddings_dataset = load_dataset("Matthijs/cmu-arctic-xvectors", split="validation")
speaker_embeddings = torch.tensor(embeddings_dataset[5000]["xvector"]).unsqueeze(0)

@app.route('/synthesize', methods=['POST'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def synthesize():
    text = request.json.get('text')
    if not text:
        return "No text provided", 400
    
    total_length = len(text)
    if total_length > 550:
        return f"Text is too long. Total length is {total_length} characters. Please reduce to 550 characters or less.", 400

    inputs = processor(text=text, return_tensors="pt")
    speech = model.generate_speech(inputs["input_ids"], speaker_embeddings, vocoder=vocoder)
    sf.write("../frontend/public/audios/speech.wav", speech.numpy(), samplerate=16000)

    # Run Rhubarb Lip Sync
    result = subprocess.run(["./Rhubarb-Lip-Sync-1.13.0-macOS/rhubarb", "-f", "json", "../frontend/public/audios/speech.wav", "-o", "../frontend/public/audios/speech.json"])

    if result.returncode != 0:
        return jsonify({"error": "Failed to generate lip sync data", "details": result.stderr}), 500

    return jsonify({"message": "Text to speech conversion complete"}), 200

if __name__ == '__main__':
    app.run(debug=True)