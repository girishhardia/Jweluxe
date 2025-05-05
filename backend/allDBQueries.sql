CREATE TABLE admin(
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
);
--------------------------------------------------------------------------------------------
CREATE TABLE `category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL UNIQUE,
  `category_description` varchar(255) NOT NULL,
  PRIMARY KEY (`category_id`),
  createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO `category`(`category_name`, `category_description`)
VALUES ('Necklaces', 'Various necklace designs'),
('Rings', 'Different ring styles'),
('Earrings', 'Various earring types'),
('Bracelets', 'Different bracelet styles'),
('Watches', 'Various watch designs');
----------------------------------------------------------------------
CREATE TABLE `offer` (
  `offer_id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `offer_name` varchar(255) NOT NULL,
  `offer_price` double NOT NULL,
  `offer_percentage` double NOT NULL,
  createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO offer(`offer_name`, `offer_price`, `offer_percentage`)
VALUES
  ('Summer Sale', 500.00, 20.0),
  ('Holiday Discount', 1000.00, 15.0),
  ('Flash Sale', 200.00, 10.0),
  ('Clearance Sale', 800.00, 25.0),
  ('Special Promotion', 300.00, 5.0);
---------------------------------------------------------------------
CREATE TABLE `jewellery` (
  `jewellery_id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `category_id` int DEFAULT NULL,
  `jewellery_name` varchar(255) NOT NULL,
  `isAvailable` tinyint NOT NULL,
  `is_offer_available` tinyint NOT NULL,
  `offer_id` int DEFAULT NULL,
  `stock_qty` int NOT NULL,
   createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`offer_id`) REFERENCES `offer` (`offer_id`) ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO jewellery(`category_id`, `jewellery_name`, `isAvailable`, `is_offer_available`, `offer_id`,`stock_qty`)
VALUES
  (1, 'Gold Necklace', 1, 1, 1, 10),
  (1, 'Silver Necklace',1, 1, 1, 10),
  (2, 'Diamond Ring',1, 1, 2, 5),
  (2, 'Gold Ring',1, 1, 2, 7),
  (3, 'Pearl Earrings',1, 1, 3, 8),
  (3, 'Diamond Stud Earrings',1, 1, 3, 5),
  (4, 'Silver Bracelet',1, 0, 4, 12),
  (4, 'Beaded Bracelet',1, 1, 4, 20),
  (5, 'Leather Strap Watch',1, 0, 5, 15),
  (5, 'Metal Strap Watch',1, 1, 5, 18);
-----------------------------------------------------------------------------------
CREATE TABLE `jewellery_details` (
  `jewellery_details_id` int NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `jewellery_id` int DEFAULT NULL,
  `color` varchar(45) NOT NULL,
  `jewellery_description` varchar(255) NOT NULL,
  `jewellery_image` varchar(255) NULL,
  `jewellery_price` double NOT NULL,
  createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (jewellery_id) REFERENCES jewellery (jewellery_id) ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO jewellery_details(jewellery_id,jewellery_description,jewellery_image,jewellery_price)
VALUES
  (1, 'Elegant gold necklace', 'gold_necklace.jpg',55000),
  (1, 'Elegant silver necklace', 'silver_necklace.jpg', 35000),
  (2, 'Stunning diamond ring', 'diamond_ring.jpg',100000),
  (2, 'Classic gold ring', 'gold_ring.jpg', 80000),
  (3, 'Classic pearl earrings', 'pearl_earrings.jpg', 152650 ),
  (3, 'Sparkling diamond stud earrings', 'diamond_earrings.jpg', 628690),
  (4,'Beautiful silver bracelet', 'silver_bracelet.jpg', 300156),
  (4,'Colorful beaded bracelet', 'beaded_bracelet.jpg', 35500),
  (5, 'Stylish watch with leather strap', 'leather_watch.jpg', 40058),
  ( 5, 'Sleek metal strap watch', 'metal_watch.jpg', 25086);
---------------------------------------------------------------------------------------------------------------------
CREATE TABLE `customer` (
  `customer_id` int PRIMARY KEY AUTO_INCREMENT,
   firstName VARCHAR(20),
   lastName VARCHAR(20),
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `mobileNo` varchar(45),
  `gender` varchar(45),
   profileImage VARCHAR(100),
  createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO customer(firstName,lastName,`email`,`password`,`mobileNo`,`gender`,profileImage)
VALUES
  ('John', 'Smith', 'johnsmith@example.com', 'password123','1234567890', 'Male','john.jpg'),
  ('Emily','Johnson', 'emilyjohnson@example.com', 'password456','9876543210', 'Female','emily.jpg'),
  ('Michael','Williams', 'michaelwilliams@example.com', 'password789','5555555555', 'Male','michael.jpg'),
  ('Olivia', 'Jones', 'oliviajones@example.com', 'passwordabc','9999999999', 'Female','olivia.jpg'),
  ('James', 'Brown', 'jamesbrown@example.com', 'passworddef','1111111111', 'Male','james.jpg');
-----------------------------------------------------------------------------------------------------------------------
CREATE TABLE `cart` (
  `cart_id` int PRIMARY KEY AUTO_INCREMENT,
  `customer_id` int,
  `jewellery_id` int,
  `qty` int DEFAULT NULL,
   price DECIMAL(10, 2),
  createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`),
  FOREIGN KEY (`jewellery_id`) REFERENCES `jewellery` (`jewellery_id`) ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO cart(`customer_id`,jewellery_id, `qty`,price)
VALUES
  (1, 2,1, 35000),
  (2, 1,1,55000),
  (3, 3,2,200000),
  (4, 6,1,628690),
  (5, 2,1,35000);
----------------------------------------------------------------------------------------------------------------------
CREATE TABLE `orders` (
  `order_id` int PRIMARY KEY AUTO_INCREMENT,
  `customer_id` int,
  `jewellery_id` int,
   order_date datetime,
  `order_total` DECIMAL(10, 2),
  `shipping_date` datetime,
  `shipping_address` varchar(255),
  createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`),
  FOREIGN KEY (`jewellery_id`) REFERENCES `jewellery` (`jewellery_id`)
);
INSERT INTO orders(`customer_id`,jewellery_id,`order_total`,`order_date`,`shipping_address`,`shipping_date`)
VALUES
  (1, 1, 55000, now(), '1234 Main St, CityA',DATE_add(order_date,INTERVAL 5 DAY)),
  (2, 2,35000, '2023-06-20', '5678 Elm St, CityB',DATE_add(order_date,INTERVAL 5 DAY)),
  (3, 3,100000, now(), '7890 Oak St, CityC',DATE_add(order_date,INTERVAL 5 DAY)),
  (4, 4,80000, '2023-06-22', '4321 Maple St, CityD',DATE_add(order_date,INTERVAL 5 DAY)),
  (5, 5,152650, '2023-06-23', '5678 Pine St, CityE',DATE_add(order_date,INTERVAL 5 DAY));
----------------------------------------------------------------------------------------------------------------------------
