# Talk with Nietzsche

## About the project

The purpose of this project is allowing you to have a conversation with one of the most influential thinkers of human history. Well, it is not exactly him, but a large language model controlling a 3D Avatar and pretending that it is him... Well, close enough :)

## How to run the project

1. First you will need a LLM API to control the Avatar. During development, I've been using the [Mistral 7B Instruct v0.2 - GGUF model](https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF), which is good enough for a reliable Nietzsche impersonation. You can easily set up an API with this model by using [LM Studio] (https://lmstudio.ai/), which allows to run LLMs on your computer, entirely offline. Change the value of the llm_url constant on `frontend/src/constants/endpoints.ts` to make sure you are pointing to the correct endpoint of your LLM API.

2. You will need to install Rhubarb in a subfolder of the 'backend' project. Rhubarb is an open source software that generates lip sync information: it will be responsible to generate the data to animate Nietzsche's mouth! Go to the [Rhubarb repository on GitHub](https://github.com/DanielSWolf/rhubarb-lip-sync) and install the latest version for your operating system inside the `backend` folder. Our backend will execute the following command:
   The `local.py` file (our backend) executes the following command:

```
./Rhubarb-Lip-Sync-1.13.0-macOS/rhubarb -f json ./speech.wav -o speech.json
```

If you are not running it on macOS or using a different Rhubarb version, change the name of the folder on `local.py` to make sure it is referencing the correct path of the Rhubarb executable.

3. Install the dependencies of our backend by navigating to the `backend` and executing `pip3 install -r requirements.txt`.

4. Install the dependencies of our frontend by navigating to `frontend` and executing `yarn`.

5. Once you have the LLM API running and the dependencies of both backend and frontend installed, you can run the frontend from the `frontend` folder by executing `yarn dev` and you can run the backend from the `backend` folder by executing `python3 local.py`.

6. All set! Now you can go to http://localhost:5173/ and have a conversation with Nietzsche!
