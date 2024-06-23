from flask import Flask, request, jsonify, g
from flask_cors import CORS
import os
import pymysql
import database.db_connector as db
from datetime import date, datetime
from werkzeug.security import generate_password_hash, check_password_hash
from decimal import Decimal

# Set up upload folder
UPLOAD_FOLDER = 'static/img/'

# Initialize Flask app
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config.from_mapping(SECRET_KEY='dev')
CORS(app, resources={r"/*": {"origins": "*"}})

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

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    confirm_password = data.get('confirm_password')
    fname = data.get('fname')
    lname = data.get('lname')
    email = data.get('email')
    phone = data.get('phone')
    _type = data.get("type", "").lower()

    error = None

    if not username or not password or not confirm_password:
        error = 'Username and Password are required.'
    elif password != confirm_password:
        error = 'Passwords do not match.'
    elif db.execute_query(
        g.db,
        'SELECT userID FROM Users WHERE userName = %s', (username,)
    ).fetchone() is not None:
        error = 'User already registered.'
    elif _type not in ['guest', 'enterprise', 'admin']:
        error = 'Account type can only be Guest, Enterprise, or Admin'

    if error:
        return jsonify({'success': False, 'error': error}), 400

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    date_joined = date.today().strftime("%Y-%m-%d")

    isGuest = _type == 'guest'
    isEnterprise = _type == 'enterprise'
    isAdmin = _type == 'admin'

    try:
        cursor = g.db.cursor()
        cursor.execute(
            'INSERT INTO Users (userName, password, firstName, lastName, email, phoneNumber, bankAccount, dateJoined, \
                isGuest, isEnterprise, isAdmin) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)',
            (username, hashed_password, fname, lname, email, phone, '', date_joined, isGuest, isEnterprise, isAdmin)
        )
        g.db.commit()
        cursor.close()
    except Exception as e:
        g.db.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

    return jsonify({'success': True, 'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = db.execute_query(
        g.db,
        'SELECT * FROM Users WHERE userName = %s', (username,)
    ).fetchone()

    if user and check_password_hash(user['password'], password):
        return jsonify({
            'success': True,
            'user': {
                'username': user['userName'],
                'email': user['email'],
                'id': user['userID'],
                'isAdmin': user['isAdmin']
            }
        })

    return jsonify({'success': False, 'error': 'Invalid username or password'}), 401

@app.route('/user/<int:user_id>/profile', methods=['GET'])
def get_user_profile(user_id):
    user_query = "SELECT * FROM Users WHERE userID = %s;"
    user = db.execute_query(g.db, user_query, (user_id,)).fetchone()

    if not user:
        return jsonify({'success': False, 'error': 'User not found'}), 404

    processed_listing = {}
    for key, value in user.items():
        if isinstance(value, Decimal):
            processed_listing[key] = str(value)
        elif isinstance(value, datetime):
            processed_listing[key] = value.strftime('%Y-%m-%d %H:%M')
        else:
            processed_listing[key] = value

    return jsonify({'success': True, 'data': processed_listing})

@app.route('/user/<int:user_id>/profile', methods=['POST'])
def set_user_profile(user_id):
    data = request.json
    fname = data.get('firstName')
    lname = data.get('lastName')
    phone = data.get('phoneNumber')

    if not all([fname, lname, phone]):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    try:
        cursor = g.db.cursor()
        cursor.execute(
            'UPDATE Users SET firstName = %s, lastName = %s, phoneNumber = %s WHERE userID = %s',
            (fname, lname, phone, user_id)
        )
        g.db.commit()
        cursor.close()
    except Exception as e:
        g.db.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

    return jsonify({'success': True, 'message': 'User profile updated'}), 200

@app.route('/user/<int:user_id>/ChangePassword', methods=['POST'])
def change_password(user_id):
    data = request.json
    pwd = data.get('pwd')
    new_pwd = data.get('new_pwd')
    confirm_pwd = data.get('confirm_pwd')

    user = db.execute_query(
        g.db,
        'SELECT * FROM Users WHERE userID = %s', (user_id,)
    ).fetchone()

    error = None
    if (not pwd) or (not new_pwd) or (not confirm_pwd):
        error = 'Old Password and New password are required.'
    elif not user or not check_password_hash(user['password'], pwd):
        error = 'Old Password not correct.'
    elif new_pwd != confirm_pwd:
        error = 'New Passwords do not match.'

    if error:
        return jsonify({'success': False, 'error': error}), 400

    hashed_password = generate_password_hash(new_pwd, method='pbkdf2:sha256')

    try:
        cursor = g.db.cursor()
        cursor.execute(
            'UPDATE Users SET password = %s WHERE userID = %s', (hashed_password, user_id)
        )
        g.db.commit()
        cursor.close()
    except Exception as e:
        g.db.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

    return jsonify({'success': True, 'message': 'Password changed successfully'}), 200



@app.route('/ResetPassword', methods=['POST'])
def reset_password():
    data = request.json
    username = data.get('username')
    new_pwd = data.get('new_pwd')
    confirm_pwd = data.get('confirm_pwd')

    user = db.execute_query(
        g.db,
        'SELECT * FROM Users WHERE userName = %s', (username)
    ).fetchone()

    error = None
    if not username:
        error = 'Username required.'
    elif not new_pwd:
        error = 'New password required!!'
    elif not confirm_pwd:
        error = 'Please confirm your new password!!'
    elif db.execute_query(
        g.db,
        'SELECT userID FROM Users WHERE userName = %s', (username)
    ).fetchone() is None:
        error = 'User not existed!'
    elif new_pwd != confirm_pwd:
        error = 'New Passwords do not match.'

    if error:
        return jsonify({'success': False, 'error': error}), 400

    hashed_password = generate_password_hash(new_pwd, method='pbkdf2:sha256')

    try:
        cursor = g.db.cursor()
        cursor.execute(
            'UPDATE Users SET password = %s WHERE userName = %s', (hashed_password, username)
        )
        g.db.commit()
        cursor.close()
    except Exception as e:
        g.db.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

    return jsonify({'success': True, 'message': 'Password changed successfully'}), 200

@app.route('/add-checkout', methods=['POST'])
def add_checkout():
    data = request.json
    user_id = data.get('userID')
    event_id = data.get('eventID')
    ticket_id = data.get('ticketID')
    quantity = data.get('quantity')
    discount_id = data.get('discountID')

    if not user_id or not event_id or not ticket_id or not quantity:
        return jsonify({'success': False, 'error': 'Missing required fields'}), 400

    try:
        purchase_date = datetime.now()
        cursor = g.db.cursor()

        # Insert checkout record
        query = """
        INSERT INTO Checkout (userID, eventID, ticketID, quantity, discountID, purchaseDate) 
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (user_id, event_id, ticket_id, quantity, discount_id or None, purchase_date))
        g.db.commit()
        cursor.close()
    except Exception as e:
        g.db.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

    return jsonify({'success': True, 'message': 'Ticket purchased successfully'}), 201


@app.route('/get-checkout', methods=['GET'])
def get_checkout():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({'success': False, 'error': 'Missing user_id'}), 400

    try:
        # Use DictCursor to get results as dictionaries
        cursor = g.db.cursor(pymysql.cursors.DictCursor)
        query = """
        SELECT 
            C.checkoutID, 
            E.eventName AS name, 
            E.eventDescription AS description, 
            E.endDate, 
            T.price AS dealPrice, 
            C.quantity,
            COALESCE(D.discountPercent, 0) AS discountPercent
        FROM 
            Checkout C
        JOIN 
            Events E ON C.eventID = E.eventID
        JOIN 
            Tickets T ON C.ticketID = T.ticketID
        LEFT JOIN
            Discounts D ON C.discountID = D.discountID
        WHERE 
            C.userID = %s
        """
        cursor.execute(query, (user_id,))
        cart_items = cursor.fetchall()
        cursor.close()

        processed_cart_items = []
        for item in cart_items:
            processed_item = {}
            for key, value in item.items():
                if isinstance(value, Decimal):
                    processed_item[key] = float(value)  # Convert Decimal to float
                elif isinstance(value, datetime):
                    processed_item[key] = value.strftime('%Y-%m-%d %H:%M')
                else:
                    processed_item[key] = value
            processed_item["paidPrice"] = processed_item['dealPrice'] * processed_item['quantity'] * (1 - min(100, max(0, processed_item['discountPercent'])) / 100)
            processed_cart_items.append(processed_item)

        return jsonify({'success': True, 'data': processed_cart_items}), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 9990))
    app.run(port=port, debug=True, host='0.0.0.0')
