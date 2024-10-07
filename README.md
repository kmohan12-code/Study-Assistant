# pdf-bot
This Streamlit application allows users to upload PDF documents and ask questions based on the content. It utilizes LangChain and Google Generative AI for text processing and question answering.
Features
PDF Upload: Users can upload multiple PDF files.
Text Extraction: Extracts text from uploaded PDFs.
Text Chunking: Splits text into manageable chunks.
Vector Store: Stores text embeddings for efficient querying.
Conversational AI: Provides detailed answers to user questions based on the context.
Requirements
Python 3.8+
Streamlit
PyPDF2
LangChain
Google Generative AI SDK
FAISS
dotenv
Installation
Clone the repository:
bash
git clone <repository-url>
cd <repository-directory>

Install required packages:
bash
pip install -r requirements.txt

Set up your Google API key in a .env file:
text
GOOGLE_API_KEY=your_api_key_here

Usage
Run the app:
bash
streamlit run app.py

Upload your PDF files using the file uploader.
Ask questions related to the content of the PDFs.
Contributing
Feel free to submit issues or pull requests for improvements.
 
