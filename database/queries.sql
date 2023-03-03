create database NILE;

CREATE TABLE `NILE`.`USERS` (
  `FirstName` VARCHAR(45) NOT NULL,
  `LastName` VARCHAR(45) NOT NULL,
  `Username` VARCHAR(45) NOT NULL,
  `Password` VARCHAR(45) NOT NULL,
  `Role` VARCHAR(10) NOT NULL,
  `TimeStamp` DATETIME NULL,
  `UserId` VARCHAR(10) NOT NULL,
  `SecurityQuestion` VARCHAR(100) NOT NULL,
  `Answer` VARCHAR(30) NOT NULL,
  `ProfilePic` LONGTEXT ,
  PRIMARY KEY (`Username`, `UserId`),
  UNIQUE INDEX `Username_UNIQUE` (`Username` ASC) ,
  UNIQUE INDEX `UserId_UNIQUE` (`UserId` ASC) );
  
CREATE TABLE `NILE`.`AdminDetails` (
  `username` VARCHAR(20) NOT NULL,
  `userid` VARCHAR(20) NULL,
  `FirstName` VARCHAR(45) NULL,
  `LastName` VARCHAR(45) NULL,
  `Role` VARCHAR(10) NULL,
  `Verified` VARCHAR(10) NULL,
  PRIMARY KEY (`username`));
  
ALTER TABLE `NILE`.`AdminDetails` 
ADD CONSTRAINT `username`
  FOREIGN KEY (`username`)
  REFERENCES `NILE`.`USERS` (`Username`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;
  
--This is the trigger which inserts all the new admins registered into this table.
DROP TRIGGER IF EXISTS `NILE`.`USERS_AFTER_INSERT`;

DELIMITER $$
USE `NILE`$$
CREATE DEFINER = CURRENT_USER TRIGGER `NILE`.`USERS_AFTER_INSERT` AFTER INSERT ON `USERS` FOR EACH ROW
BEGIN
	IF NEW.role = 'admin' OR NEW.role="Admin" OR NEW.role = "ADMIN" THEN
		INSERT INTO NILE.AdminDetails(username,userid,FirstName,LastName,Role,verified) Values(NEW.username,NEW.userid,NEW.FirstName,NEW.LastName,NEW.Role,NULL);
	END IF;
END$$
DELIMITER ;

CREATE TABLE `NILE`.`Employees` (
  `FullName` VARCHAR(50) NOT NULL,
  `Role` VARCHAR(10) NULL,
  PRIMARY KEY (`FullName`));

ALTER TABLE `NILE`.`Employees` 
ADD COLUMN `Available` VARCHAR(45),
ADD COLUMN `email` VARCHAR(45);

CREATE TABLE `NILE`.`Deliveryservices` (
  `ServiceName` VARCHAR(50) NOT NULL,
  `Price` INT NULL,
  `Duration` VARCHAR(20) NULL,
  `Description` LONGTEXT NULL,
  `Picture` LONGTEXT NULL,
  PRIMARY KEY (`ServiceName`));


create TABLE `NILE`.`Orders` (
`OrderId` INT AUTO_INCREMENT PRIMARY KEY,
`OrderPlacedDate` varchar(255),
`SenderName` varchar(255),
`SenderEmail` varchar(255),
`PickUpAddress` LONGTEXT,
`SenderMobile` BIGINT,
`RecieverName` varchar(255),
`RecieverEmail` varchar(255),
`DestinationAddress` LONGTEXT,
`RecieverMobile` BIGINT,
`Weight` INT,
`Length` INT,
`Width` INT,
`Height` INT,
`EstimatedDeliveryDate` varchar(255),
`ServiceType` varchar(255),
`Price` FLOAT,
`TrackingId` varchar(255),
`Rating` int,
`Review` longtext,
`DeliveryDriver` varchar(255),
`Status` varchar(255),
`DeliveryHours` FLOAT
);

CREATE TABLE `NILE`.`Shipment` (
  `Shipment_id` INT AUTO_INCREMENT,
  `Sender_FirstName` VARCHAR(100) NOT NULL,
  `Sender_LastName` VARCHAR(45) NOT NULL,
  `Sender_email` VARCHAR(45) NOT NULL,
  `Sender_Address` VARCHAR(255) NOT NULL,
  `Sender_Mobile` VARCHAR(45) NOT NULL,
  `Reciever_FirstName` VARCHAR(45) NOT NULL,
  `Reciever_LastName` VARCHAR(45) NOT NULL,
  `Reciever_email` VARCHAR(45) NOT NULL,
  `Reciever_Address` VARCHAR(255) NOT NULL,
  `Reciever_Mobile` VARCHAR(45) NOT NULL,
  `Rating` INT;
  `Review` LONGTEXT;
  `Status` VARCHAR(30),
  PRIMARY KEY (`Shipment_id`));

  CREATE TABLE `NILE`.`Messages` (
  `SenderEmail` VARCHAR(255) NULL,
  `SenderMessage` LONGTEXT NULL,
  `SenderTimeStamp` DATETIME NULL,
  `ReplyEmail` VARCHAR(255) NULL,
  `ReplyMessage` LONGTEXT NULL);

  CREATE TABLE `NILE`.`MESSAGES_USERS` (
  `SenderId` VARCHAR(255) NOT NULL,
  `SenderName` VARCHAR(255) NULL,
  `SenderEmail` VARCHAR(255) NULL,
  `Role` VARCHAR(30) NULL,
  PRIMARY KEY (`SenderId`));

  CREATE TABLE `NILE`.`StoresLocation` (
  `storeName` VARCHAR(255) NOT NULL,
  `storeTimings` VARCHAR(255) NULL,
  `storeAddress` LONGTEXT NULL,
  `storeLat` FLOAT NULL,
  `storeLon` FLOAT NULL,
  `zipcode` INT NULL);


 CREATE TABLE `NILE`.`AssignedOrders` (
  `OrderId` int,
`DeliveryDriver` varchar(255)
);