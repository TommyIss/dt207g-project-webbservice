# Projekt i kursen DT207G, Backend-baserad webbutveckling

## Webbservice
Detta är ett API som byggt med Express samt PostgresSQL, används för restaurangsverksamhet. Denna webbtjänst erbjuder flera möjligheter såsom registrering samt inloggning till Administration-sida, hantering av meny i webbplatsen, och reservation av bord samt få bekräftelse mejl.

### Installation
API:et använder PostgresSQL-databas. Installera följande npm-paket (express, pg, cors, bcrypt, dotenv, jsonwebtoken, nodemailer, nodemon, router). Databas är skapad i Supabase och kopplad till pgAdmin4.
Databas består av tre tabeller, här står de nedan med sina struktur:
Reservationstabell
| Fält | Datatyp | Beskrivning |
|------|---------|-------------|
| id | number | Unikt id |
| guest_name | string | Gästnamn |
| phone | string | Telefonnummer |
| email | string | E-post |
| guests_number | number | Antal gäster |
| reservation_date | date | Reservations datum |
| reservation_time | time | Reservations tid |
| created_at | timestamp | Skapelse datum |

Användartabell
| Fält | Datatyp | Beskrivning |
|------|---------|-------------|
| id | number | Unikt id |
| username | string | Användarnamn |
| email | string | E-post |
| password | number | Lösenord |
| created_at | timestamp | Registreringsdatum |

Maträtter
| Fält | Datatyp | Beskrivning |
|------|---------|-------------|
| id | number | Unikt id |
| meal_name | string | Maträtts namn |
| meal_type | string | Maträtts typ |
| ingredients | jsonb | Ingredienser |
| price | numeric | pris |
| added_at | timestamp | Registreringsdatum |

### Användning
Nedan finns hur API:et används med olika metoder:
| Metod | Ändpunkt | Beskrivning |
|-------|----------|-------------|
| GET | /meals | Hämtar alla maträtter |
| GET | /meals/type/:type | Hämtar maträtter med specifik typ |
| GET | /meals/:id | Hämtar en maträtt med specifik id |
| POST | /meals | Lägger till ny maträtt |
| PUT | /meals/:id | Uppdaterar maträtt med specifik id |
| DELETE | /meals/:id | Raderar maträtt med specifik id |
| POST | /register | Skapar ett användarkonto |
| POST | /login | Loggar in till användarkontot |
| GET | /protected | Hämtar skyddad route |
| GET | /reservations | Hämtar alla reservationer |
| GET | /reservations/:id | Hämtar reservation med specifik id |
| POST | /reservations | Lagrar en ny reservation |
| PUT | /reservations/:id | Uppdaterar en befintlig reservation med specifikt id |
| DELETE | /reservations/:id | Raderar en reservation med specifikt id |

### Tommy Issa, tois2401