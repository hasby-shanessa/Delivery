-- Insert sample restaurants
INSERT INTO restaurants (id, name, description, cuisine_type, address, phone, email, rating, review_count, price_range, image_url, cover_image_url, is_featured, delivery_fee, minimum_order, delivery_time_min, delivery_time_max) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Mario''s Pizza Palace', 'Authentic Italian pizza made with fresh ingredients and traditional recipes passed down through generations.', 'Italian', '123 Main St, Downtown', '+1-555-0101', 'info@mariospizza.com', 4.5, 324, '$$', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=200&width=600', true, 2.99, 15.00, 25, 35),
('550e8400-e29b-41d4-a716-446655440002', 'Burger Junction', 'Gourmet burgers made with premium beef and fresh toppings. Home of the famous Junction Burger.', 'American', '456 Oak Ave, Midtown', '+1-555-0102', 'hello@burgerjunction.com', 4.3, 256, '$$', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=200&width=600', true, 3.49, 12.00, 20, 30),
('550e8400-e29b-41d4-a716-446655440003', 'Sakura Sushi', 'Fresh sushi and Japanese cuisine prepared by master chefs using the finest ingredients.', 'Japanese', '789 Pine St, Uptown', '+1-555-0103', 'orders@sakurasushi.com', 4.7, 189, '$$$', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=200&width=600', true, 4.99, 25.00, 35, 50),
('550e8400-e29b-41d4-a716-446655440004', 'Taco Fiesta', 'Authentic Mexican street tacos and traditional dishes made with fresh, locally-sourced ingredients.', 'Mexican', '321 Elm St, Southside', '+1-555-0104', 'info@tacofiesta.com', 4.2, 412, '$', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=200&width=600', false, 2.49, 10.00, 15, 25),
('550e8400-e29b-41d4-a716-446655440005', 'Spice Garden', 'Aromatic Thai cuisine with authentic flavors and fresh herbs. Vegetarian and vegan options available.', 'Thai', '654 Maple Dr, Westside', '+1-555-0105', 'hello@spicegarden.com', 4.4, 298, '$$', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=200&width=600', true, 3.99, 18.00, 30, 40),
('550e8400-e29b-41d4-a716-446655440006', 'Curry House', 'Traditional Indian cuisine with rich flavors and aromatic spices. Family recipes from Mumbai.', 'Indian', '987 Cedar Ln, Eastside', '+1-555-0106', 'orders@curryhouse.com', 4.6, 167, '$$', '/placeholder.svg?height=300&width=400', '/placeholder.svg?height=200&width=600', false, 3.49, 20.00, 40, 55);

-- Insert restaurant hours (Monday to Sunday for each restaurant)
INSERT INTO restaurant_hours (restaurant_id, day_of_week, open_time, close_time, is_closed) VALUES
-- Mario's Pizza Palace
('550e8400-e29b-41d4-a716-446655440001', 0, '11:00', '23:00', false), -- Sunday
('550e8400-e29b-41d4-a716-446655440001', 1, '11:00', '23:00', false), -- Monday
('550e8400-e29b-41d4-a716-446655440001', 2, '11:00', '23:00', false), -- Tuesday
('550e8400-e29b-41d4-a716-446655440001', 3, '11:00', '23:00', false), -- Wednesday
('550e8400-e29b-41d4-a716-446655440001', 4, '11:00', '23:00', false), -- Thursday
('550e8400-e29b-41d4-a716-446655440001', 5, '11:00', '00:00', false), -- Friday
('550e8400-e29b-41d4-a716-446655440001', 6, '11:00', '00:00', false), -- Saturday

-- Burger Junction
('550e8400-e29b-41d4-a716-446655440002', 0, '10:00', '22:00', false),
('550e8400-e29b-41d4-a716-446655440002', 1, '10:00', '22:00', false),
('550e8400-e29b-41d4-a716-446655440002', 2, '10:00', '22:00', false),
('550e8400-e29b-41d4-a716-446655440002', 3, '10:00', '22:00', false),
('550e8400-e29b-41d4-a716-446655440002', 4, '10:00', '22:00', false),
('550e8400-e29b-41d4-a716-446655440002', 5, '10:00', '23:00', false),
('550e8400-e29b-41d4-a716-446655440002', 6, '10:00', '23:00', false),

-- Sakura Sushi
('550e8400-e29b-41d4-a716-446655440003', 0, '17:00', '22:00', false),
('550e8400-e29b-41d4-a716-446655440003', 1, '17:00', '22:00', false),
('550e8400-e29b-41d4-a716-446655440003', 2, '17:00', '22:00', false),
('550e8400-e29b-41d4-a716-446655440003', 3, '17:00', '22:00', false),
('550e8400-e29b-41d4-a716-446655440003', 4, '17:00', '22:00', false),
('550e8400-e29b-41d4-a716-446655440003', 5, '17:00', '23:00', false),
('550e8400-e29b-41d4-a716-446655440003', 6, '17:00', '23:00', false),

-- Taco Fiesta
('550e8400-e29b-41d4-a716-446655440004', 0, '09:00', '21:00', false),
('550e8400-e29b-41d4-a716-446655440004', 1, '09:00', '21:00', false),
('550e8400-e29b-41d4-a716-446655440004', 2, '09:00', '21:00', false),
('550e8400-e29b-41d4-a716-446655440004', 3, '09:00', '21:00', false),
('550e8400-e29b-41d4-a716-446655440004', 4, '09:00', '21:00', false),
('550e8400-e29b-41d4-a716-446655440004', 5, '09:00', '22:00', false),
('550e8400-e29b-41d4-a716-446655440004', 6, '09:00', '22:00', false),

-- Spice Garden
('550e8400-e29b-41d4-a716-446655440005', 0, '12:00', '22:00', false),
('550e8400-e29b-41d4-a716-446655440005', 1, '12:00', '22:00', false),
('550e8400-e29b-41d4-a716-446655440005', 2, '12:00', '22:00', false),
('550e8400-e29b-41d4-a716-446655440005', 3, '12:00', '22:00', false),
('550e8400-e29b-41d4-a716-446655440005', 4, '12:00', '22:00', false),
('550e8400-e29b-41d4-a716-446655440005', 5, '12:00', '23:00', false),
('550e8400-e29b-41d4-a716-446655440005', 6, '12:00', '23:00', false),

-- Curry House
('550e8400-e29b-41d4-a716-446655440006', 0, '16:00', '22:00', false),
('550e8400-e29b-41d4-a716-446655440006', 1, '16:00', '22:00', false),
('550e8400-e29b-41d4-a716-446655440006', 2, '16:00', '22:00', false),
('550e8400-e29b-41d4-a716-446655440006', 3, '16:00', '22:00', false),
('550e8400-e29b-41d4-a716-446655440006', 4, '16:00', '22:00', false),
('550e8400-e29b-41d4-a716-446655440006', 5, '16:00', '23:00', false),
('550e8400-e29b-41d4-a716-446655440006', 6, '16:00', '23:00', false);

-- Insert menu categories
INSERT INTO menu_categories (id, restaurant_id, name, description, display_order) VALUES
-- Mario's Pizza Palace
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Pizzas', 'Our signature wood-fired pizzas', 1),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Appetizers', 'Start your meal right', 2),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Desserts', 'Sweet endings', 3),

-- Burger Junction
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Burgers', 'Gourmet burgers made fresh', 1),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Sides', 'Perfect accompaniments', 2),
('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Shakes', 'Thick and creamy', 3),

-- Sakura Sushi
('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 'Sushi Rolls', 'Fresh sushi rolls', 1),
('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'Sashimi', 'Fresh raw fish', 2),
('650e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'Hot Dishes', 'Cooked Japanese dishes', 3);

-- Insert menu items
INSERT INTO menu_items (restaurant_id, category_id, name, description, price, is_popular, is_vegetarian, prep_time, display_order) VALUES
-- Mario's Pizza Palace - Pizzas
('550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'Margherita Pizza', 'Classic pizza with fresh mozzarella, tomato sauce, and basil', 16.99, true, true, 15, 1),
('550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'Pepperoni Pizza', 'Traditional pepperoni with mozzarella and tomato sauce', 18.99, true, false, 15, 2),
('550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'Supreme Pizza', 'Loaded with pepperoni, sausage, peppers, onions, and mushrooms', 22.99, false, false, 18, 3),

-- Mario's Pizza Palace - Appetizers
('550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 'Garlic Bread', 'Fresh baked bread with garlic butter and herbs', 6.99, false, true, 8, 1),
('550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 'Mozzarella Sticks', 'Crispy breaded mozzarella with marinara sauce', 8.99, true, true, 10, 2),

-- Burger Junction - Burgers
('550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440004', 'Classic Burger', 'Beef patty with lettuce, tomato, onion, and special sauce', 12.99, true, false, 12, 1),
('550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440004', 'Bacon Cheeseburger', 'Beef patty with bacon, cheese, lettuce, and tomato', 15.99, true, false, 15, 2),
('550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440004', 'Veggie Burger', 'Plant-based patty with avocado, sprouts, and vegan mayo', 13.99, false, true, 12, 3),

-- Burger Junction - Sides
('550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440005', 'French Fries', 'Crispy golden fries with sea salt', 4.99, true, true, 8, 1),
('550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440005', 'Onion Rings', 'Beer-battered onion rings with ranch dip', 6.99, false, true, 10, 2),

-- Sakura Sushi - Sushi Rolls
('550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440007', 'California Roll', 'Crab, avocado, and cucumber with sesame seeds', 8.99, true, false, 10, 1),
('550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440007', 'Spicy Tuna Roll', 'Fresh tuna with spicy mayo and cucumber', 10.99, true, false, 12, 2),
('550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440007', 'Vegetable Roll', 'Cucumber, avocado, carrot, and sprouts', 7.99, false, true, 8, 3);

-- Insert sample promotions
INSERT INTO promotions (code, title, description, discount_type, discount_value, minimum_order, max_discount, usage_limit, valid_from, valid_until) VALUES
('WELCOME10', 'Welcome Discount', 'Get 10% off your first order', 'percentage', 10.00, 15.00, 5.00, 1000, NOW(), NOW() + INTERVAL '30 days'),
('FREESHIP', 'Free Delivery', 'Free delivery on orders over $25', 'fixed', 3.99, 25.00, 3.99, 500, NOW(), NOW() + INTERVAL '7 days'),
('SAVE5', 'Save $5', 'Get $5 off orders over $30', 'fixed', 5.00, 30.00, 5.00, 200, NOW(), NOW() + INTERVAL '14 days');
