# 🚚 Lechpol Logistics Park

Oficjalny serwis internetowy nowoczesnego parku logistycznego Lechpol zlokalizowanego w Miętnem (bezpośrednio przy trasie S17, węzeł Garwolin Zachód). Strona została zbudowana w architekturze Jamstack, co gwarantuje maksymalną wydajność, bezpieczeństwo oraz bezkosztowe skalowanie.

---

## 🚀 Technologie i Architektura

* **Framework Frontendowy:** [Astro](https://astro.build/) (Statyczne generowanie stron - SSG)
* **Stylizowanie:** [Tailwind CSS](https://tailwindcss.com/)
* **Hosting & CDN:** [Cloudflare Pages](https://pages.cloudflare.com/) (Globalna sieć dostarczania treści)
* **Baza Danych:** [Cloudflare D1](https://developers.cloudflare.com/d1/) (Serverless SQL oparty na SQLite)
* **Bezpieczeństwo (Ochrona przed botami):** [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/)
* **Bezpieczeństwo (Panel Admina):** [Cloudflare Zero Trust / Access](https://zero-trust.cloudflare.com/)

---

## 🏢 Zarządzanie Ofertą (Hale Magazynowe)

Podstrona z ofertą hal (`/hale`) jest generowana statycznie dla maksymalnej szybkości ładowania. Dane o budynkach trzymane są bezpośrednio w kodzie.

### Jak dodać nową halę do oferty?
1. Przygotuj zdjęcie hali (np. `nowa-hala.jpg`) i wrzuć je do folderu `public/hale/`.
2. Otwórz plik `src/pages/hale.astro`.
3. Na samej górze pliku, w tablicy `const hale = [...]`, skopiuj jeden z bloków `{ ... }` i wklej jako nowy na końcu listy.
4. Podmień dane (tytuł, ścieżkę do obrazka, parametry). 
5. Wyślij zmiany na GitHuba – strona przebuduje się automatycznie.

---

## 🗄️ System Aktualności i Baza Danych (Cloudflare D1) – Pełny CRUD

Strona posiada w pełni funkcjonalny, chroniony panel administracyjny umożliwiający zarządzanie aktualnościami w cyklu **CRUD** (Create, Read, Update, Delete) bezpośrednio w bazie D1 bez ingerencji w kod źródłowy.

### Schemat Tabeli (`news`)
| Nazwa kolumny | Typ danych | Opis |
| :--- | :--- | :--- |
| `id` | `INTEGER` | Główny identyfikator wpisu (Primary Key, Auto Increment) |
| `title` | `TEXT` | Tytuł aktualności |
| `content` | `TEXT` | Treść wpisu |
| `created_at` | `TEXT` | Data utworzenia wpisu (generowana przez `datetime('now')`) |

### Funkcjonalności Panelu Admina (`/admin/dodaj-news`)
* **Dodawanie (Create):** Formularz wysyła żądanie `POST` do funkcji brzegowej `/admin/dodaj-news`, zapisując nowy wpis.
* **Odczyt (Read):** Dynamiczna tabela asynchronicznie pobiera i wyświetla opublikowane aktualności.
* **Edycja (Update):** Kliknięcie przycisku "Edytuj" wczytuje dane do formularza, umożliwiając szybką modyfikację wpisu przez endpoint `/admin/update-news`.
* **Usuwanie (Delete):** Natychmiastowe usunięcie wybranego wpisu z bazy za pomocą żądania `DELETE` (`/admin/delete-news?id=...`).

---

## ✉️ Formularz Kontaktowy i Skrzynka Odbiorcza

Podstrona kontaktowa (`/kontakt`) została zaprojektowana z myślą o najwyższym standardzie UX oraz bezpieczeństwie:
* **Interaktywne dane:** Adres fizyczny przekierowuje bezpośrednio do map Google, numer telefonu inicjuje połączenie komórkowe, a adres e-mail uruchamia domyślnego klienta poczty.
* **Kopiowanie do schowka:** Przy danych kontaktowych znajdują się przyciski umożliwiające skopiowanie numeru lub maila jednym kliknięciem z wizualnym potwierdzeniem.
* **Ochrona Turnstile:** Formularz jest zabezpieczony dyskretnym widgetem antyspamowym Cloudflare Turnstile, który blokuje boty po stronie frontendu i weryfikuje token na backendzie (`/api/kontakt`).
* **Zapis do D1:** Wiadomości od klientów trafiają do tabeli `messages` w bazie D1.
* **Panel Wiadomości i Eksport CSV (`/admin/wiadomosci`):** Administratorzy mogą przeglądać nadesłane wiadomości oraz wyeksportować całą skrzynkę do pliku w formacie `.csv` (z zachowaniem kodowania UTF-8/BOM dla prawidłowego wyświetlania polskich znaków w MS Excel).

---

## 🔒 Bezpieczeństwo Panelu Administratora (Zero Trust)

Cała sekcja administracyjna (`/admin/*`) oraz skrypty modyfikujące bazę danych zostały hermetycznie zamknięte za pomocą **Cloudflare Zero Trust (Access)**:
1. **Ochrona ścieżki:** Każdy ruch do folderu `/admin/` (w tym podstrony i ukryte endpointy API) jest przechwytywany na brzegowych serwerach Cloudflare.
2. **Logowanie OTP (One-Time PIN):** Dostęp wymaga podania autoryzowanego adresu e-mail oraz przepisania jednorazowego, 6-cyfrowego kodu PIN wysłanego na skrzynkę pocztową.
3. **Multi-User Control:** Polityki dostępowe (Access Policies) pozwalają na łatwe autoryzowanie wielu administratorów (np. twórcy projektu oraz opiekuna praktyk) bez konieczności dzielenia się hasłami.

---

## 📂 Struktura Katalogów

```text
├── functions/                     # Funkcje backendowe Cloudflare (Serverless Edge)
│   ├── admin/                     # Chronione endpointy (Wymagają logowania Zero Trust)
│   │   ├── dodaj-news.js          # Dodawanie nowych wpisów do D1
│   │   ├── update-news.js         # Edycja istniejących wpisów
│   │   ├── delete-news.js         # Usuwanie wpisów
│   │   └── get-messages.js        # Pobieranie wiadomości z formularza kontaktowego
│   └── api/                       # Publiczne endpointy
│       ├── get-news.js            # Pobieranie aktualności dla użytkowników
│       └── kontakt.js             # Obsługa formularza kontaktowego + weryfikacja Turnstile
│
├── public/                        # Pliki statyczne serwowane bezpośrednio
│   └── hale/                      # Zdjęcia obiektów logistycznych
│
└── src/
    ├── components/                # Elementy wielokrotnego użytku (Navbar, Footer itp.)
    ├── layouts/                   # Główny szablon (szkielet HTML strony)
    └── pages/                     # Routing - każda podstrona to osobny plik .astro
        ├── admin/                 # Zastrzeżony interfejs administracyjny
        │   ├── dodaj-news.astro   # Panel zarządzania newsami (CRUD)
        │   └── wiadomosci.astro   # Skrzynka odbiorcza + eksport do CSV
        ├── aktualnosci.astro      # Publiczna strona z aktualnościami
        ├── hale.astro             # Pętla generująca ofertę hal
        ├── index.astro            # Strona główna projektu
        └── kontakt.astro          # Interaktywny kontakt + formularz z Turnstile