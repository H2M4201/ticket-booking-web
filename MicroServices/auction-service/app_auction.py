from decimal import ROUND_DOWN, Decimal, InvalidOperation
from flask import Flask, render_template, request, redirect, g, url_for, flash,jsonify
import os
import database.db_connector as db
from flask_cors import CORS
# from datetime import date
from werkzeug.utils import secure_filename
from validation import validate_new_listing, validate_photo, validate_bid
import threading
# from datetime import datetime
import datetime
import time
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.utils import send_notification, send_alert, write_log
import requests

# Set up upload folder
UPLOAD_FOLDER = 'static/img/'

# Initialize Flask app
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config.from_mapping(SECRET_KEY='dev')
CORS(app)  # Enable CORS

# The function for keep looping and check the status of the listings
def update_events_status():
    while True:
        current_time = datetime.datetime.now()
        db_conn = db.connect_to_database()

        # Update listings to 'active' if current time is equal to startDate
        update_query = """
        UPDATE Events 
        SET eventStatus = 'active' 
        WHERE startDate <= %s AND endDate > %s AND eventStatus != 'active';
        """
        db.execute_query(db_connection=db_conn, query=update_query, query_params=(current_time, current_time))

        # Update listings to 'hold' if current time is greater than or equal to endDate
        update_query = """
        SELECT eventID 
        from Events 
        WHERE endDate <= %s AND eventStatus = 'active';
        """
        ended_events = db.execute_query(db_connection=db_conn, query=update_query, query_params=(current_time,)).fetchall()
        for e in ended_events:
            eventID = e['eventID']
            url = 'http://localhost:9991/end-listing'  # Replace with your target URL
            data = {
                'eventID': eventID
            }
            headers = {
                'Content-Type': 'application/json'  # Example header
            }
            response = requests.post(url, json=data, headers=headers)

            # To check if the request was successful
            if response.status_code == 200:
                print("Success:", response.json())
            else:
                print("Error:", response.status_code, response.text)


        # Sleep for 1 second before the next check, maybe we can change to 60s
        time.sleep(120)

# Start the thread
update_thread = threading.Thread(target=update_events_status)
update_thread.start()

def process_price(raw_price):
    try:
        price = Decimal(raw_price)
        price = price.quantize(Decimal('0.01'), rounding=ROUND_DOWN)

        if len(str(price)) > 10:
            raise ValueError("Price too large")

        return price
    except (InvalidOperation, ValueError):
        raise ValueError("Invalid start price")


# Listener
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 9113))
    app.run(port=port, debug=True)
