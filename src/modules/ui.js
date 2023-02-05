import { getData } from "./fetch.js";

export default class UI {
  static displayData(data) {
    if (document.querySelector(".weather-container")) UI.clearScreen();
    UI.clearInput();
    UI.hideSubmitBtn();
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
    // container.classList.add("glassify");
    location.classList.add("location-container");

    const units = UI.setPropertyUnits(UI.getUnit(), data);

    UI.displayTodayTemp(container, units);

    container.innerHTML += `

    <div class="data">
      <p class="heading">Gust</p><p>${units.gust}${units.wind_unit}</p>
    </div>

    <div class="data">
      <p class="heading">Humidity</p><p>${data.current.humidity}%</p>
    </div>

    <div class="data">
      <p class="heading">Precipitation</p><p>${units.precip}${units.precip_unit}</p>
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
      <p class="heading">Wind</p><p>${units.currentWind}${units.wind_unit}</p>
    </div>
    `;

    mainContainer.append(location);
    mainContainer.append(condition);
    mainContainer.append(container);
  }

  static displayTodayTemp(container, units) {
    const todayTempContainer = document.createElement("div");
    const feelsLikeContainer = document.createElement("div");

    todayTempContainer.classList.add("temperature-stats");
    feelsLikeContainer.classList.add("feels-like-container");

    todayTempContainer.innerHTML = `<h1 class="current-temp">${units.currentTemp}${units.temp_unit}<h1>`;
    feelsLikeContainer.innerHTML = `
    <p>FEELS LIKE</p>
    <p class="feels-like">${units.feelsLike}${units.temp_unit}</p>
    `;

    todayTempContainer.append(feelsLikeContainer);
    container.append(todayTempContainer);
  }
  static getZip() {
    let input = document.getElementById("Zip");
    return input.value;
  }

  static clearInput() {
    let input = document.getElementById("Zip");
    let btn = document.querySelector(".fa-check");
    input.value = "";
    input.textContent = "";
    btn.classList.remove("active");
  }

  static setEventListeners() {
    let submit = document.querySelector(".submit");
    let input = document.getElementById("Zip");
    let unit = document.getElementById("unit");

    unit.addEventListener("click", UI.changeUnit);
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") submit.click();
    });

    input.addEventListener("keydown", UI.showSubmitBtn);
  }

  static clearScreen() {
    let mainContainer = document.querySelector(".main-container");
    mainContainer.innerHTML = "";
  }

  static showSubmitBtn() {
    let btn = document.querySelector(".submit");
    btn.classList.add("active");
    btn.addEventListener("click", getData);
  }

  static hideSubmitBtn() {
    let btn = document.querySelector(".submit");
    btn.classList.remove("active");
  }

  // UNITS
  static getUnit() {
    const unit = document.getElementById("unit");
    return unit.textContent;
  }

  static setPropertyUnits(unit, data) {
    if (unit == "F") {
      return {
        temp_unit: unit,
        wind_unit: "mph",
        precip_unit: "in",
        feelsLike: data.current.feelslike_f,
        gust: data.current.gust_mph,
        precip: data.current.precip_in,
        currentTemp: data.current.temp_f,
        currentWind: data.current.wind_mph,
      };
    } else {
      return {
        temp_unit: "C",
        wind_unit: "kph",
        precip_unit: "mm",
        feelsLike: data.current.feelslike_c,
        gust: data.current.gust_kph,
        precip: data.current.precip_mm,
        currentTemp: data.current.temp_c,
        currentWind: data.current.wind_kph,
      };
    }
  }

  static changeUnit() {
    const unit = document.getElementById("unit");
    if (unit.textContent == "F") unit.textContent = "C";
    else unit.textContent = "F";
  }

  // WEATHER ICON TODO
  static getIcon() {
    const icons = {
      sun: "<i class='far fa-sun wicon'></i>",
      thunderstorm: "<i class='fas fa-cloud-bolt wicon'></i>",
      cloudy: "<i class='fas fa-cloud wicon'></i>",
      snow: "<i class='fas fa-snowflake wicon'></i>",
      rain: "<i class='fas fa-cloud-rain wicon'></i>",
      heavyRain: "<i class='fas fa-cloud-showers-heavy wicon'></i>",
      mist: "<i class='fas fa-smog wicon'></i>",
    };
  }

  // BACKGROUND TODO
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
