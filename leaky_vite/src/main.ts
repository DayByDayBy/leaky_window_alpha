const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
const infoDiv = document.getElementById("info") as HTMLElement;
const weatherText = document.getElementById("weather-text") as HTMLElement;

if (!infoDiv || !weatherText) {
    throw new Error("Required DOM elements are missing.");
}

// fetch for IP address
fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
        (infoDiv.children[0] as HTMLParagraphElement).innerHTML = `<strong>Your IP:</strong> ${data.ip}`;
    });

// user Agent, screen size, timezone
(infoDiv.children[1] as HTMLParagraphElement).innerHTML = `<strong>Your User Agent:</strong> ${navigator.userAgent}`;
(infoDiv.children[2] as HTMLParagraphElement).innerHTML = `<strong>Your Screen Size:</strong> ${window.screen.width}x${window.screen.height}`;
(infoDiv.children[3] as HTMLParagraphElement).innerHTML = `<strong>Your Timezone:</strong> ${Intl.DateTimeFormat().resolvedOptions().timeZone}`;

// battery Info (if supported)
if ("getBattery" in navigator) {
    (navigator as NavigatorBattery).getBattery().then((battery) => {
        (infoDiv.children[4] as HTMLParagraphElement).innerHTML = `<strong>Battery Level:</strong> ${battery.level * 100}%`;
    }).catch(() => {
        (infoDiv.children[4] as HTMLParagraphElement).innerHTML = "<strong>Battery Level:</strong> Error fetching data";
    });
} else {
    (infoDiv.children[4] as HTMLParagraphElement).innerHTML = "<strong>Battery Level:</strong> Not supported";
}

// network info (if supported)
const connection = navigator.connection as NetworkInformation
if (connection) {
    (infoDiv.children[5] as HTMLParagraphElement).innerHTML = `<strong>Network Connection:</strong> ${navigator.connection.effectiveType}, Downlink: ${navigator.connection.downlink} Mb/s`;
} else {
    (infoDiv.children[5] as HTMLParagraphElement).innerHTML = "<strong>Network Connection:</strong> Not supported";
}

// referrer (prev site, usually)
(infoDiv.children[6] as HTMLParagraphElement).innerHTML = `<strong>Referrer:</strong> ${document.referrer || "No referrer"}`;

// geolocation (with consent)
const geoButton = document.getElementById("geo-button") as HTMLButtonElement;
const geoResult = document.getElementById("geo-result") as HTMLElement;

geoButton.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            geoResult.innerText = `Latitude: ${latitude}, Longitude: ${longitude}`;
            geoButton.style.display = "none";
            getWeatherByLocation(latitude, longitude);
        },
        () => {
            geoResult.innerHTML = `<span class="secure-message">You denied location access. Nice work on protecting your privacy!</span>`;
            fetchWeatherByIP(); // Attempt to fetch weather based on IP if location is not granted
        }
    );
});

// cam access (with consent)
const camButton = document.getElementById("cam-button") as HTMLButtonElement;
const camResult = document.getElementById("cam-result") as HTMLElement;

camButton.addEventListener("click", () => {
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            camResult.innerText = "camera access granted";
            camButton.style.display = "none";
        })
        .catch(() => {
            camResult.innerHTML = `<span class="secure-message">You denied camera access. Great job keeping your privacy intact!</span>`;
        });
});

// detect autofill on form fields
const autofillForm = document.getElementById('autofill-form') as HTMLFormElement;
autofillForm.addEventListener('input', () => {
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const phone = (document.getElementById('tel') as HTMLInputElement).value;
    const address = (document.getElementById('address') as HTMLInputElement).value;

    // log or display the autofilled data (if available)
    console.log("Autofill detected:");
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Phone: ${phone}`);
    console.log(`Address: ${address}`);
});

// weather fetching functions
function getWeatherByLocation(lat: number, lon: number) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then((response) => response.json())
        .then((data) => {
            displayWeather(data);
        })
        .catch(() => {
            weatherText.innerText = "Unable to fetch weather for your location. Trying IP-based weather...";
            fetchWeatherByIP();
        });
}

function fetchWeatherByIP() {
    fetch("https://api.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => {
            return fetch(`https://ipapi.co/${data.ip}/json/`);
        })
        .then((response) => response.json())
        .then((data) => {
            const city = data.city;
            fetchWeatherByCity(city);
        })
        .catch(() => {
            weatherText.innerText = "Unable to fetch weather based on IP. Trying default...";
            fetchWeatherByCity('New York'); // Fallback to a default city if IP-based fails
        });
}

function fetchWeatherByCity(city: string) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then((response) => response.json())
        .then((data) => {
            displayWeather(data);
        })
        .catch(() => {
            weatherText.innerText = "Unable to fetch weather for your city.";
        });
}

function displayWeather(data: any) {
    const temp = data.main.temp;
    const description = data.weather[0].description;
    const location = data.name;
    weatherText.innerText = `It is currently ${temp}°C with ${description} in ${location}.`;
}
