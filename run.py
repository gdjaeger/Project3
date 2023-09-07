from app import app
import os

if __name__ == '__main__':
    # Use the PORT environment variable if available, otherwise, use port 5000 as a default
    port = int(os.environ.get("PORT", 5000))
    
    app.run(host='0.0.0.0', port=port, debug=True)
