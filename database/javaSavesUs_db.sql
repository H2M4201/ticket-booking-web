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
    type VARCHAR(20),
    price DECIMAL(10, 3),
    total INT(11),
    sold INT(11),
    PRIMARY KEY (ticketID),
    FOREIGN KEY (eventID) REFERENCES Events(eventID)
);

INSERT INTO Tickets (eventID, type, price, total, sold) 
    VALUES (2, 'VIP', 1500, 1000, 0);
INSERT INTO Tickets (eventID, type, price, total, sold) 
    VALUES (1, 'VIP', 1200, 1000, 0);
INSERT INTO Tickets (eventID, type, price, total, sold) 
    VALUES (3, 'Normal', 1500, 1000, 0);
INSERT INTO Tickets (eventID, type, price, total, sold) 
    VALUES (2, 'Prem', 1000, 1000, 0);
INSERT INTO Tickets (eventID, type, price, total, sold) 
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



CREATE TABLE DiscountList (
    discountID INT(11) UNIQUE NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    discountPercentage DECIMAL(5,2) NOT NULL,
    imageUrl VARCHAR(255) NOT NULL,
    PRIMARY KEY (discountID)
);

INSERT INTO DiscountList (name, description, startDate, endDate, discountPercentage, imageUrl) VALUES
    ('Concert A', '50% discount on Concert ABC tickets.', '2024-06-01', '2024-06-30', 50.00, 'https://www.eventbrite.ie/blog/wp-content/uploads/2022/06/special-offers-1.jpg'),
    ('Play XYZ', '30% discount on Play XYZ tickets.', '2024-06-11', '2024-07-15', 30.00, 'https://cdn4.vectorstock.com/i/1000x1000/30/58/banner-super-discount-special-offer-ribbon-vector-19773058.jpg'),
    ('Concert B', '40% discount on Concert B tickets.', '2024-07-01', '2024-07-31', 40.00, 'https://img.pikbest.com/origin/06/13/64/688pIkbEsTCDu.jpg!w700wp'),
    ('Play ABC', '25% discount on Play ABC tickets.', '2024-02-05', '2024-08-10', 25.00, 'https://cdn3.vectorstock.com/i/1000x1000/53/87/modern-event-banner-template-with-degrade-vector-44785387.jpg'),
    ('Musical XYZ', '20% discount on Musical XYZ tickets.', '2024-02-15', '2024-08-15', 20.00, 'https://www.shutterstock.com/shutterstock/photos/1556325578/display_1500/stock-vector-event-background-banner-design-illustration-for-music-performance-festival-party-and-concert-1556325578.jpg'),
    ('Festival A', '15% discount on Festival A tickets.', '2024-03-20', '2024-08-30', 15.00, 'https://img.freepik.com/free-vector/gradient-electronic-music-festival-twitter-header-template_23-2149928189.jpg'),
    ('Exhibition B', '30% discount on Exhibition B tickets.', '2024-03-01', '2024-08-31', 30.00, 'https://img.freepik.com/free-vector/gradient-electronic-music-festival-twitter-header-template_23-2149928189.jpg'),
    ('Dance Show C', '25% discount on Dance Show C tickets.', '2024-04-05', '2024-09-10', 25.00, 'https://img.freepik.com/free-vector/gradient-electronic-music-festival-twitter-header-template_23-2149928189.jpg'),
    ('Opera D', '35% discount on Opera D tickets.', '2024-08-10', '2024-04-15', 35.00, 'https://img.freepik.com/free-vector/gradient-electronic-music-festival-twitter-header-template_23-2149928189.jpg'),
    ('Film Festival', '20% discount on Film Festival tickets.', '2024-05-15', '2024-09-30', 20.00, 'https://img.freepik.com/free-vector/gradient-electronic-music-festival-twitter-header-template_23-2149928189.jpg'),
    ('Comedy Night', '30% discount on Comedy Night tickets.', '2024-05-20', '2024-10-05', 30.00, 'https://img.freepik.com/free-vector/gradient-electronic-music-festival-twitter-header-template_23-2149928189.jpg'),
    ('Art Gallery Exhibit', '15% discount on Art Gallery Exhibit tickets.', '2024-05-25', '2024-10-15', 15.00, 'https://img.freepik.com/free-vector/gradient-electronic-music-festival-twitter-header-template_23-2149928189.jpg');