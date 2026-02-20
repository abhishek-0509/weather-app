import { useState } from "react";
import axios from "axios";

const API_BASE = "https://weather-backend-sma3.onrender.com"; // your Render backend URL

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async (searchCity) => {
    const cityToSearch = searchCity || city;
    if (!cityToSearch) return;

    setLoading(true);
    setError("");

    try {
      const weatherResponse = await axios.get(
        `${API_BASE}/api/weather?city=${cityToSearch}`
      );

      const forecastResponse = await axios.get(
        `${API_BASE}/api/weather/forecast?city=${cityToSearch}`
      );

      const dailyData = forecastResponse.data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );

      setWeather(weatherResponse.data);
      setForecast(dailyData);
    } catch (err) {
      setError("City not found or server error.");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 text-white">

        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">
          Weather App
        </h1>

        {/* Search Section */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mb-6">
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl text-black outline-none"
          />

          <button
            onClick={() => getWeather()}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-semibold transition-all duration-300"
          >
            Search
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

        {/* 5-Day Forecast */}
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
