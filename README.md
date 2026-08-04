# 🚚 Lechpol Logistics Park

Oficjalny serwis internetowy nowoczesnego parku logistycznego Lechpol zlokalizowanego w Miętnem (bezpośrednio przy trasie S17, węzeł Garwolin Zachód). Strona została zbudowana w architekturze Jamstack, co gwarantuje maksymalną wydajność, bezpieczeństwo oraz bezkosztowe skalowanie.

---

## 🚀 Technologie i Architektura

* **Framework Frontendowy:** [Astro](https://astro.build/) (Statyczne generowanie stron - SSG)
* **Stylizowanie:** [Tailwind CSS](https://tailwindcss.com/)
* **Hosting & CDN:** [Cloudflare Pages](https://pages.cloudflare.com/) (Globalna sieć dostarczania treści)
* **Baza Danych:** [Cloudflare D1](https://developers.cloudflare.com/d1/) (Serverless SQL oparty na SQLite)
* **Bezpieczeństwo (Kłódka):** [Cloudflare Zero Trust / Access](https://zero-trust.cloudflare.com/)

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

## 🗄️ System Aktualności i Baza Danych (Cloudflare D1)

Strona posiada dynamiczny system aktualności (newsów), który pozwala na dodawanie ogłoszeń bez ingerencji w kod źródłowy.

### Schemat Tabeli (`news`)
Baza tworzy tabelę automatycznie przy pierwszej próbie wysłania newsa.

| Nazwa kolumny | Typ danych | Opis |
| :--- | :--- | :--- |
| `id` | `INTEGER` | Główny identyfikator wpisu (Primary Key, Auto Increment) |
| `title` | `TEXT` | Tytuł aktualności |
| `content` | `TEXT` | Treść wpisu (obsługuje formatowanie tekstowe z formularza) |
| `created_at` | `TEXT` | Data utworzenia wpisu (generowana przez `datetime('now')`) |

### Przepływ Danych (End-to-End)
1. **Zapis do bazy:** Formularz w `/admin/dodaj-news` wysyła żądanie `POST` do funkcji brzegowej `functions/admin/dodaj-news.js`, która wykonuje `INSERT INTO` do bazy D1.
2. **Odczyt z bazy:** Podstrona `/aktualnosci` ładuje się błyskawicznie, a następnie w tle asynchronicznie odpytuje endpoint `functions/api/get-news.js` (`SELECT * FROM news ORDER BY created_at DESC`).
3. **Prezentacja:** Skrypt na frontendzie zamienia otrzymany JSON na estetyczne kafelki (karty) z wiadomościami.

---

## 🔒 Bezpieczeństwo Panelu Administratora

Aby uchronić bazę przed spamem i niepowołanym dostępem, wprowadziliśmy logowanie w oparciu o sieć Cloudflare.

1. **Cloudflare Zero Trust:** Cały ruch do ścieżek zaczynających się od `/admin*` jest przechwytywany i blokowany na poziomie serwerów brzegowych.
2. **Brak haseł (One-Time PIN):** Autoryzacja odbywa się bez tradycyjnego hasła. Użytkownik wpisuje autoryzowany adres e-mail i otrzymuje na skrzynkę jednorazowy, 6-cyfrowy kod PIN.
3. **Kontrola Dostępu:** Reguły w panelu Cloudflare (Policies) precyzyjnie określają, który konkretnie adres e-mail ma prawo otrzymać kod i wejść do formularza dodawania newsów.

---

## 📂 Struktura Katalogów

```text
├── functions/               # Funkcje backendowe Cloudflare (Serverless Edge)
│   ├── admin/
│   │   └── dodaj-news.js    # Zapisywanie newsów do D1
│   └── api/
│       └── get-news.js      # Publiczne API zwracające aktualności
│
├── public/                  # Pliki statyczne serwowane bezpośrednio
│   └── hale/                # Zdjęcia obiektów logistycznych
│
└── src/
    ├── components/          # Elementy wielokrotnego użytku (Navbar, Footer itp.)
    ├── layouts/             # Główny szablon (szkielet HTML strony)
    └── pages/               # Routing - każda podstrona to osobny plik .astro
        ├── admin/           # Zastrzeżony interfejs
        ├── aktualnosci.astro# Pobieranie i wyświetlanie nowości
        ├── hale.astro       # Pętla generująca ofertę hal
        ├── index.astro      # Strona główna projektu
        └── kontakt.astro    # Dane kontaktowe