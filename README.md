

### **1. Create Virtual Environment**

```bash
python -m venv venv
```

### **2. Activate Virtual Environment**

* **Windows (PowerShell / CMD):**

```bash
.\venv\Scripts\activate
```

* **Mac / Linux:**

```bash
source venv/bin/activate
```

---

### **3. Install Required Libraries**

Once inside the virtual environment, run:

```bash
pip install streamlit google-generativeai python-dotenv langchain PyPDF2 faiss-cpu langchain_google_genai
```

---

### **4. API Key Setup**

* Open the `.env` file in your project.
* If your API key isn’t working, visit 👉 [Google AI Studio API Keys](https://aistudio.google.com/app/apikey)
* Copy your new key and replace the old one inside `.env` like this:

```
GOOGLE_API_KEY=your_new_api_key_here
```

---

### **5. Run the Application**

```bash
streamlit run App.py
```
