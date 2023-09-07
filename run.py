from app import app
import os

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))  # Use port 5000 as a default if not set
    print(f"Port: {port}")  # Debugging statement to print the port value

    app.run(debug=True)

