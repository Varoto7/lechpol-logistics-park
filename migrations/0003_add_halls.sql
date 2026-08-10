CREATE TABLE IF NOT EXISTS halls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    image TEXT NOT NULL,
    area TEXT NOT NULL,
    height TEXT NOT NULL,
    docks TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Dodajemy Twoją pierwszą, domyślną halę
INSERT INTO halls (title, image, area, height, docks, description) VALUES
('Hala Magazynowa – Miętne', '/hale/hala1.jpg', 'ok. 10 000 m²', '10 m', 'Doki + rampy "0"', 'Nowoczesny obiekt magazynowo-logistyczny położony bezpośrednio przy trasie S17 (węzeł Garwolin Zachód). Wyposażony w posadzkę bezpyłową o wysokiej nośności, ogrzewanie gazowe, instalację tryskaczową oraz plac manewrowy dla TIR.');