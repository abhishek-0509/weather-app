package com.example.weather.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.weather.service.WeatherService;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "*")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping
    public String getWeather(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String lat,
            @RequestParam(required = false) String lon) {

        if (city != null) {
            return weatherService.getWeatherByCity(city);
        }

        if (lat != null && lon != null) {
            return weatherService.getWeatherByCoordinates(lat, lon);
        }

        return "Invalid request parameters";
    }
    
    @GetMapping("/forecast")
    public String getForecast(@RequestParam String city) {
        return weatherService.getFiveDayForecast(city);
    }

}
