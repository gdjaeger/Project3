from app import app
import os

# Use the PORT environment variable if available, otherwise default to 5000
port = int(os.environ.get("PORT", 5000))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=port)
