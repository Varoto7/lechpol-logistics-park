CREATE TABLE IF NOT EXISTS map_zones (
    id TEXT PRIMARY KEY,
    nazwa TEXT NOT NULL,
    powierzchnia TEXT NOT NULL,
    status TEXT NOT NULL,
    opis TEXT
);

-- Dodajemy domyślne dane startowe (zastępują plik mapData.json)
INSERT INTO map_zones (id, nazwa, powierzchnia, status, opis) VALUES
('hala-1', 'Hala Magazynowa A', '5 200 m²', 'dostepna', 'Nowoczesna powierzchnia z 4 dokami załadunkowymi. Gotowa do wejścia od zaraz.'),
('hala-2', 'Hala Magazynowa B', '3 100 m²', 'wynajeta', 'Obiekt w pełni wynajęty przez najemcę długoterminowego.'),
('hala-3', 'Hala Magazynowa C', '4 500 m²', 'rezerwacja', 'Trwają negocjacje umowy najmu. Możliwość zapytania o listę rezerwową.'),
('hala-4', 'Hala Magazynowa D', '2 000 m²', 'dostepna', 'Moduł idealny dla lokalnej dystrybucji lub lekkiej produkcji.');