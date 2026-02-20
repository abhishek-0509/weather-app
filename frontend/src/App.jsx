import { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// 🔥 IMPORTANT: Replace with your Render backend URL
const API_BASE = "https://weather-backend-sma3.onrender.com";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  // Load search history from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    setHistory(saved);
  }, []);

  const saveToHistory = (cityName) => {
    const updated = [
      cityName,
      ...history.filter((item) => item !== cityName),
    ].slice(0, 5);

    setHistory(updated);
    localStorage.setItem("weatherHistory", JSON.stringify(updated));
  };

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
    console.error(err);
    setError("City not found or server error.");
  } finally {
    setLoading(false); // 🔥 VERY IMPORTANT
  }
};


  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);
    setForecast([]);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await axios.get(
            `${API_BASE}/api/weather?lat=${latitude}&lon=${longitude}`
          );
          setWeather(response.data);

          const forecastResponse = await axios.get(
            `${API_BASE}/api/weather/forecast?city=${response.data.name}`
          );

          const dailyData = forecastResponse.data.list.filter((item) =>
            item.dt_txt.includes("12:00:00")
          );

          setForecast(dailyData);
        } catch {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl text-center">

        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Weather App 🌦
        </h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getWeather()}
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <button
            onClick={() => getWeather()}
            disabled={loading}
            className="bg-indigo-600 text-white px-5 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition"
          >
            {loading ? "..." : "Search"}
          </button>
        </div>

        <button
          onClick={detectLocation}
          className="text-sm text-indigo-600 hover:underline mb-4"
        >
          Use My Location
        </button>

        {error && (
          <p className="text-red-500 font-medium mb-4">{error}</p>
        )}

        {loading && (
          <div className="flex justify-center my-4">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {weather && !loading && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              {weather.name}
            </h2>

            <img
              className="mx-auto my-2"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather icon"
            />

            <p className="text-5xl font-bold text-indigo-600">
              {weather.main?.temp}°C
            </p>

            <div className="text-gray-600 mt-2 space-y-1">
              <p>Humidity: {weather.main?.humidity}%</p>
              <p>Wind: {weather.wind?.speed} m/s</p>
              <p className="capitalize">
                {weather.weather[0]?.description}
              </p>
            </div>
          </div>
        )}

        {forecast.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">
              5-Day Temperature Forecast
            </h3>

            <Line
              data={{
                labels: forecast.map((item) =>
                  new Date(item.dt_txt).toLocaleDateString()
                ),
                datasets: [
                  {
                    label: "Temperature (°C)",
                    data: forecast.map((item) => item.main.temp),
                    borderColor: "rgb(79, 70, 229)",
                    backgroundColor: "rgba(79, 70, 229, 0.5)",
                  },
                ],
              }}
            />
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-6 text-left">
            <h3 className="font-semibold text-gray-700 mb-2">
              Recent Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {history.map((item, index) => (
                <button
                  key={index}
                  onClick={() => getWeather(item)}
                  className="bg-gray-200 px-3 py-1 rounded-full text-sm hover:bg-gray-300"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
