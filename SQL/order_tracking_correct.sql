#======================================================DB setup=====================================================================

CREATE DATABASE if NOT EXISTS `order_tracking`;

USE `order_tracking`;

#======================================================Creates the tables=====================================================================

create table if NOT EXISTS `login`
(
    `user_id` int NOT NULL auto_increment,
    `email` varchar(255) NOT NULL,
    `username` varchar(50) NOT NULL,
    `password` varchar(255) NOT NULL,
	`role` varchar(20) NOT NULL,
    PRIMARY KEY (`user_id`)
);

create table if not exists`customers`
(
    `customer_id` int NOT NULL auto_increment,
    `first_name` varchar(50) NOT NULL,
	`middle_name` varchar(50),
    `last_name` varchar(50) NOT NULL,
    `phone` varchar(11)NOT NULL,
    `customer_notes` text,
	`user_id` int(11) NOT NULL,
	`state` varchar(5) NOT NULL,
	`city` varchar(25) NOT NULL,
	`street` varchar(45) DEFAULT NULL,
	`house_number` int(10) DEFAULT NULL,
	`zip` varchar(6) DEFAULT NULL,
	`country` varchar(4) DEFAULT NULL,
	PRIMARY KEY (`customer_id`),
    FOREIGN KEY (`user_id`) REFERENCES `login`(`user_id`)
);
    
    
-- alter table `customers` add CONSTRAINT `fk_user_id` foreign key (`user_id`) REFERENCES `login`(`user_id`);

create table if not exists`order`
(
	`order_id` int(11) NOT NULL auto_increment,
	`customer_id` int(11) DEFAULT NULL,
	`status` char(50) DEFAULT NULL,
	`datetime` datetime DEFAULT NULL,
	`total_price` decimal(10,2) DEFAULT NULL,
	`notes` text,
	`received` tinyint(1) DEFAULT NULL,
	PRIMARY KEY (`order_id`),
    FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`)
);

-- alter table `order` add CONSTRAINT `fk1_customer_id` foreign key (`customer_id`) REFERENCES `customers`(`customer_id`);

create table if not exists`products`
(
    `product_id` int not null auto_increment,
    `sku` varchar(50),
    `price` decimal(10,2),
    `name` varchar(50),
    `total_quantity` int,
    `description` text,
    PRIMARY KEY (`product_id`)
);

create table if not exists `order_items`
(
    `order_id` int  DEFAULT NULL,
    `product_id` int DEFAULT NULL,
    `product_quantity` int DEFAULT NULL,
	`price` decimal(10,2) DEFAULT NULL,
    FOREIGN KEY (`order_id`) REFERENCES `order`(`order_id`),
    FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`)
);