## __Microservices__

There are five mircroservices backend talking and communicating with each other.
 - **User Microservice**: Manages user accounts, authentication, profiles.
 - **Item Microservice**: Handles event, ticket and discount listings, updates, and categorization.
 - **Auction Microservice**: Facilitates auction listings, bidding processes, and auction timers.
 - **Notification Microservice**: Sends out alerts and notifications to users.
 - **Log Microservice**: Records user activity and saves them in database.

----------------------------------------------------------------------------------
## __Technology Stack and APIs__

### Backend
- **Flask**: Utilized for setting up the server and routing for the backend APIs.
- **Flask-CORS**: Enabled cross-origin requests, crucial for frontend-backend communication.
- **Werkzeug**: Employed for secure password hashing and file handling functionalities.
- **smtplib**: Facilitated the sending of notification and alert emails.
- **Gmail SMTP Server**: Served as the SMTP server for sending out emails from the application.
- **Python's datetime Module**: Used for all date and time manipulations, especially in listing and bid management.
- **Python's os Module**: Handled file path operations and environment variable management.
- **Python's decimal Module**: Ensured precise handling of monetary values in bidding and pricing.
- **Python's json Module**: Managed JSON data parsing and generation for API communication.
- **Custom Flask APIs**: Developed for user registration, listing management, bid handling, and more.
- **Environment Variable Management with os.environ**: Managed configuration settings securely.
- **Flask's Development Server**: Used for local development and testing of the application.

### Frontend
- **React.js**: Powered the user interface, used in conjunction with Flask for dynamic content rendering.

### Database
- **MySQL**: Acted as the primary database for storing user and auction data.
- **MongoDB**: Used for logging purposes, storing application logs and audit trails.

----------------------------------------------------------------------------------

## __Installation__

1. Download and install Node.js
	https://nodejs.org/en/download/
	after install, check
	```
	node -v
	npm -v
	```
   
2. Navigate to auction-frontend
	```
	cd .\auction-frontend\
	npm install
	```

3. Setting Up a Virtual Environment (Optional)
	```
	python -m venv venv
	venv\Scripts\activate
	```

  	trouble shooting: if you see message like this
   	![image](https://github.com/liangjunchen88/Topics-of-Software/assets/113968753/0577d90b-d135-4dc9-aaf0-3ec70d937eb6)
   
	```
    	Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
	```


5. Install Dependencies
	```
	pip3 install -r requirements.txt
 	// if pip3 doesn't work for you, try pip
 	pip install -r requirements.txt
	```

6. Open MySQL Shell
	```
	mysqlsh
	```

7. Enter SQL Mode
	```
	\sql
	```
   
8. Connect to Your Local Admin Account
	```
	\connect root@localhost
	```

9. Create and Set Up the New Database
	```
	DROP DATABASE mainDB;
	CREATE DATABASE mainDB;
	USE mainDB;
	source D:/Distributed Application/ticket-booking-web/database/mainDB.sql;
	```

10. Create a .env File using IDE
	
 	Open your code editor or IDE (like Visual Studio Code, PyCharm, etc.).

	Navigate to each MircroService folder.

	Create a new file at the root of this folder and name it .env.

11. Add Database Connection Details
	
 	In the .env file, you will add the lines provided, replacing placeholders with your actual database information. 
	```
	340DBHOST=localhost
	340DBUSER=root
	340DBPW=your_mysql_password
	340DB=mainDB
	```

12. Running the Application

	With the database set up and the .env file configured, your application should now be able to connect to your database.
	
	1. Open Your Terminal in code editor/IDE
	
	2. Activate Your Virtual Environment (If You Used One)
	
	3. Run the Application
	split into 5 terminals

	First run these 2 commands for both 5 terminals:
	Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
	venv\Scripts\activate
	```

	then start each service in each terminal:
	python .\MicroServices\item-service\app_item.py
	python .\MicroServices\log-service\app_log.py
	python .\MicroServices\notification-service\app_notification.py
	python .\MicroServices\user-service\app_user.py
	python .\MicroServices\auction-service\app_auction.py

	Open another terminal and run these 2 commands to start the front end
	cd .\auction-frontend\
	npm start
	```

 	4. Access the Web Application

      	Open your web browser and go to http://127.0.0.1:9112/.
     
     	This is the local address where your Flask app is running.
     
	Flask will also output the URL in the terminal, confirming where the app is active.

 	Trouble Shooting:
	
	You need to manual pip install the dependencies you need, here I provide all the command you may need:
	
	```
 	pip install flask
	pip install python-dotenv
	pip install flask-cors
	pip install pymysql
 	```

If you have any questions, plz reach out anytime on our team ^_^
