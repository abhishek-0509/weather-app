package com.example.weather.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.weather.service.WeatherService;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping
    public ResponseEntity<String> getWeather(@RequestParam String city) {
        return weatherService.getWeatherByCity(city);
    }

    @GetMapping("/forecast")
    public ResponseEntity<String> getForecast(@RequestParam String city) {
        return weatherService.getForecastByCity(city);
    }

    @GetMapping("/coordinates")
    public ResponseEntity<String> getWeatherByCoordinates(
            @RequestParam double lat,
            @RequestParam double lon) {
        return weatherService.getWeatherByCoordinates(lat, lon);
    }

    @GetMapping("/forecast/coordinates")
    public ResponseEntity<String> getForecastByCoordinates(
            @RequestParam double lat,
            @RequestParam double lon) {
        return weatherService.getForecastByCoordinates(lat, lon);
    }
}
