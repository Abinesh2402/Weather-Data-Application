async function getWeather() {

    const city = document
        .getElementById("cityInput")
        .value
        .trim();

    const loading =
        document.getElementById("loading");

    const error =
        document.getElementById("error");

    if (city === "") {
        error.innerText = "Please enter a city name.";
        return;
    }

    loading.style.display = "block";
    error.innerText = "";

    try {

        // Open-Meteo geocoding API
        const locationResponse =
            await fetch(
                "https://geocoding-api.open-meteo.com/v1/search?name=" +
                encodeURIComponent(city) +
                "&count=1&language=en&format=json"
            );

        if (!locationResponse.ok) {
            throw new Error("Location request failed");
        }

        const locationData =
            await locationResponse.json();

        if (
            !locationData.results ||
            locationData.results.length === 0
        ) {
            throw new Error("City not found");
        }

        const location =
            locationData.results[0];


        // Live weather API
        const weatherResponse =
            await fetch(
                "https://api.open-meteo.com/v1/forecast" +
                "?latitude=" + location.latitude +
                "&longitude=" + location.longitude +
                "&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,visibility" +
                "&timezone=auto"
            );

        if (!weatherResponse.ok) {
            throw new Error("Weather request failed");
        }

        const weatherData =
            await weatherResponse.json();


        displayWeather(
            location,
            weatherData.current
        );

    }
    catch (errorObject) {

        error.innerText =
            "❌ " + errorObject.message;

    }
    finally {

        loading.style.display = "none";

    }

}


function displayWeather(location, weather) {

    document.getElementById("cityName").innerText =
        location.name +
        (location.country
            ? ", " + location.country
            : "");


    document.getElementById("date").innerText =
        new Date().toLocaleString();


    document.getElementById("temperature").innerText =
        Math.round(weather.temperature_2m) +
        "°C";


    document.getElementById("description").innerText =
        "Live Weather";


    document.getElementById("humidity").innerText =
        weather.relative_humidity_2m +
        "%";


    document.getElementById("wind").innerText =
        weather.wind_speed_10m +
        " km/h";


    document.getElementById("feels").innerText =
        Math.round(weather.apparent_temperature) +
        "°C";


    document.getElementById("visibility").innerText =
        (weather.visibility / 1000).toFixed(1) +
        " km";


    document.getElementById("weatherIcon").innerText =
        "🌤️";

}


/* Search using Enter key */

document
    .getElementById("cityInput")
    .addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {
                getWeather();
            }

        }
    );