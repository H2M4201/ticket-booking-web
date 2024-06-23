import uuid
import requests
from flask import Flask, request, jsonify, g
from flask_cors import CORS
from decimal import Decimal, InvalidOperation, ROUND_DOWN
from datetime import datetime
from werkzeug.utils import secure_filename
import json
import os
from database import db_connector as db
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.utils import send_notification, send_alert, write_log

# Set up upload folder
UPLOAD_FOLDER = 'static/img/'

# Initialize Flask app
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config.from_mapping(SECRET_KEY='dev')
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


def process_price(raw_price):
    try:
        price = Decimal(raw_price)
        price = price.quantize(Decimal('0.01'), rounding=ROUND_DOWN)

        if len(str(price)) > 10:
            raise ValueError("Price too large")

        return price
    except (InvalidOperation, ValueError):
        raise ValueError("Invalid price")
    
@app.before_request
def before_request():
    """Open a new database connection before each request."""
    g.db = db.connect_to_database()

@app.teardown_request
def teardown_request(exception):
    """Close the database connection after each request."""
    db_conn = getattr(g, 'db', None)
    if db_conn is not None:
        db_conn.close()


@app.route('/submit-event', methods=['POST'])
def submit_event():
    db_conn = db.connect_to_database()

    event_name = request.form['event_name']
    event_desc = request.form['event_desc']        
    event_loc = request.form['event_loc']
    event_start_date = request.form['event_start_date']
    event_end_date = request.form['event_end_date']
    ticket_start_date = request.form['ticket_start_date']
    ticket_end_date = request.form['ticket_end_date']
    user_id = request.form['user_id']

    if 'file' in request.files:
        photo = request.files['file']
    else:
        photo = None

    filepath = "./static/img/No_image_available.jpg"
    if photo and photo.filename != '':
        filepath = os.path.join("./" + app.config['UPLOAD_FOLDER'], str(uuid.uuid4()) + '.jpg')
        photo.save(filepath)

    error = None

    if not event_name or not event_end_date or not event_end_date \
        or not ticket_start_date or not ticket_end_date or not event_loc:
        error = 'Missing required field.'
    elif (datetime.strptime(event_start_date, '%Y-%m-%d') < datetime.strptime(event_end_date, '%Y-%m-%d')) \
        or (datetime.strptime(ticket_start_date, '%Y-%m-%d') < datetime.strptime(ticket_end_date, '%Y-%m-%d')) \
        or (datetime.strptime(event_start_date, '%Y-%m-%d') < datetime.strptime(ticket_start_date, '%Y-%m-%d')) \
        or (datetime.strptime(event_end_date, '%Y-%m-%d') < datetime.strptime(ticket_end_date, '%Y-%m-%d')):
        error = 'Unappropriate time for events and ticket selling.'
   
    if error:
        return jsonify({'success': False, 'error': error}), 400

    try:
        cursor = db_conn.cursor()

        query = """
        INSERT INTO Events (eventName, eventDescription, eventLocation, organizerID, startDate, endDate, 
                            openForTicket, closeForTicket, eventStatus) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (event_name, event_desc, event_loc, user_id, event_start_date, event_end_date,
                                ticket_start_date, ticket_end_date, ''))
       

        event_id = db.execute_query(
          g.db,
         'SELECT MAX(eventID) FROM Events'
        ).fetchone()
        print(event_id)
        

        tickets = json.loads(request.form['tickets'])
        print(tickets)
        for ticket in tickets:
            ticket_total = ticket['ticket_total']
            ticket_sold = 0
            ticket_name = ticket['ticket_name']
            ticket_price = ticket['ticket_price']

            error = None

            if not ticket_name or not ticket_price or not ticket_total \
                or not ticket_start_date or not ticket_end_date or not ticket_total or not event_loc:
                error = 'Missing required field.'
            elif ticket_total < 0 or ticket_price < 0:
                error = 'Unappropriate data values.'
        
            if error:
                return jsonify({'success': False, 'error': error}), 400

            query = """
            INSERT INTO Tickets (eventID, ticketType, price, total, sold) 
            VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(query, (event_id, ticket_total, ticket_sold, ticket_name, ticket_price))

        db_conn.commit()
        return jsonify({'success': True, 'message': 'Event submitted successfully', 'eventID': 1}), 200
    except Exception as e:
        db_conn.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        cursor.close()


@app.route('/update-event', methods=['POST'])
def update_event():
    db_conn = db.connect_to_database()

    data = request.json
    event_id = data['event_id']
    event_name = data['event_name']
    event_desc = data['event_desc']
    event_loc = data['event_loc']
    event_start_date = data['event_start_date']
    event_end_date = data['event_end_date']
    ticket_start_date = data['ticket_start_date']
    ticket_end_date = data['ticket_end_date']
    tickets = data['tickets']

    try:
        cursor = db_conn.cursor()

        query = """
        UPDATE Events
        SET eventName = %s, eventDescription = %s, eventLocation = %s, startDate = %s, 
            endDate = %s, openForTicket = %s, closeForTicket = %s
        WHERE eventID = %s
        """
        cursor.execute(query, (event_name, event_desc, event_loc, event_start_date, event_end_date,
                                ticket_start_date, ticket_end_date, event_id))

        query = "DELETE FROM Tickets WHERE event_id = %s"
        cursor.execute(query, (event_id,))

        for ticket in tickets:
            ticket_total = ticket['ticket_total']
            ticket_sold = ticket['ticket_sold']
            ticket_name = ticket['ticket_name']
            ticket_price = process_price(ticket['ticket_price'])

            query = """
            INSERT INTO Tickets (event_id, ticket_total, ticket_sold, ticket_name, ticket_price) 
            VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(query, (event_id, ticket_total, ticket_sold, ticket_name, ticket_price))

        db_conn.commit()
        return jsonify({'success': True, 'message': 'Event updated successfully', 'eventID': event_id}), 200
    except Exception as e:
        db_conn.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        cursor.close()


@app.route('/get-events', methods=['GET'])
def get_events():
    db_conn = db.connect_to_database()

    query = """
    SELECT 
        E.*, 
        GROUP_CONCAT(T.ticket_name, ':', T.ticket_price SEPARATOR ';') AS tickets
    FROM 
        Events E
    LEFT JOIN 
        Tickets T ON E.event_id = T.event_id
    GROUP BY 
        E.event_id
    """

    events = db.execute_query(db_connection=db_conn, query=query).fetchall()
    processed_events = []
    for event in events:
        processed_event = {}
        for key, value in event.items():
            if isinstance(value, Decimal):
                processed_event[key] = str(value)
            elif isinstance(value, datetime):
                processed_event[key] = value.strftime('%Y-%m-%s %H:%M')
            else:
                processed_event[key] = value
        processed_events.append(processed_event)

    return jsonify({'success': True, 'data': processed_events})


# Run listener
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 9991))
    app.run(port=port, debug=True, host='0.0.0.0')
