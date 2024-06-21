DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    userID INT(11) UNIQUE NOT NULL AUTO_INCREMENT,
    userName VARCHAR(255) UNIQUE NOT NULL ,
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
                    ('mhuyhcmus', 'pbkdf2:sha256:150000$G365080U$4a8509d6142e2b6374c75593bfbaf2db5a05cbed41bc3265f1a8e9b9a4fcdc37',
                        'Hoang Minh', 'Huy', 'huyhoang.hhm@gmail.com', '', '', '2024-06-13', FALSE, TRUE, FALSE);

INSERT INTO Users (userName, password, firstName, lastName, email, phoneNumber, bankAccount, dateJoined, isGuest, isEnterprise, isAdmin) VALUES
                    ('haingo', 'pbkdf2:sha256:150000$G365080U$4a8509d6142e2b6374c75593bfbaf2db5a05cbed41bc3265f1a8e9b9a4fcdc37',
                        'Ngo', 'Hai', 'thanhhai.123@gmail.com', '', '', '2024-06-13', TRUE, FALSE, FALSE);

INSERT INTO Users (userName, password, firstName, lastName, email, phoneNumber, bankAccount, dateJoined, isGuest, isEnterprise, isAdmin) VALUES
                    ('danghuy', 'pbkdf2:sha256:150000$G365080U$4a8509d6142e2b6374c75593bfbaf2db5a05cbed41bc3265f1a8e9b9a4fcdc37',
                        'Do Dang', 'Huy', 'danghuy.hhm@gmail.com', '', '', '2024-06-13', TRUE, FALSE, FALSE);

INSERT INTO Users (userName, password, firstName, lastName, email, phoneNumber, bankAccount, dateJoined, isGuest, isEnterprise, isAdmin) VALUES
                    ('admin', 'pbkdf2:sha256:150000$G365080U$4a8509d6142e2b6374c75593bfbaf2db5a05cbed41bc3265f1a8e9b9a4fcdc37',
                        'admin', '', 'admin@gmail.com', '', '', '2024-06-13', FALSE, FALSE, TRUE);

INSERT INTO Users (userName, password, firstName, lastName, email, phoneNumber, bankAccount, dateJoined, isGuest, isEnterprise, isAdmin) VALUES
                    ('fifa', 'pbkdf2:sha256:150000$G365080U$4a8509d6142e2b6374c75593bfbaf2db5a05cbed41bc3265f1a8e9b9a4fcdc37',
                        'FIFA', '', 'fifa@gmail.com', '', '', '2024-06-13', FALSE, TRUE, FALSE);


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
	totalTicket INT(11) NOT NULL,
    availableTicket INT(11) NOT NULL,
    PRIMARY KEY (eventID),
    FOREIGN KEY (organizerID) REFERENCES Users(userID)
);

INSERT INTO Events (eventName, eventDescription, eventLocation, organizerID, startDate, endDate, openForTicket, 
    closeForTicket, totalTicket, availableTicket) VALUES
    ('Worlds 2024', 'League of Legends finals', 'Beijing', 1, '2024-10-23', '2024-11-23', '2024-06-13', '2024-09-15', 400, 200);

INSERT INTO Events (eventName, eventDescription, eventLocation, organizerID, startDate, endDate, openForTicket, 
    closeForTicket, totalTicket, availableTicket) VALUES
    ('World Cup 2022', 'Football event', 'Qatar', 2, '2022-11-19', '2022-12-18', '2019-06-13', '2024-09-15', 10000, 8);

INSERT INTO Events (eventName, eventDescription, eventLocation, organizerID, startDate, endDate, openForTicket, 
    closeForTicket, totalTicket, availableTicket) VALUES
    ('EPL 2025', 'Football event', 'UK', 2, '2025-08-20', '2026-05-18', '2025-04-03', '2026-05-16', 100000, 100000);

INSERT INTO Events (eventName, eventDescription, eventLocation, organizerID, startDate, endDate, openForTicket, 
    closeForTicket, totalTicket, availableTicket) VALUES
    ('NTPMM', 'Concert event', 'Hanoi', 1, '2024-08-20', '2024-08-20', '2025-03-03', '2026-08-16', 25000, 10000);


DROP TABLE IF EXISTS Tickets;

CREATE TABLE Tickets (
    ticketID INT(11) UNIQUE NOT NULL AUTO_INCREMENT,
    eventID INT(11) NOT NULL,
    seatID VARCHAR(20),
    tier VARCHAR(20),
    originalPrice DECIMAL(10, 3),
    currency VARCHAR(10),
    _status VARCHAR(50) NOT NULL,
    PRIMARY KEY (ticketID),
    FOREIGN KEY (eventID) REFERENCES Events(eventID)
);

INSERT INTO Tickets (eventID, seatID, tier, originalPrice, currency, _status) 
    VALUES (2, 'A12', 'VIP', 1500,'USD', 'sold');
INSERT INTO Tickets (eventID, seatID, tier, originalPrice, currency, _status) 
    VALUES (2, 'B11', 'Regular', 500, 'USD', 'sold');
INSERT INTO Tickets (eventID, seatID, tier, originalPrice, currency, _status) 
    VALUES (1, 'A10', 'Regular', 20000, 'JPY', 'open');
INSERT INTO Tickets (eventID, seatID, tier, originalPrice, currency, _status) 
    VALUES (4, 'C11', 'C', 200000, 'VND', 'sold');
INSERT INTO Tickets (eventID, seatID, tier, originalPrice, currency, _status) 
    VALUES (4, 'A23', 'A', 600000, 'VND', 'sold');
INSERT INTO Tickets (eventID, seatID, tier, originalPrice, currency, _status) 
    VALUES (3, 'A11', 'VIP', 1200, 'USD', 'expired');


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


CREATE TABLE Discounts (
    discountID INT(11) UNIQUE NOT NULL AUTO_INCREMENT,
    eventID INT(11) NOT NULL,
    discountPercentage DECIMAL(10,2) NOT NULL,
    startDate DATETIME NOT NULL,
    endDate DATETIME NOT NULL,
    _status VARCHAR(20),
    PRIMARY KEY (discountID),
    FOREIGN KEY (eventID) REFERENCES Events(eventID)
);

INSERT INTO Discounts (eventID, discountPercentage, startDate, endDate, _status) VALUES (1, 0.1, '2024-06-01', '2024-06-30', 'on-going');
INSERT INTO Discounts (eventID, discountPercentage, startDate, endDate, _status) VALUES (2, 0.15, '2022-07-01', '2022-07-15', 'expired');
INSERT INTO Discounts (eventID, discountPercentage, startDate, endDate, _status) VALUES (3, 0.1, '2025-05-01', '2025-06-01', 'not started');
INSERT INTO Discounts (eventID, discountPercentage, startDate, endDate, _status) VALUES (3, 0.1, '2025-05-01', '2025-06-01', 'not started');

DROP TABLE IF EXISTS Listings;

CREATE TABLE Listings (
    listingID INT(11) UNIQUE NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    userID INT(11),
    bidID INT(11),
    startDate DATETIME(0) NOT NULL,
    endDate DATETIME(0) NOT NULL,
    countDown INT(11),
    startPrice DECIMAL(10,2) NOT NULL,
    buyNowPrice DECIMAL(10,2),
    description VARCHAR(255),
    quantity INT(11) NOT NULL,
    shippingCosts DECIMAL(10,2) NOT NULL,
    numFlagged INT(11) NOT NULL,
    status ENUM('active', 'hold', 'inactive') NOT NULL,
    PRIMARY KEY (listingID),
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

INSERT INTO Listings (name, userID, bidID, startDate, endDate, startPrice, buyNowPrice, quantity, shippingCosts, numFlagged, status) VALUES
    ('dummy item',1, NULL, '2023-11-29 03:00:00', '2023-12-01 12:00:00', 100.00, 200.00, 1, 10.00, 0, 'active');

DROP TABLE IF EXISTS Bids;

CREATE TABLE Bids (
    bidID INT(11) UNIQUE NOT NULL AUTO_INCREMENT,
    userID INT(11) NOT NULL,
    listingID INT(11) NOT NULL,
    bidAmt DECIMAL(10,2) NOT NULL,
    bidDate DATETIME(0) NOT NULL,
    PRIMARY KEY (bidID),
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (listingID) REFERENCES Listings(listingID)
);

ALTER TABLE Listings
ADD FOREIGN KEY (bidID) REFERENCES Bids(bidID);

INSERT INTO Bids (userID, listingID, bidAmt, bidDate) VALUES
    (1, 1, 150.00, '2023-11-29 04:00:00');

UPDATE Listings SET bidID = 1 WHERE listingID = 1;

DROP TABLE IF EXISTS Photos;

CREATE TABLE Photos (
    photoID INT(11) UNIQUE NOT NULL AUTO_INCREMENT,
    listingID INT(11) NOT NULL,
    photoPath VARCHAR(255) NOT NULL,
    PRIMARY KEY (photoID),
    FOREIGN KEY (listingID) REFERENCES Listings(listingID)
);

INSERT INTO Photos (listingID, photoPath) VALUES
    (1, 'static/img/65-mustang.jpg');

DROP TABLE IF EXISTS Categories;

CREATE TABLE Categories (
                          categoryID INT(11) UNIQUE NOT NULL AUTO_INCREMENT,
                          label VARCHAR(255) UNIQUE NOT NULL,
                          PRIMARY KEY (categoryID)
);

INSERT INTO Categories (label) VALUES
                                      ('Motors'), ('Electrics'), ('Collectibles'), ('Home&Garden'), ('Fashion'),
                                      ('Toys'), ('Sporting Goods'), ('Industrial'), ('Jewelry&Watches');


DROP TABLE IF EXISTS ListingCategory;

CREATE TABLE ListingCategory (
                                  listingID INT(11),
                                  categoryID INT(11),
                                  PRIMARY KEY (listingID, categoryID),
                                  FOREIGN KEY (listingID) REFERENCES Listings(listingID),
                                  FOREIGN KEY (categoryID) REFERENCES Categories(categoryID)
);

INSERT INTO ListingCategory (listingID, categoryID) VALUES
                                                        (1, 1), (1, 2);

DROP TABLE IF EXISTS Watchlists;

CREATE TABLE Watchlists (
                          watchlistID INT(11) UNIQUE NOT NULL AUTO_INCREMENT,
                          userID INT(11),
                          lowerPrice DECIMAL(10,2) NOT NULL,
                          upperPrice DECIMAL(10,2) NOT NULL,
                          keyword VARCHAR(255),
                          PRIMARY KEY (watchlistID),
                          FOREIGN KEY (userID) REFERENCES Users(userID)
);
INSERT INTO Watchlists (userID, lowerPrice, upperPrice, keyword) VALUES
                                                        (1,50.00,200.00,'sunglasses');

DROP TABLE IF EXISTS ShoppingcartRecords;

CREATE TABLE ShoppingcartRecords (
                            shoppingcartRecordID INT(11) UNIQUE NOT NULL AUTO_INCREMENT,
                            userID INT(11),
                            listingID INT(11),
                            dealPrice DECIMAL(10,2) NOT NULL,
                            PRIMARY KEY (shoppingcartRecordID),
                            FOREIGN KEY (userID) REFERENCES Users(userID),
                            FOREIGN KEY (listingID) REFERENCES Listings(listingID)
);