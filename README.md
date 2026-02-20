# 🌦 Full Stack Weather Application

A modern Full Stack Weather Application built using Spring Boot (Backend) and React + Vite (Frontend).  
The application provides real-time weather data and a 5-day forecast using the OpenWeather API.

---

## 🚀 Live Demo

🌐 Frontend: weather-app-alpha-five-ia7gfz49gp.vercel.app 
🔗 Backend API: https://weather-backend-sma3.onrender.com  

---

## 📌 Features

- 🔍 Search weather by city name
- 📍 Use My Location (Geolocation API)
- 📅 5-Day Forecast
- 🌡 Real-time temperature in Celsius
- 🌍 Country & City display
- 📱 Fully Responsive (Mobile + Desktop)
- ⚡ REST API integration
- ☁ Cloud Deployment (Render + Vercel)

---

## 🛠 Tech Stack

Frontend:
- React (Vite)
- Tailwind CSS
- Axios
- JavaScript (ES6+)

Backend:
- Spring Boot
- REST API
- Maven
- OpenWeather API
- CORS Configuration

Deployment:
- Render (Backend Hosting)
- Vercel (Frontend Hosting)
- GitHub (Version Control)

---

## 📂 Project Structure

weather-app/
│
├── backend/   → Spring Boot REST API  
├── frontend/  → React + Vite Application  
└── README.md  

---

## ⚙️ Run Locally

Backend:

cd backend  
./mvnw spring-boot:run  

Runs on:  
http://localhost:8080  

Frontend:

cd frontend  
npm install  
npm run dev  

Runs on:  
http://localhost:5173  

---

## 🔑 Environment Setup

Add your OpenWeather API key inside:

backend/src/main/java/com/example/weather/service/WeatherService.java

Replace:

private final String API_KEY = "YOUR_OPENWEATHER_API_KEY";

---

## 🌍 API Endpoints

GET /api/weather?city=CityName  
GET /api/weather/forecast?city=CityName  
GET /api/weather/coordinates?lat=XX&lon=YY  
GET /api/weather/forecast/coordinates?lat=XX&lon=YY  

---

## 🎯 What This Project Demonstrates

- Full Stack Development
- REST API Design
- Third-Party API Integration
- Cloud Deployment
- Responsive UI Design
- Real-world Application Architecture

---

## 👨‍💻 Author

Abhishek Poddar  
Full Stack Developer  

---

⭐ If you like this project, consider giving it a star!
