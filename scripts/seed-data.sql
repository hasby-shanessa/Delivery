-- Insert sample users
INSERT INTO users (email, password_hash, first_name, last_name, phone, email_verified) VALUES
('john.doe@example.com', '$2b$10$example_hash_1', 'John', 'Doe', '+1234567890', true),
('jane.smith@example.com', '$2b$10$example_hash_2', 'Jane', 'Smith', '+1234567891', true),
('mike.johnson@example.com', '$2b$10$example_hash_3', 'Mike', 'Johnson', '+1234567892', true);

-- Insert sample restaurants
INSERT INTO restaurants (name, slug, description, cuisine_type, phone, email, image_url, rating, review_count, delivery_fee, minimum_order, delivery_time_min, delivery_time_max, is_featured) VALUES
('Bella Italia', 'bella-italia', 'Authentic Italian cuisine with fresh ingredients and traditional recipes', 'Italian', '+1555123001', 'info@bellaitalia.com', '/placeholder.svg?height=200&width=300', 4.8, 324, 2.99, 15.00, 25, 35, true),
('Sushi Master', 'sushi-master', 'Fresh sushi and Japanese cuisine prepared by master chefs', 'Japanese', '+1555123002', 'info@sushimaster.com', '/placeholder.svg?height=200&width=300', 4.9, 567, 3.99, 20.00, 30, 40, true),
('Burger Palace', 'burger-palace', 'Gourmet burgers and American classics', 'American', '+1555123003', 'info@burgerpalace.com', '/placeholder.svg?height=200&width=300', 4.6, 892, 1.99, 10.00, 20, 30, false),
('Spice Garden', 'spice-garden', 'Authentic Indian cuisine with aromatic spices', 'Indian', '+1555123004', 'info@spicegarden.com', '/placeholder.svg?height=200&width=300', 4.7, 445, 2.49, 12.00, 35, 45, true);

-- Insert restaurant addresses
INSERT INTO restaurant_addresses (restaurant_id, street_address, city, state, zip_code, latitude, longitude) VALUES
(1, '123 Italian Way', 'New York', 'NY', '10001', 40.7128, -74.0060),
(2, '456 Sushi Street', 'New York', 'NY', '10002', 40.7589, -73.9851),
(3, '789 Burger Blvd', 'New York', 'NY', '10003', 40.7505, -73.9934),
(4, '321 Spice Lane', 'New York', 'NY', '10004', 40.7074, -74.0113);

-- Insert restaurant hours (Monday to Sunday for each restaurant)
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time) VALUES
-- Bella Italia
(1, 1, '11:00', '22:00'), (1, 2, '11:00', '22:00'), (1, 3, '11:00', '22:00'), 
(1, 4, '11:00', '22:00'), (1, 5, '11:00', '23:00'), (1, 6, '11:00', '23:00'), (1, 0, '12:00', '21:00'),
-- Sushi Master
(2, 1, '12:00', '22:00'), (2, 2, '12:00', '22:00'), (2, 3, '12:00', '22:00'), 
(2, 4, '12:00', '22:00'), (2, 5, '12:00', '23:00'), (2, 6, '12:00', '23:00'), (2, 0, '12:00', '21:00'),
-- Burger Palace
(3, 1, '10:00', '23:00'), (3, 2, '10:00', '23:00'), (3, 3, '10:00', '23:00'), 
(3, 4, '10:00', '23:00'), (3, 5, '10:00', '24:00'), (3, 6, '10:00', '24:00'), (3, 0, '11:00', '22:00'),
-- Spice Garden
(4, 1, '11:30', '22:00'), (4, 2, '11:30', '22:00'), (4, 3, '11:30', '22:00'), 
(4, 4, '11:30', '22:00'), (4, 5, '11:30', '22:30'), (4, 6, '11:30', '22:30'), (4, 0, '12:00', '21:30');

-- Insert menu categories
INSERT INTO menu_categories (restaurant_id, name, description, sort_order) VALUES
-- Bella Italia categories
(1, 'Appetizers', 'Start your meal with our delicious appetizers', 1),
(1, 'Pasta', 'Fresh pasta made daily', 2),
(1, 'Pizza', 'Wood-fired pizzas with authentic toppings', 3),
(1, 'Desserts', 'Traditional Italian desserts', 4),
-- Sushi Master categories
(2, 'Appetizers', 'Japanese starters and small plates', 1),
(2, 'Sushi Rolls', 'Fresh sushi rolls', 2),
(2, 'Sashimi', 'Fresh raw fish', 3),
(2, 'Hot Dishes', 'Cooked Japanese dishes', 4),
-- Burger Palace categories
(3, 'Burgers', 'Gourmet burgers made fresh', 1),
(3, 'Sides', 'Fries, onion rings, and more', 2),
(3, 'Drinks', 'Beverages and shakes', 3),
-- Spice Garden categories
(4, 'Appetizers', 'Indian starters and snacks', 1),
(4, 'Curries', 'Traditional Indian curries', 2),
(4, 'Rice & Biryani', 'Aromatic rice dishes', 3),
(4, 'Breads', 'Fresh naan and other breads', 4);

-- Insert menu items
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url, is_popular, preparation_time, calories, dietary_tags) VALUES
-- Bella Italia items
(1, 1, 'Bruschetta', 'Grilled bread topped with fresh tomatoes, garlic, and basil', 8.99, '/placeholder.svg?height=100&width=100', true, 10, 180, ARRAY['vegetarian']),
(1, 1, 'Calamari Rings', 'Crispy fried squid rings served with marinara sauce', 12.99, '/placeholder.svg?height=100&width=100', false, 15, 320, ARRAY[]::text[]),
(1, 2, 'Spaghetti Carbonara', 'Classic pasta with eggs, cheese, pancetta, and black pepper', 16.99, '/placeholder.svg?height=100&width=100', true, 20, 650, ARRAY[]::text[]),
(1, 2, 'Fettuccine Alfredo', 'Creamy pasta with parmesan cheese and butter', 15.99, '/placeholder.svg?height=100&width=100', false, 18, 580, ARRAY['vegetarian']),
(1, 3, 'Margherita Pizza', 'Fresh mozzarella, tomato sauce, and basil', 14.99, '/placeholder.svg?height=100&width=100', true, 25, 420, ARRAY['vegetarian']),
(1, 3, 'Pepperoni Pizza', 'Classic pepperoni with mozzarella cheese', 17.99, '/placeholder.svg?height=100&width=100', false, 25, 520, ARRAY[]::text[]),

-- Sushi Master items
(2, 5, 'Edamame', 'Steamed soybeans with sea salt', 5.99, '/placeholder.svg?height=100&width=100', false, 5, 120, ARRAY['vegan', 'gluten-free']),
(2, 5, 'Gyoza', 'Pan-fried pork dumplings', 8.99, '/placeholder.svg?height=100&width=100', true, 12, 240, ARRAY[]::text[]),
(2, 6, 'California Roll', 'Crab, avocado, and cucumber', 12.99, '/placeholder.svg?height=100&width=100', true, 15, 280, ARRAY[]::text[]),
(2, 6, 'Spicy Tuna Roll', 'Spicy tuna with cucumber and avocado', 14.99, '/placeholder.svg?height=100&width=100', true, 15, 320, ARRAY[]::text[]),

-- Burger Palace items
(3, 9, 'Classic Burger', 'Beef patty with lettuce, tomato, and onion', 12.99, '/placeholder.svg?height=100&width=100', true, 15, 580, ARRAY[]::text[]),
(3, 9, 'Bacon Cheeseburger', 'Beef patty with bacon, cheese, lettuce, and tomato', 15.99, '/placeholder.svg?height=100&width=100', true, 18, 720, ARRAY[]::text[]),
(3, 10, 'French Fries', 'Crispy golden fries', 4.99, '/placeholder.svg?height=100&width=100', false, 8, 320, ARRAY['vegan']),
(3, 10, 'Onion Rings', 'Beer-battered onion rings', 6.99, '/placeholder.svg?height=100&width=100', false, 10, 380, ARRAY['vegetarian']),

-- Spice Garden items
(4, 12, 'Samosas', 'Crispy pastries filled with spiced potatoes', 6.99, '/placeholder.svg?height=100&width=100', true, 12, 220, ARRAY['vegetarian', 'vegan']),
(4, 12, 'Chicken Tikka', 'Marinated chicken pieces grilled in tandoor', 9.99, '/placeholder.svg?height=100&width=100', true, 20, 280, ARRAY['gluten-free']),
(4, 13, 'Butter Chicken', 'Creamy tomato-based chicken curry', 18.99, '/placeholder.svg?height=100&width=100', true, 25, 420, ARRAY['gluten-free']),
(4, 13, 'Palak Paneer', 'Spinach curry with cottage cheese', 16.99, '/placeholder.svg?height=100&width=100', false, 22, 350, ARRAY['vegetarian', 'gluten-free']);

-- Insert sample promotions
INSERT INTO promotions (title, description, code, discount_type, discount_value, minimum_order_amount, valid_from, valid_until, applicable_restaurants) VALUES
('Free Delivery Weekend', 'Get free delivery on all orders above $25', 'FREEDEL', 'free_delivery', 0.00, 25.00, '2024-01-01', '2024-12-31', ARRAY[]::integer[]),
('20% Off First Order', 'New customers get 20% off their first order', 'WELCOME20', 'percentage', 20.00, 15.00, '2024-01-01', '2024-12-31', ARRAY[]::integer[]),
('Bella Italia Special', '15% off all orders from Bella Italia', 'BELLA15', 'percentage', 15.00, 20.00, '2024-01-01', '2024-06-30', ARRAY[1]);

-- Insert sample admin user
INSERT INTO admin_users (email, password_hash, first_name, last_name, role) VALUES
('admin@foodieexpress.com', '$2b$10$example_admin_hash', 'Admin', 'User', 'super_admin');
