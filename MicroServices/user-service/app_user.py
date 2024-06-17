from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import database.db_connector as db
from datetime import date
from werkzeug.security import generate_password_hash, check_password_hash
from decimal import Decimal, InvalidOperation, ROUND_DOWN
from datetime import datetime

# Set up upload folder
UPLOAD_FOLDER = 'static/img/'

# Initialize Flask app
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config.from_mapping(SECRET_KEY='dev')
CORS(app)  # Enable CORS


# backend logic to 
@app.route('/register', methods=['POST'])
def register():
    # get input from FE
    data = request.json
    username = data['username']
    password = data['password']
    confirm_password = data['confirm_password']
    fname = data['fname']
    lname = data['lname']
    email = data['email']
    phone = data['phone']
    bank = ''
    _type = data["type"].lower()

    # connect to db
    db_conn = db.connect_to_database()
    error = None

    # check condition
    if not username or not password or not confirm_password:
        error = 'Username and Password are required.'
    elif password != confirm_password:
        error = 'Passwords do not match.'
    elif db.execute_query(
        db_conn,
        'SELECT userID FROM Users WHERE userName = %s', (username,)
    ).fetchone() is not None:
        error = 'User already registered.'
    elif _type not in ['guest', 'enterprise', 'admin']:
        error = 'Account type can only be Guest, Enterprise or Admin'

    if error:
        return jsonify({'success': False, 'error': error}), 400

    # hash user password and collect account's create date
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    date_joined = date.today().strftime("%Y-%m-%d")

    #define account type
    isGuest = False
    isEnterprise = False
    isAdmin = False

    if _type == 'guest':
        isGuest = True
    if _type == 'enterprise':
        isEnterprise = True
    if _type == 'admin':
        isAdmin = True

    # insert new user info to db
    db.execute_query(
        db_conn,
        'INSERT INTO Users (userName, password, firstName, lastName, email, phoneNumber, bankAccount, dateJoined, \
            isGuest, isEnterprise, isAdmin) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %r, %r, %r)',
        (username, hashed_password, fname, lname, email, phone, bank, date_joined, isGuest, isEnterprise, isAdmin)
    )

    return jsonify({'success': True, 'message': 'User registered successfully'}), 201


@app.route('/login', methods=['POST'])
def login():
    # get input from FE
    data = request.json
    username = data['username']
    password = data['password']

    # query to db looking for user info
    db_conn = db.connect_to_database()
    user = db.execute_query(
        db_conn,
        'SELECT * FROM Users WHERE userName = %s', (username,)
    ).fetchone()

    # check password matching
    if user and check_password_hash(user['password'], password):

        return jsonify({'success': True, 'user': {'username': user['userName'], 'email': user['email'], 'id': user['userID'], 'isAdmin': user['isAdmin']}})

    return jsonify({'success': False, 'error': 'Invalid username or password'}), 401


@app.route('/user/<int:user_id>/profile', methods=['GET'])
def get_user_profile(user_id):
    # query user info
    db_conn = db.connect_to_database()
    user_query = "SELECT * FROM Users WHERE userID = %s;"
    user = db.execute_query(db_connection=db_conn, query=user_query, query_params=(user_id,)).fetchone()

    # process querired info and return to FE
    processed_listing = {}
    for key, value in user.items():
        if isinstance(value, Decimal):
            processed_listing[key] = str(value)
        elif isinstance(value, datetime):
            processed_listing[key] = value.strftime('%Y-%m-%d %H:%M')
        else:
            processed_listing[key] = value

    print(processed_listing)
    if not user:
        return jsonify({'success': False, 'error': 'User not found'}), 404

    return jsonify({'success': True, 'data': processed_listing})


@app.route('/user/<int:user_id>/profile', methods=['POST'])
def set_user_profile(user_id):
    # get data from FE
    data = request.json
    username = data['username']
    fname = data['fname']
    lname = data['lname']
    email = data['email']
    phone = data['phone']

    # connect to db
    db_conn = db.connect_to_database()
    error = None

    db.execute_query(
        db_conn,
        'UPDATE Users SET firstName = %s, lastName = %s, phoneNumber = %s',
        (fname, lname, phone)
    )

    return jsonify({'success': True, 'message': 'User registered successfully'}), 201



@app.route('/user/<int:user_id>/ChangePassword', methods=['POST'])
def change_password (user_id):
    # get data from FE
    data = request.json
    username = data['username']
    pwd = data['password']
    new_pwd = data['new_pwd']
    confirm_pwd = data['confirm_pwd']

    # query to db looking for user info
    db_conn = db.connect_to_database()
    error = None
    user = db.execute_query(
        db_conn,
        'SELECT * FROM Users WHERE userName = %s', (username,)
    ).fetchone()

    # check condition
    if not username or not pwd or not new_pwd or not confirm_pwd:
        error = 'Old Password and New password are required.'
    elif not check_password_hash(user['password'], pwd):
        error = 'Old Password not correct.'
    elif new_pwd != confirm_pwd:
        error = 'New Passwords do not match.'

    if error:
        return jsonify({'success': False, 'error': error}), 400
    
    
    hashed_password = generate_password_hash(new_pwd, method='pbkdf2:sha256')
    db.execute_query(
        db_conn,
        'UPDATE Users SET password = %s', (hashed_password)
    )

    return jsonify({'success': True, 'message': 'Password changed successfully'}), 200



# Run listener
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 9990))
    app.run(port=port, debug=True, host='0.0.0.0')
