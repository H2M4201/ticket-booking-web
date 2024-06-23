DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    userID INT(11) UNIQUE NOT NULL AUTO_INCREMENT,
    userName VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phoneNumber VARCHAR(20),
    bankAccount VARCHAR(20),
    dateJoined DATE NOT NULL,
    isGuest BOOLEAN NOT NULL,
    isEnterprise BOOLEAN NOT NULL,
    isAdmin BOOLEAN NOT NULL,
    PRIMARY KEY (userID)
);

INSERT INTO Users (userName, password, firstName, lastName, email, phoneNumber, bankAccount, dateJoined, isGuest, isEnterprise, isAdmin) VALUES
('mhuyhcmus', 'pbkdf2:sha256:150000$G365080U$4a8509d6142e2b6374c75593bfbaf2db5a05cbed41bc3265f1a8e9b9a4fcdc37', 'Hoang Minh', 'Huy', 'huyhoang.hhm@gmail.com', '', '', '2024-06-13', FALSE, TRUE, FALSE);

INSERT INTO Users (userName, password, firstName, lastName, email, phoneNumber, bankAccount, dateJoined, isGuest, isEnterprise, isAdmin) VALUES
('haingo', 'pbkdf2:sha256:150000$G365080U$4a8509d6142e2b6374c75593bfbaf2db5a05cbed41bc3265f1a8e9b9a4fcdc37', 'Ngo', 'Hai', 'thanhhai.123@gmail.com', '', '', '2024-06-13', TRUE, FALSE, FALSE);

INSERT INTO Users (userName, password, firstName, lastName, email, phoneNumber, bankAccount, dateJoined, isGuest, isEnterprise, isAdmin) VALUES
('danghuy', 'pbkdf2:sha256:150000$G365080U$4a8509d6142e2b6374c75593bfbaf2db5a05cbed41bc3265f1a8e9b9a4fcdc37', 'Do Dang', 'Huy', 'danghuy.hhm@gmail.com', '', '', '2024-06-13', TRUE, FALSE, FALSE);

INSERT INTO Users (userName, password, firstName, lastName, email, phoneNumber, bankAccount, dateJoined, isGuest, isEnterprise, isAdmin) VALUES
('admin', 'pbkdf2:sha256:150000$G365080U$4a8509d6142e2b6374c75593bfbaf2db5a05cbed41bc3265f1a8e9b9a4fcdc37', 'admin', '', 'admin@gmail.com', '', '', '2024-06-13', FALSE, FALSE, TRUE);

INSERT INTO Users (userName, password, firstName, lastName, email, phoneNumber, bankAccount, dateJoined, isGuest, isEnterprise, isAdmin) VALUES
('fifa', 'pbkdf2:sha256:150000$G365080U$4a8509d6142e2b6374c75593bfbaf2db5a05cbed41bc3265f1a8e9b9a4fcdc37', 'FIFA', '', 'fifa@gmail.com', '', '', '2024-06-13', FALSE, TRUE, FALSE);

DROP TABLE IF EXISTS Checkout;

CREATE TABLE Checkout (
    checkoutID INT(11) UNIQUE NOT NULL AUTO_INCREMENT,
    userID INT(11) NOT NULL,
    eventID INT(11) NOT NULL,
    ticketID INT(11) NOT NULL,
    quantity INT(11) NOT NULL,
    discountID INT(11),
    purchaseDate DATETIME NOT NULL,
    PRIMARY KEY (checkoutID),
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (eventID) REFERENCES Events(eventID),
    FOREIGN KEY (ticketID) REFERENCES Tickets(ticketID),
    FOREIGN KEY (discountID) REFERENCES Discounts(discountID)
);

DROP TABLE IF EXISTS Events;

CREATE TABLE Events (
    eventID INT(11) UNIQUE NOT NULL AUTO_INCREMENT,
    eventName VARCHAR(255),
    eventDescription VARCHAR(255),
    eventLocation VARCHAR(255) NOT NULL,
    organizerID INT(11) NOT NULL,
    startDate DATETIME NOT NULL,
    endDate DATETIME NOT NULL,
    openForTicket DATETIME NOT NULL,
    closeForTicket DATETIME NOT NULL,
    eventStatus VARCHAR(20),
    PRIMARY KEY (eventID),
    FOREIGN KEY (organizerID) REFERENCES Users(userID)
);

INSERT INTO Events (eventName, eventDescription, eventLocation, organizerID, startDate, endDate, openForTicket, 
    closeForTicket, eventStatus) VALUES
    ('Worlds 2024', 'League of Legends finals', 'Beijing', 1, '2024-10-23', '2024-11-23', '2024-06-13', '2024-09-15','');

INSERT INTO Events (eventName, eventDescription, eventLocation, organizerID, startDate, endDate, openForTicket, 
    closeForTicket, eventStatus) VALUES
    ('World Cup 2022', 'Football event', 'Qatar', 2, '2022-11-19', '2022-12-18', '2019-06-13', '2024-09-15', '');

INSERT INTO Events (eventName, eventDescription, eventLocation, organizerID, startDate, endDate, openForTicket, 
    closeForTicket, eventStatus) VALUES
    ('EPL 2025', 'Football event', 'UK', 2, '2025-08-20', '2026-05-18', '2025-04-03', '2026-05-16', '');

INSERT INTO Events (eventName, eventDescription, eventLocation, organizerID, startDate, endDate, openForTicket, 
    closeForTicket, eventStatus) VALUES
    ('NTPMM', 'Concert event', 'Hanoi', 1, '2024-08-20', '2024-08-20', '2025-03-03', '2026-08-16', '');


DROP TABLE IF EXISTS Tickets;

CREATE TABLE Tickets (
    ticketID INT(11) UNIQUE NOT NULL AUTO_INCREMENT,
    eventID INT(11) NOT NULL,
    ticketType VARCHAR(20),
    price DECIMAL(10, 3),
    total INT(11),
    sold INT(11),
    PRIMARY KEY (ticketID),
    FOREIGN KEY (eventID) REFERENCES Events(eventID)
);

INSERT INTO Tickets (eventID, ticketType, price, total, sold) 
    VALUES (2, 'VIP', 1500, 1000, 0);
INSERT INTO Tickets (eventID, ticketType, price, total, sold) 
    VALUES (1, 'VIP', 1200, 1000, 0);
INSERT INTO Tickets (eventID, ticketType, price, total, sold) 
    VALUES (3, 'Normal', 1500, 1000, 0);
INSERT INTO Tickets (eventID, ticketType, price, total, sold) 
    VALUES (2, 'Prem', 1000, 1000, 0);
INSERT INTO Tickets (eventID, ticketType, price, total, sold) 
    VALUES (4, 'VIP', 200, 1000, 0);

CREATE TABLE Feedbacks (
    feedbackID INT(11) UNIQUE NOT NULL AUTO_INCREMENT,
    userID INT(11) NOT NULL,
    eventID INT(11) NOT NULL,
    feedbackContent VARCHAR(255) NOT NULL,
    feedbackType VARCHAR(30) NOT NULL,
    rating DECIMAL(10,2),
    repsonseTo INT(11),
    PRIMARY KEY (feedbackID),
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (eventID) REFERENCES Events(eventID)
);

INSERT INTO Feedbacks (userID, eventID, feedbackContent, feedbackType, rating, repsonseTo) VALUES (3, 1, 'Good', 'rating', 8.8, NULL);
INSERT INTO Feedbacks (userID, eventID, feedbackContent, feedbackType, rating, repsonseTo) VALUES (2, 1, 'Okay', 'rating', 6.8, NULL);

DROP TABLE IF EXISTS Discounts;

CREATE TABLE Discounts (
    discountID INT(11) UNIQUE NOT NULL AUTO_INCREMENT,
    ticketID INT(11) NOT NULL,
    discountName VARCHAR(255),
    discountPercent DECIMAL(5, 2),
    discountDescription TEXT,
    discountStartDate DATETIME,
    discountEndDate DATETIME,
    PRIMARY KEY (discountID),
    FOREIGN KEY (ticketID) REFERENCES Tickets(ticketID)
);

INSERT INTO Discounts (ticketID, discountName, discountPercent, discountDescription, discountStartDate, discountEndDate) 
    VALUES (1, 'Early Bird', 10.00, '10% off for early bookings', '2022-01-01', '2022-01-31');
