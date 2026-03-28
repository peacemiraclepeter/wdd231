// WDD231 Week 03 Weather Script

const API_KEY = "55baebb84245984edb3ee618bd69de88";
const CITY_LAT = "4.8159";
const CITY_LON = "7.0179";

// DOM elements
const currentTemp = document.getElementById("current-temp");
const weatherDesc = document.getElementById("weather-desc");
const weatherIcon = document.getElementById("weather-icon");
const forecastContainer = document.getElementById("forecast-container");

// Fetch weather data
async function fetchWeather() {
    try {

        const currentURL = `https://api.openweathermap.org/data/2.5/weather?lat=${CITY_LAT}&lon=${CITY_LON}&units=metric&appid=${API_KEY}`;
        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${CITY_LAT}&lon=${CITY_LON}&units=metric&appid=${API_KEY}`;

        const currentResponse = await fetch(currentURL);
        const forecastResponse = await fetch(forecastURL);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error("Weather API error");
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);

    } catch (error) {
        console.error("Weather error:", error);
        displayWeatherError();
    }
}

// Display current weather
function displayCurrentWeather(data) {

    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;

    currentTemp.textContent = temp;
    weatherDesc.textContent = description;

    weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    weatherIcon.alt = description;
}

// Display 3-day forecast
function displayForecast(data) {

    const forecastDays = data.list
        .filter(item => item.dt_txt.includes("12:00:00"))
        .slice(0, 3);

    forecastContainer.innerHTML = "";

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    forecastDays.forEach(day => {

        const date = new Date(day.dt_txt);
        const dayName = dayNames[date.getDay()];
        const temp = Math.round(day.main.temp);
        const desc = day.weather[0].description;

        const card = document.createElement("div");
        card.classList.add("forecast-day");

        card.innerHTML = `
            <span class="day-name">${dayName}</span>
            <span class="day-temp">${temp}°C</span>
            <span class="day-desc">${desc}</span>
        `;

        forecastContainer.appendChild(card);

    });
}

// Error display
function displayWeatherError() {
    currentTemp.textContent = "--";
    weatherDesc.textContent = "Weather unavailable";
    forecastContainer.innerHTML = "<p class='error-message'>Unable to load forecast</p>";
}

// Run weather
document.addEventListener("DOMContentLoaded", fetchWeather);