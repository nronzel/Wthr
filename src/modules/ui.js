import { getData } from "./fetch.js";

export default class UI {
  static displayData(data) {
    if (document.querySelector(".weather-container")) UI.clearScreen();
    UI.clearInput();
    UI.setBgImage(data.current.condition.code);

    let container = document.createElement("div");
    let condition = document.createElement("div");
    let location = document.createElement("div");
    const mainContainer = document.querySelector(".main-container");

    location.innerHTML = `
    <h1 class="location">${data.location.name}</h1>
    <h1 class="location region">${data.location.region}</h1>
    `;

    condition.innerHTML = `
    <p class="condition">${data.current.condition.text}</p>
    <p class="small">Last Updated ${data.current.last_updated}</p>
    `;

    condition.classList.add("condition");
    container.classList.add("weather-container");
    container.classList.add("glassify");
    location.classList.add("location-container");

    container.innerHTML = `
    <div class="data">
      <p class="heading">Feels Like C</p><p>${data.current.feelslike_c}</p>
    </div>

    <div class="data">
      <p class="heading">Feels Like F</p><p>${data.current.feelslike_f}</p>
    </div>

    <div class="data">
      <p class="heading">Gust KPH</p><p>${data.current.gust_kph}</p>
    </div>

    <div class="data">
      <p class="heading">Gust MPH</p><p>${data.current.gust_mph}</p>
    </div>

    <div class="data">
      <p class="heading">Humidity</p><p>${data.current.humidity}</p>
    </div>

    <div class="data">
      <p class="heading">Precip. Inches</p><p>${data.current.precip_in}</p>
    </div>

    <div class="data">
      <p class="heading">Precip. MM</p><p>${data.current.precip_mm}</p>
    </div>

    <div class="data">
      <p class="heading">Temp C</p><p>${data.current.temp_c}</p>
    </div>

    <div class="data">
      <p class="heading">Temp F</p><p>${data.current.temp_f}</p>
    </div>

    <div class="data">
      <p class="heading">UV</p><p>${data.current.uv}</p>
    </div>

    <div class="data">
      <p class="heading">Wind Deg</p><p>${data.current.wind_degree}</p>
    </div>

    <div class="data">
      <p class="heading">Wind Dir</p><p>${data.current.wind_dir}</p>
    </div>

    <div class="data">
      <p class="heading">Wind kph</p><p>${data.current.wind_kph}</p>
    </div>

    <div class="data">
      <p class="heading">Wind mph</p><p>${data.current.wind_mph}</p>
    </div>
    `;

    mainContainer.append(location);
    mainContainer.append(condition);
    mainContainer.append(container);
  }

  static getZip() {
    let input = document.getElementById("Zip");
    return input.value;
  }

  static clearInput() {
    let input = document.getElementById("Zip");
    input.value = "";
    input.textContent = "";
  }

  static setSubmitEventListener() {
    let submit = document.querySelector(".submit");
    let input = document.getElementById("Zip");

    submit.addEventListener("click", getData);
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") submit.click();
    });
  }

  static clearScreen() {
    let mainContainer = document.querySelector(".main-container");
    mainContainer.innerHTML = "";
  }

  static setBgImage(weatherCode) {
    const images = {
      sunny: "./assets/imgs/sunny.jpg",
      cloudy: "./assets/imgs/cloudy.jpg",
      overcast: "./assets/imgs/overcast.jpg",
      lightRain: "./assets/imgs/light-rain.jpg",
      rain: "./assets/imgs/rain.jpg",
      thunderstorm: "./assets/imgs/thunderstorm.jpg",
      snow: "./assets/imgs/snow.jpg",
      blizzard: "./assets/imgs/blizzard.jpg",
      fog: "./assets/imgs/fog.jpg",
    };
  }
}
