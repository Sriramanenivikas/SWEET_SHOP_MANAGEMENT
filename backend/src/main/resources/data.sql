-- Sweet Shop Initial Data
-- Premium Indian Sweets Shop
-- Password for all users: Admin@123

-- Admin user
INSERT INTO users (id, email, password, first_name, last_name, role, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@sweetshop.com', '$2a$12$vbA13/SQWjHvSD9SX8Mt7eGbARvP5W2Lr5ZsxA6FcwuwnFGcKt/.W', 'Rajesh', 'Kumar', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Regular user
INSERT INTO users (id, email, password, first_name, last_name, role, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'user@sweetshop.com', '$2a$12$vbA13/SQWjHvSD9SX8Mt7eGbARvP5W2Lr5ZsxA6FcwuwnFGcKt/.W', 'Priya', 'Sharma', 'USER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Premium Sweets Collection
INSERT INTO sweets (id, name, category, price, quantity, description, image_url, version, created_at, updated_at) VALUES
-- TRADITIONAL
('6ba7b810-9dad-11d1-80b4-00c04fd430c1', 'Kaju Katli', 'TRADITIONAL', 899.00, 50, 'Premium diamond-shaped cashew fudge with silver vark', '/burfi/Kaju_Barfi.jpg', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('6ba7b810-9dad-11d1-80b4-00c04fd430c2', 'Gulab Jamun', 'TRADITIONAL', 349.00, 100, 'Soft khoya balls soaked in rose-flavored sugar syrup', 'https://images.unsplash.com/photo-1666190020509-ce9a057d6189?w=400', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('6ba7b810-9dad-11d1-80b4-00c04fd430c3', 'Motichoor Ladoo', 'TRADITIONAL', 449.00, 80, 'Fine boondi pearls with cardamom and saffron', 'https://images.unsplash.com/photo-1605197161470-5c60b1a6d15c?w=400', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('6ba7b810-9dad-11d1-80b4-00c04fd430c4', 'Pista Barfi', 'TRADITIONAL', 749.00, 60, 'Rich pistachio fudge garnished with dry fruits', 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('6ba7b810-9dad-11d1-80b4-00c04fd430c5', 'Mysore Pak', 'TRADITIONAL', 549.00, 45, 'Ghee-rich gram flour delicacy from Karnataka', 'https://images.unsplash.com/photo-1589249785169-3c89e1e10c48?w=400', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('6ba7b810-9dad-11d1-80b4-00c04fd430c6', 'Rasgulla', 'TRADITIONAL', 299.00, 90, 'Spongy cottage cheese balls in light sugar syrup', 'https://images.unsplash.com/photo-1601303516150-c4bb7ec8a847?w=400', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- CHOCOLATE
('7ba7b810-9dad-11d1-80b4-00c04fd430c1', 'Belgian Dark Truffle', 'CHOCOLATE', 699.00, 40, 'Premium 70% cocoa dark chocolate truffles', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('7ba7b810-9dad-11d1-80b4-00c04fd430c2', 'Milk Chocolate Box', 'CHOCOLATE', 499.00, 55, 'Creamy milk chocolate with roasted almonds', 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- CAKE
('8ba7b810-9dad-11d1-80b4-00c04fd430c1', 'Black Forest Cake', 'CAKE', 1299.00, 15, 'Classic black forest with cherries - 1kg', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('8ba7b810-9dad-11d1-80b4-00c04fd430c2', 'Red Velvet Cake', 'CAKE', 1499.00, 12, 'Premium red velvet with cream cheese - 1kg', 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- COOKIE
('9ba7b810-9dad-11d1-80b4-00c04fd430c1', 'Nankhatai', 'COOKIE', 299.00, 80, 'Traditional ghee shortbread cookies', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('9ba7b810-9dad-11d1-80b4-00c04fd430c2', 'Butter Cookies', 'COOKIE', 249.00, 100, 'Crispy Danish butter cookies assortment', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- ICE_CREAM
('aba7b810-9dad-11d1-80b4-00c04fd430c1', 'Malai Kulfi', 'ICE_CREAM', 149.00, 50, 'Traditional creamy frozen dessert with cardamom', 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('aba7b810-9dad-11d1-80b4-00c04fd430c2', 'Mango Kulfi', 'ICE_CREAM', 169.00, 45, 'Alphonso mango flavored summer special', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- PASTRY
('cba7b810-9dad-11d1-80b4-00c04fd430c1', 'Chocolate Pastry', 'PASTRY', 189.00, 30, 'Rich chocolate cream pastry slice', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('cba7b810-9dad-11d1-80b4-00c04fd430c2', 'Fruit Pastry', 'PASTRY', 199.00, 25, 'Fresh seasonal fruits with cream', 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
