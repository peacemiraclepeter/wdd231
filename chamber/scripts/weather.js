const API_KEY = '55baebb84245984edb3ee618bd69de88'; // Replace with your actual API key
const CITY_LAT = '4.8159'; // Replace with your city's latitude
const CITY_LON = '7.0179'; // Replace with your city's longitude
const CITY_NAME = 'Port Harcourt';

// DOM Elements
const currentTemp = document.getElementById('current-temp');
const weatherDesc = document.getElementById('weather-desc');
const weatherIcon = document.getElementById('weather-icon');
const forecastContainer = document.getElementById('forecast-container');

// Fetch current weather and forecast
async function fetchWeather() {
    try {
        // Current weather
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${CITY_LAT}&lon=${CITY_LON}&units=imperial&appid=${API_KEY}`
        );

        if (!currentResponse.ok) throw new Error('Weather data not available');

        const currentData = await currentResponse.json();
        displayCurrentWeather(currentData);

        // 5-day forecast (we'll use 3 days)
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${CITY_LAT}&lon=${CITY_LON}&units=imperial&appid=${API_KEY}`
        );

        if (!forecastResponse.ok) throw new Error('Forecast data not available');

        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);

    } catch (error) {
        console.error('Weather fetch error:', error);
        displayWeatherError();
    }
}

// Display current weather
function displayCurrentWeather(data) {
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;

    currentTemp.textContent = temp;
    weatherDesc.textContent = description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = description;
}
}

// Display 3-day forecast
function displayForecast(data) {
    // Get one forecast per day (data comes in 3-hour intervals)
    const dailyData = data.list.filter((item, index) => index % 8 === 0).slice(0, 3);

    forecastContainer.innerHTML = '';

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = dayNames[date.getDay()];
        const temp = Math.round(day.main.temp);
        const description = day.weather[0].description;

        const dayElement = document.createElement('div');
        dayElement.className = 'forecast-day';
        dayElement.innerHTML = `
            <span class="day-name">${dayName}</span>
            <span class="day-temp">${temp}°F</span>
            <span class="day-desc">${description}</span>
        `;

        forecastContainer.appendChild(dayElement);
    });
}

// Display error message
function displayWeatherError() {
    currentTemp.textContent = '--';
    weatherDesc.textContent = 'Weather data unavailable';
    weatherIcon.style.display = 'none';
    forecastContainer.innerHTML = '<p class="error-message">Unable to load forecast</p>';
}

// Initialize weather when DOM is loaded
document.addEventListener('DOMContentLoaded', fetchWeather);