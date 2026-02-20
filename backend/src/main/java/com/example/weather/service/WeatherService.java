package com.example.weather.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    private final String API_KEY = "aa291f3c8fb8b1de6da0f56f03be686f";
    private final String BASE_URL = "https://api.openweathermap.org/data/2.5/";

    private final RestTemplate restTemplate = new RestTemplate();

    public ResponseEntity<String> getWeatherByCity(String city) {
        String url = BASE_URL + "weather?q=" + city + "&appid=" + API_KEY + "&units=metric";
        return ResponseEntity.ok(restTemplate.getForObject(url, String.class));
    }

    public ResponseEntity<String> getForecastByCity(String city) {
        String url = BASE_URL + "forecast?q=" + city + "&appid=" + API_KEY + "&units=metric";
        return ResponseEntity.ok(restTemplate.getForObject(url, String.class));
    }

    public ResponseEntity<String> getWeatherByCoordinates(double lat, double lon) {
        String url = BASE_URL + "weather?lat=" + lat + "&lon=" + lon + "&appid=" + API_KEY + "&units=metric";
        return ResponseEntity.ok(restTemplate.getForObject(url, String.class));
    }

    public ResponseEntity<String> getForecastByCoordinates(double lat, double lon) {
        String url = BASE_URL + "forecast?lat=" + lat + "&lon=" + lon + "&appid=" + API_KEY + "&units=metric";
        return ResponseEntity.ok(restTemplate.getForObject(url, String.class));
    }
}
