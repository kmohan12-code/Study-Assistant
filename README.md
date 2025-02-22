If the python code can't access the virtual environment

Please install the virtual env manually using

'python -m venv {name}'

And to activate the env use:

'.\venv\Scripts\activate'; for windows

'source

venv/bin/activate'; for Mac

And install the libraries mentioned below

All the libraries requried to run the application:

1. streamlit

2. google-generativeai

3. python-dotenv

4. langchain

5. PyPDF2

6. faiss-cpu

7. langchain_google_genai

To run the app goto Terminal and execute 'streamlit run App.py' command

If at all the API key is not working, please do visit: 'https://aistudio.google.com/app/apikey' and fetch for an API key and replace the key with already existing key in '.env' file
