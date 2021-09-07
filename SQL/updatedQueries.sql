-- ranking the customers based off of their total purchases

select DISTINCT(customers.customer_id),CONCAT(customers.first_name,' ',customers.last_name),`order`.order_id,`order`.total_price,order_items.product_quantity 
from `order`
left join customers on `order`.customer_id = customers.customer_id
left join order_items on `order`.order_id = order_items.order_id
group by customers.customer_id
order by `order`.total_price desc;


-- ranking the customers over total quantity of items purchased
select DISTINCT(customers.customer_id),CONCAT(customers.first_name,' ',customers.last_name),`order`.order_id,`order`.total_price,order_items.product_quantity 
from `order`
left join customers on `order`.customer_id = customers.customer_id
left join order_items on `order`.order_id = order_items.order_id
group by customers.customer_id
order by order_items.product_quantity desc;

-- can we see how many customers are in the DB?
SELECT COUNT(customer_id) 
FROM customers;

-- what city is every customer from?
SELECT first_name, last_name, city
FROM customers;

-- what are our unique locations our users are from?
select DISTINCT concat(first_name,' ',last_name) as Fullname, city FROM customers; 

-- are people in the db more than once?
SELECT DISTINCT first_name, last_name
FROM customers;


-- shipping based
SELECT status FROM order_tracking.`order` WHERE status='Open';
SELECT status FROM order_tracking.`order` WHERE status='Closed';


-- show orders prior to shipping so the customer can change the order
SELECT status, notes FROM order_tracking.`order` WHERE status='Draft' OR status='Open' OR status='Preparing';

-- shows all shipping orders
SELECT status, order_id FROM order_tracking.`order` WHERE status='Draft' OR status='Open' OR status='Preparing' OR status='Shipped';

-- orders that are currently shipped
SELECT status FROM order_tracking.`order` WHERE status='Shipped';


-- price of item compared to quantity sold
SELECT price, product_quantity FROM order_tracking.`order`
INNER JOIN order_items ON order_items.order_id = order_items.order_id  
ORDER BY product_quantity, price DESC; 

-- unique customer list, for marketing stuntss
email address
-- home address
-- phone number
select DISTINCT concat(first_name,' ',last_name) as Fullname, concat(house_number,' ',street,', ',zip,' ',country) as Address, 
customers.phone, login.email 
from customers
INNER JOIN login ON customers.user_id = login.user_id;

-- view entire customer profile including their information and their login info

select concat(customers.first_name,' ',customers.last_name) as fullName, login.user_id,login.email,customers.phone,login.username,login.`password`, login.role from login
left join customers on login.user_id=customers.user_id;

-- count the numb of cities customers are from

SELECT DISTINCT COUNT(city) FROM customers;