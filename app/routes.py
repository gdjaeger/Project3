from flask import render_template, jsonify
from flask import send_file
from app import app
import os
import csv

@app.route('/get_cleaned_data')
def get_cleaned_data():
    data_path = os.path.join(app.root_path, 'data', 'cleaned_data.csv')
    
    # Check if the file exists at the specified path
    if not os.path.isfile(data_path):
        return jsonify({'error': 'Data file not found'})

    # Read CSV data and convert it to a list of dictionaries
    csv_data = []
    with open(data_path, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            csv_data.append(row)

    return jsonify({'data': csv_data})

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/visual1.html')
def visual1():
    return render_template('visual1.html')

@app.route('/visual3.html')
def visual3():
    return render_template('visual3.html')

@app.route('/visual4.html')
def visual4():
    return render_template('visual4.html')

@app.route('/visual5.html')
def visual5():
    return render_template('visual5.html')
