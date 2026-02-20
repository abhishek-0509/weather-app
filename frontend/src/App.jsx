import { useState } from "react";
import axios from "axios";

const API_BASE = "https://weather-backend-sma3.onrender.com"; // your backend URL

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeatherByCity = async (cityName) => {
    if (!cityName) return;

    setLoading(true);
    setError("");

    try {
      const weatherRes = await axios.get(
        `${API_BASE}/api/weather?city=${cityName}`
      );

      const forecastRes = await axios.get(
        `${API_BASE}/api/weather/forecast?city=${cityName}`
      );

      const dailyData = forecastRes.data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );

      setWeather(weatherRes.data);
      setForecast(dailyData);
    } catch (err) {
      setError("City not found or server error.");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    getWeatherByCity(city);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      getWeatherByCity(city);
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const weatherRes = await axios.get(
            `${API_BASE}/api/weather/coordinates?lat=${latitude}&lon=${longitude}`
          );

          const forecastRes = await axios.get(
            `${API_BASE}/api/weather/forecast/coordinates?lat=${latitude}&lon=${longitude}`
          );

          const dailyData = forecastRes.data.list.filter((item) =>
            item.dt_txt.includes("12:00:00")
          );

          setWeather(weatherRes.data);
          setForecast(dailyData);
        } catch (err) {
          setError("Unable to fetch location weather.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location permission denied.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 text-white">

        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">
          Weather App
        </h1>

        {/* Search Section */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mb-4">
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleEnter}
            className="flex-1 px-4 py-3 rounded-xl text-black outline-none"
          />

          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-semibold transition"
          >
            Search
          </button>
        </div>

        {/* Use Location Button */}
        <div className="text-center mb-6">
          <button
            onClick={useMyLocation}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-xl font-semibold transition"
          >
            Use My Location
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-lg animate-pulse">
            Loading weather data...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center text-red-200 font-semibold">
            {error}
          </div>
        )}

        {/* Current Weather */}
        {weather && !loading && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">
              {weather.name}, {weather.sys.country}
            </h2>
            <p className="text-5xl font-extrabold mt-2">
              {Math.round(weather.main.temp)}°C
            </p>
            <p className="capitalize mt-2 text-lg">
              {weather.weather[0].description}
            </p>
            <p className="mt-2">
              Humidity: {weather.main.humidity}%
            </p>
            <p>
              Wind Speed: {weather.wind.speed} m/s
            </p>
          </div>
        )}

        {/* Forecast */}
        {forecast.length > 0 && !loading && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-center">
              5-Day Forecast
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {forecast.map((day, index) => (
                <div
                  key={index}
                  className="bg-white/30 p-4 rounded-xl text-center"
                >
                  <p className="font-semibold">
                    {new Date(day.dt_txt).toLocaleDateString()}
                  </p>
                  <p className="text-2xl font-bold">
                    {Math.round(day.main.temp)}°C
                  </p>
                  <p className="capitalize text-sm">
                    {day.weather[0].description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
