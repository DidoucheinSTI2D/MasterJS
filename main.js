const form = document.getElementById('form');
const error = document.getElementById('errorText');
const weatherInfo = document.getElementById('weather-info');
const loadingText = document.getElementById("loadingText");
const cancelButton = document.getElementById("cancelButton");
let controller;

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const input = document.getElementById('text');
    const inputValue = input.value.trim();

    error.innerHTML = '';

    if (inputValue === '') {
        showError('Le champ ne doit pas être vide.');
    } else if (!/^[a-zA-Z\s]+$/.test(inputValue)) {
        showError('Le champ ne doit contenir que des lettres.');
    } else if (/(\s){2,}/.test(inputValue)) {
        showError('Un seul espace est autorisé entre les mots.');
    } else if (!/^[A-Z][a-z]*(\s+[A-Z][a-z]*)*$/.test(inputValue)) {
        showError('Chaque mot doit commencer par une majuscule, les autres caractères en minuscule.');
    } else {
        controller = new AbortController();
        fetchWeatherData(inputValue, controller);
    }
});

function showLoadingText() {
    loadingText.style.display = "block";
    loadingText.innerText = "Chargement en cours...";
    loadingText.classList.add("loading");
    showCancelButton();
}

function showCancelButton() {
    cancelButton.style.display = "inline";
}

function hideCancelButton() {
    cancelButton.style.display = "none";
}

function showError(message) {
    error.textContent = message;
    error.style.display = "block";
}

function hideLoadingText() {
    loadingText.style.display = 'none';
}

function fetchWeatherData(city) {
    const apiKey = '';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    showLoadingText();

        fetch(url)
            .then(response => response.json())
            .then(data => {
                hideLoadingText();
                hideCancelButton();
                displayWeatherData(data);
            })
            .catch(error => {
                hideLoadingText();
                showError('Une erreur s\'est produite lors de la récupération des données météorologiques.');
                console.log('Une erreur s\'est produite lors de la récupération des données météorologiques:', error);
            });
}

function displayWeatherData(data) {
    const weatherDescription = data.weather && data.weather.length > 0 ? data.weather[0].description : '';
    const weatherIcon = data.weather && data.weather.length > 0 ? data.weather[0].icon : '';
    const temperature = data.main ? data.main.temp : '';
    const feelsLikeTemperature = data.main ? data.main.feels_like : '';
    const currentTime = new Date(data.dt * 1000).toLocaleString('fr-FR');
    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleString('fr-FR');
    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleString('fr-FR');

    const weatherInfoHTML = `
                <p>Condition météorologique : ${weatherDescription}</p>
                <img src="http://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon">
                <p>Température : ${temperature} °C</p>
                <p>Température ressentie : ${feelsLikeTemperature} °C</p>
                <p>Date de la requête : ${currentTime}</p>
                <p>Levé du soleil : ${sunriseTime}</p>
                <p>Couché du soleil : ${sunsetTime}</p>
            `;

    weatherInfo.innerHTML = weatherInfoHTML;
}

cancelButton.addEventListener('click', function() {
    if (controller) {
        controller.abort();
        hideLoadingText();
        hideCancelButton();
        showError('Requête annulée.');
    }
});
