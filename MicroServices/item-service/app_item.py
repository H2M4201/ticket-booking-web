import uuid
import requests
from flask import Flask, request, jsonify, g
from time import strftime, strptime
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

    if not event_name or not event_end_date or not ticket_start_date or not ticket_end_date or not event_loc:
        error = 'Missing required field.'

    if error:
        return jsonify({'success': False, 'error': error}), 400

    try:
        cursor = db_conn.cursor()

        # Insert event
        query = """
        INSERT INTO Events (eventName, eventDescription, eventLocation, organizerID, startDate, endDate, 
                            openForTicket, closeForTicket, eventStatus) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (event_name, event_desc, event_loc, user_id, event_start_date, event_end_date,
                               ticket_start_date, ticket_end_date, ''))

        event_id = cursor.lastrowid

        # Process each ticket
        form_data = request.form
        ticket_keys = [key for key in form_data.keys() if key.startswith('tickets[')]
        ticket_indices = sorted(set(key.split('[')[1].split(']')[0] for key in ticket_keys))
        
        for i in ticket_indices:
            ticket_total = int(form_data.get(f'tickets[{i}][ticket_total]'))
            ticket_name = form_data.get(f'tickets[{i}][ticket_name]')
            ticket_price = float(form_data.get(f'tickets[{i}][ticket_price]'))

            if not ticket_name or ticket_price is None or ticket_total is None:
                error = 'Missing required field.'
            elif ticket_total < 0 or ticket_price < 0:
                error = 'Inappropriate data values.'

            if error:
                return jsonify({'success': False, 'error': error}), 400

            # Insert ticket into the database
            query = """
            INSERT INTO Tickets (eventID, ticketType, price, total, sold) 
            VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(query, (event_id, ticket_name, ticket_price, ticket_total, 0))
            ticket_id = cursor.lastrowid

            # Process each discount for the ticket
            discount_keys = [key for key in form_data.keys() if key.startswith(f'tickets[{i}][discounts][')]
            discount_indices = sorted(set(key.split('[')[3].split(']')[0] for key in discount_keys))
            
            for j in discount_indices:
                discount_name = form_data.get(f'tickets[{i}][discounts][{j}][discount_name]')
                discount_percent = form_data.get(f'tickets[{i}][discounts][{j}][discount_percent]')
                discount_description = form_data.get(f'tickets[{i}][discounts][{j}][discount_description]')
                discount_start_date = form_data.get(f'tickets[{i}][discounts][{j}][discount_start_date]')
                discount_end_date = form_data.get(f'tickets[{i}][discounts][{j}][discount_end_date]')

                if discount_name and discount_percent:
                    # Insert discount into the database
                    query = """
                    INSERT INTO Discounts (ticketID, discountName, discountPercent, discountDescription, discountStartDate, discountEndDate) 
                    VALUES (%s, %s, %s, %s, %s, %s)
                    """
                    cursor.execute(query, (ticket_id, discount_name, discount_percent, discount_description, discount_start_date, discount_end_date))

        db_conn.commit()
        return jsonify({'success': True, 'message': 'Event submitted successfully', 'eventID': event_id}), 200
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
def get_active_events():
    db_conn = db.connect_to_database()

    query = """
    SELECT 
        E.eventID, 
        E.eventName, 
        E.eventDescription, 
        E.eventLocation, 
        E.organizerID, 
        E.startDate, 
        E.endDate, 
        E.openForTicket, 
        E.closeForTicket, 
        E.eventStatus,
        T.ticketID,
        T.ticketType,
        T.price,
        T.total,
        T.sold,
        D.discountID,
        D.discountName,
        D.discountPercent,
        D.discountDescription,
        D.discountStartDate,
        D.discountEndDate,
        AVG(R.rating) AS avgRating
    FROM 
        Events E
    LEFT JOIN 
        Tickets T ON E.eventID = T.eventID
    LEFT JOIN 
        Discounts D ON T.ticketID = D.ticketID
    LEFT JOIN 
        Reviews R ON E.eventID = R.eventID
    GROUP BY 
        E.eventID, T.ticketID, D.discountID
    HAVING
        E.endDate > NOW()
    """

    events = db.execute_query(g.db, query).fetchall()
    processed_events = {}

    for row in events:
        event_id = row['eventID']
        ticket_id = row['ticketID']

        if event_id not in processed_events:
            processed_events[event_id] = {
                'eventID': row['eventID'],
                'eventName': row['eventName'],
                'eventDescription': row['eventDescription'],
                'eventLocation': row['eventLocation'],
                'organizerID': row['organizerID'],
                'startDate': row['startDate'].strftime('%Y-%m-%d %H:%M') if row['startDate'] else None,
                'endDate': row['endDate'].strftime('%Y-%m-%d %H:%M') if row['endDate'] else None,
                'openForTicket': row['openForTicket'].strftime('%Y-%m-%d %H:%M') if row['openForTicket'] else None,
                'closeForTicket': row['closeForTicket'].strftime('%Y-%m-%d %H:%M') if row['closeForTicket'] else None,
                'eventStatus': row['eventStatus'],
                'avgRating': float(row['avgRating']) if row['avgRating'] is not None else None,
                'tickets': {},
                'reviews': []
            }

        if ticket_id not in processed_events[event_id]['tickets']:
            processed_events[event_id]['tickets'][ticket_id] = {
                'ticketID': row['ticketID'],
                'ticketType': row['ticketType'],
                'price': str(row['price']) if row['price'] else None,
                'total': row['total'],
                'sold': row['sold'],
                'discounts': []
            }

        if row['discountID']:
            processed_events[event_id]['tickets'][ticket_id]['discounts'].append({
                'discountID': row['discountID'],
                'discountName': row['discountName'],
                'discountPercent': str(row['discountPercent']) if row['discountPercent'] else None,
                'discountDescription': row['discountDescription'],
                'discountStartDate': row['discountStartDate'].strftime('%Y-%m-%d %H:%M') if row['discountStartDate'] else None,
                'discountEndDate': row['discountEndDate'].strftime('%Y-%m-%d %H:%M') if row['discountEndDate'] else None
            })

    # Fetch latest reviews
    review_query = """
    SELECT 
        R.eventID,
        R.rating,
        R.comment,
        R.reviewDate
    FROM 
        Reviews R
    ORDER BY 
        R.reviewDate DESC
    """

    reviews = db.execute_query(db_connection=db_conn, query=review_query).fetchall()
    
    for review in reviews:
        event_id = review['eventID']
        if event_id in processed_events and len(processed_events[event_id]['reviews']) < 3:
            processed_events[event_id]['reviews'].append({
                'rating': review['rating'],
                'comment': review['comment'],
                'reviewDate': review['reviewDate'].strftime('%Y-%m-%d %H:%M') if review['reviewDate'] else None
            })
    
    return jsonify({'success': True, 'data': list(processed_events.values())})

@app.route('/event/<int:event_id>', methods=['GET'])
def get_event_detail(event_id):
    query = """
    SELECT 
        E.eventID, 
        E.eventName, 
        E.eventDescription, 
        E.eventLocation, 
        E.organizerID, 
        E.startDate, 
        E.endDate, 
        E.openForTicket, 
        E.closeForTicket, 
        E.eventStatus,
        T.ticketID,
        T.ticketType,
        T.price,
        T.total,
        T.sold,
        D.discountID,
        D.discountName,
        D.discountPercent,
        D.discountDescription,
        D.discountStartDate,
        D.discountEndDate,
        AVG(R.rating) AS avgRating
    FROM 
        Events E
    LEFT JOIN 
        Tickets T ON E.eventID = T.eventID
    LEFT JOIN 
        Discounts D ON T.ticketID = D.ticketID
    LEFT JOIN 
        Reviews R ON E.eventID = R.eventID
    GROUP BY 
        E.eventID, T.ticketID, D.discountID
    HAVING E.eventID = %s
    """

    events = db.execute_query(g.db, query, (event_id,)).fetchall()
    processed_events = {}

    for row in events:
        event_id = row['eventID']
        ticket_id = row['ticketID']

        if event_id not in processed_events:
            processed_events[event_id] = {
                'eventID': row['eventID'],
                'eventName': row['eventName'],
                'eventDescription': row['eventDescription'],
                'eventLocation': row['eventLocation'],
                'organizerID': row['organizerID'],
                'startDate': row['startDate'].strftime('%Y-%m-%d %H:%M') if row['startDate'] else None,
                'endDate': row['endDate'].strftime('%Y-%m-%d %H:%M') if row['endDate'] else None,
                'openForTicket': row['openForTicket'].strftime('%Y-%m-%d %H:%M') if row['openForTicket'] else None,
                'closeForTicket': row['closeForTicket'].strftime('%Y-%m-%d %H:%M') if row['closeForTicket'] else None,
                'eventStatus': row['eventStatus'],
                'avgRating': float(row['avgRating']) if row['avgRating'] is not None else None,
                'tickets': {},
                'reviews': []
            }

        if ticket_id not in processed_events[event_id]['tickets']:
            processed_events[event_id]['tickets'][ticket_id] = {
                'ticketID': row['ticketID'],
                'ticketType': row['ticketType'],
                'price': str(row['price']) if row['price'] else None,
                'total': row['total'],
                'sold': row['sold'],
                'discounts': []
            }

        if row['discountID']:
            processed_events[event_id]['tickets'][ticket_id]['discounts'].append({
                'discountID': row['discountID'],
                'discountName': row['discountName'],
                'discountPercent': str(row['discountPercent']) if row['discountPercent'] else None,
                'discountDescription': row['discountDescription'],
                'discountStartDate': row['discountStartDate'].strftime('%Y-%m-%d %H:%M') if row['discountStartDate'] else None,
                'discountEndDate': row['discountEndDate'].strftime('%Y-%m-%d %H:%M') if row['discountEndDate'] else None
            })

    tickets_list = list(processed_events[event_id]['tickets'].values())
    processed_events[event_id]['tickets'] = tickets_list
    
    # Fetch latest reviews
    review_query = """
    SELECT 
        R.eventID,
        R.rating,
        R.comment,
        R.reviewDate
    FROM 
        Reviews R
    ORDER BY 
        R.reviewDate DESC
    """
    db_conn = db.connect_to_database()
    reviews = db.execute_query(db_connection=db_conn, query=review_query).fetchall()

    for review in reviews:
        event_id = review['eventID']
        if event_id in processed_events and len(processed_events[event_id]['reviews']) < 3:
            processed_events[event_id]['reviews'].append({
                'rating': review['rating'],
                'comment': review['comment'],
                'reviewDate': review['reviewDate'].strftime('%Y-%m-%d %H:%M') if review['reviewDate'] else None
            })
    

    return jsonify({'success': True, 'data': processed_events[event_id]})


@app.route('/discount-list', methods=['GET'])
def get_discount():
    db_conn = db.connect_to_database()

    query = """
    SELECT 
        D.discountID,
        D.discountName,
        D.discountPercent,
        D.discountDescription,
        D.discountStartDate,
        D.discountEndDate,
        E.eventID,
        E.eventName,
        T.ticketID,
        T.ticketType,
        T.price
    FROM 
        Discounts D, Tickets T, Events E
    WHERE
        D.ticketID = T.ticketID and E.eventID = T.eventID
    """

    events = db.execute_query(db_connection=db_conn, query=query).fetchall()
    processed_discounts = {}

    for row in events:
        discount_id = row['discountID']

        if discount_id not in processed_discounts:
            processed_discounts[discount_id] = {
                'eventID': row['eventID'],
                'eventName': row['eventName'],
                'ticketID': row['ticketID'],
                'ticketType': row['ticketType'],
                'ticketPrice': str(row['price']),
                'discountID': row['discountID'],
                'discountName': row['discountName'],
                'discountPercent': str(row['discountPercent']),
                'discountDescription': row['discountDescription'],
                'discountStartDate': row['discountStartDate'].strftime('%Y-%m-%d %H:%M') if row['discountStartDate'] else None,
                'discountEndDate': row['discountEndDate'].strftime('%Y-%m-%d %H:%M') if row['discountEndDate'] else None
            }

    return jsonify({'success': True, 'data': list(processed_discounts.values())})


@app.route('/discount/<int:discountID>', methods=['GET'])
def get_discount_detail(discountID):

    query = """
    SELECT 
        D.discountID,
        D.discountName,
        D.discountPercent,
        D.discountDescription,
        D.discountStartDate,
        D.discountEndDate,
        E.eventID,
        E.eventName,
        T.ticketID,
        T.ticketType,
        T.price
    FROM 
        Discounts D, Tickets T, Events E
    WHERE
        D.ticketID = T.ticketID and E.eventID = T.eventID and D.discountID = %s
    """

    events = db.execute_query(g.db, query, (discountID)).fetchone()
    processed_discounts = {
        'eventID': events['eventID'],
        'eventName': events['eventName'],
        'ticketID': events['ticketID'],
        'ticketType': events['ticketType'],
        'ticketPrice': str(events['price']),
        'discountID': events['discountID'],
        'discountName': events['discountName'],
        'discountPercent': str(events['discountPercent']),
        'discountDescription': events['discountDescription'],
        'discountStartDate': events['discountStartDate'].strftime('%Y-%m-%d %H:%M') if events['discountStartDate'] else None,
        'discountEndDate': events['discountEndDate'].strftime('%Y-%m-%d %H:%M') if events['discountEndDate'] else None
    }

    return jsonify({'success': True, 'data': processed_discounts})



# Run listener
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 9991))
    app.run(port=port, debug=True, host='0.0.0.0')
