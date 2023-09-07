from flask import Flask
import os
port = int(os.environ.get("PORT", 5000))  # Use port 5000 as a default if not set


app = Flask(__name__)
app.static_folder = 'static'

from app import routes