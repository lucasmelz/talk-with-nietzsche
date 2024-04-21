# Text to Speech + Lip Sync API

This is a server that does two things: generate a wav audio file corresponding to the text that is sent to it, and then, uses Rhubarb to generate the JSON file with the lip sync corresponding to it.

1. Use pip3 to install any dependencies.

```bash
pip3 install -r requirements.txt
```

This will download the model, tokenizer and dataset to your local machine and run on your local machine.

- microsoft/speecht5_tts: https://huggingface.co/microsoft/speecht5_tts
- microsoft/speecht5_hifigan
- Matthijs/cmu-arctic-xvectors

2. Make sure you have Rhubarb installed in a subfolder in this directory. The local.py file will execute the following command:

```
./Rhubarb-Lip-Sync-1.13.0-macOS/rhubarb -f json ./speech.wav -o speech.json
```

If you are not running it on macOS or using a different Rhubarb version, change the name of the folder on local.py to make sure it is referencing the correct path of the Rhubarb executable.
Rhubarb repo: https://github.com/DanielSWolf/rhubarb-lip-sync/

3. Run the server

```bash
python3 local.py
```

4. Now you can send post requests to the server!

```
curl -X POST -H "Content-Type: application/json" -d '{"text": "Your text here"}' http://localhost:5000/synthesize
```
