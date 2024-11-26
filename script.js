const apiKey = '7ded80d91f2b280ec979100cc8bbba94'; // Klucz API
const btnGetWeather = document.querySelector('#weatherBtn');
const cityInputField = document.querySelector('#city');
const currentWeatherSection = document.querySelector('#currentWeather');
const forecastSection = document.querySelector('#forecast');

btnGetWeather.addEventListener('click', () => {
    const city = cityInputField.value.trim();
    if (city) {
        fetchCurrentWeather(city);  // Pobranie bieżącej pogody
        fetchWeatherForecast(city); // Pobranie prognozy pogody
    } else {
        alert('Proszę podać nazwę miasta.');
    }
});

// Funkcja do pobierania bieżącej pogody (XMLHttpRequest)
function fetchCurrentWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', apiUrl, true);
    xhr.onload = () => {
        if (xhr.status === 200) {
            const responseData = JSON.parse(xhr.responseText);
            console.log('Bieżąca pogoda:', responseData);
            renderCurrentWeather(responseData);
            updatePageBackground(responseData.main.temp);
        } else {
            currentWeatherSection.innerHTML = `<p>Nie udało się pobrać danych o pogodzie.</p>`;
        }
    };
    xhr.onerror = () => {
        currentWeatherSection.innerHTML = `<p>Błąd połączenia z API.</p>`;
    };
    xhr.send();
}

// Funkcja do zmiany tła w zależności od temperatury
function updatePageBackground(temp) {
    document.body.classList.remove("cold", "cool", "warm", "hot");

    if (temp <= 0) {
        document.body.classList.add("cold");
    } else if (temp <= 15) {
        document.body.classList.add("cool");
    } else if (temp <= 25) {
        document.body.classList.add("warm");
    } else {
        document.body.classList.add("hot");
    }
}

// Renderowanie bieżącej pogody
function renderCurrentWeather(data) {
    const weatherIconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    currentWeatherSection.innerHTML = `
        <h3>Aktualna pogoda dla ${data.name}</h3>
        <div class="weather-details">
            <img src="${weatherIconUrl}" alt="Ikona pogody">
            <p>Temperatura: ${data.main.temp}°C</p>
            <p>Opis: ${data.weather[0].description}</p>
        </div>
    `;
}

// Funkcja do pobierania prognozy pogody (Fetch API)
function fetchWeatherForecast(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pl`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Błąd pobierania danych prognozy');
            return response.json();
        })
        .then(data => {
            console.log('Prognoza pogody:', data);
            renderWeatherForecast(data);
        })
        .catch(error => {
            forecastSection.innerHTML = `<p>Wystąpił błąd przy pobieraniu prognozy pogody.</p>`;
        });
}

// Renderowanie prognozy 5-dniowej
function renderWeatherForecast(data) {
    forecastSection.innerHTML = '<h3>Prognoza 5-dniowa</h3>';
    let previousTemp = null;

    data.list.slice(0, 5).forEach(item => {
        const forecastDate = new Date(item.dt * 1000).toLocaleString('pl-PL', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

        let tempChangeIndicator = '';
        if (previousTemp !== null) {
            tempChangeIndicator = item.main.temp > previousTemp
                ? '<span class="temp-change up">↑</span>'
                : item.main.temp < previousTemp
                    ? '<span class="temp-change down">↓</span>'
                    : '';
        }
        previousTemp = item.main.temp;

        forecastSection.innerHTML += `
            <div class="weather-item">
                <img src="${iconUrl}" alt="Ikona pogody">
                <div class="weather-info">
                    <p>${forecastDate}</p>
                    <p>Temperatura: ${item.main.temp}°C ${tempChangeIndicator}</p>
                    <p>Opis: ${item.weather[0].description}</p>
                </div>
            </div>
        `;
    });
}
