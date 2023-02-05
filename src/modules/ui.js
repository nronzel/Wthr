import { getData } from "./fetch.js";

export default class UI {
  static displayData(data, unit) {
    if (document.querySelector(".weather-container")) UI.clearScreen();

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
    <p class="small-txt">Last Updated ${data.current.last_updated}</p>
    `;

    condition.classList.add("condition");
    container.classList.add("weather-container");
    // container.classList.add("glassify");
    location.classList.add("location-container");

    const units = UI.setPropertyUnits(unit, data);

    UI.displayTodayTemp(units, container);
    UI.displayWeatherStats(data, units, container);
    UI.displayWindStats(data, units, container);

    mainContainer.append(location);
    mainContainer.append(condition);
    mainContainer.append(container);

    UI.animateArrow(data.current.wind_degree);
  }

  static displayTodayTemp(units, container) {
    const todayTempContainer = document.createElement("div");
    const feelsLikeContainer = document.createElement("div");

    todayTempContainer.classList.add("temperature-stats");
    feelsLikeContainer.classList.add("feels-like-container");

    todayTempContainer.innerHTML = `
    <i class="fas fa-temperature-half"></i>
    <h1 class="current-temp">${units.currentTemp}${units.temp_unit}<h1>
    `;
    feelsLikeContainer.innerHTML = `
    <p class="med-txt">FEELS LIKE</p>
    <p class="feels-like">${units.feelsLike} ${units.temp_unit}</p>
    `;

    todayTempContainer.append(feelsLikeContainer);
    container.append(todayTempContainer);
  }

  static displayIcon(data, units) {
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

  static displayWeatherStats(data, units, container) {
    const weatherStatsContainer = document.createElement("div");
    const humidityDiv = document.createElement("div");
    const uvDiv = document.createElement("div");
    const precipDiv = document.createElement("div");

    weatherStatsContainer.classList.add("weather-stats-container");
    humidityDiv.classList.add("weather-data");
    uvDiv.classList.add("weather-data");
    precipDiv.classList.add("weather-data");

    humidityDiv.innerHTML = `
    <p class="weather-data-header">HUMIDITY</p>
    <p class="weather-data-value">${data.current.humidity}%</p>
    `;

    uvDiv.innerHTML = `
    <p class="weather-data-header">UV INDEX</p>
    <p class="weather-data-value">${data.current.uv}</p>
    `;

    precipDiv.innerHTML = `
    <p class="weather-data-header">PRECIPITATION</p>
    <p class="weather-data-value">${units.precip} <span class="small-txt">${units.precip_unit}</span></p>
    `;

    // append items
    weatherStatsContainer.append(humidityDiv);
    weatherStatsContainer.append(uvDiv);
    weatherStatsContainer.append(precipDiv);
    container.append(weatherStatsContainer);
  }

  static displayWindStats(data, units, container) {
    const windStatsContainer = document.createElement("div");
    const windStats = document.createElement("div");

    // add classes
    windStatsContainer.classList.add("wind-stats-container");
    windStats.classList.add("wind-stats");

    // add content
    windStatsContainer.innerHTML = `<p class="weather-data-header">WIND</p>`;
    windStats.innerHTML = `
    <p class="weather-data-value">${data.current.wind_dir}</p>
    <i class="fas fa-arrow-up"></i>
    <p class="weather-data-value">${units.currentWind} <span class="small-txt">${units.wind_unit}</span></p>
    <p class="weather-data-value">${units.gust} <span class="small-txt">${units.wind_unit}</span></p>
    `;

    // append
    windStatsContainer.append(windStats);
    container.append(windStatsContainer);
  }

  static getZip() {
    // lookup tool: city,state -> zipcode
    // https://tools.usps.com/zip-code-lookup.htm?bycitystate
    if (document.body.dataset) return document.body.dataset.lastZip;
    let input = document.getElementById("Zip");
    return input.textContent;
  }

  static clearInput() {
    let input = document.getElementById("Zip");
    let btn = document.querySelector(".fa-check");
    input.value = "";
    // input.textContent = "";
    btn.classList.remove("active");
  }

  static setEventListeners() {
    let submit = document.querySelector(".submit");
    let input = document.getElementById("Zip");
    const toggle = document.getElementById("myToggle");
    toggle.addEventListener("change", UI.changeUnit);

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
    btn.addEventListener("click", UI.submitBtnAction);
  }

  static submitBtnAction() {
    const input = document.getElementById("Zip");
    document.body.setAttribute("data-last-zip", input.value);
    UI.clearInput();
    UI.hideSubmitBtn();
    getData();
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
    const toggle = document.getElementById("myToggle");
    const unit = document.getElementById("unit");

    if (toggle.checked) {
      unit.textContent = "C";
      getData();
    } else {
      unit.textContent = "F";
      getData();
    }
  }

  static animateArrow(deg) {
    const arrow = document.querySelector(".fa-arrow-up");
    arrow.style.transform = `rotate(${deg}deg)`;
    arrow.style.transition = "1.2s ease-in-out";
  }

  // BACKGROUND TODO
  static setBgImage(weatherCode) {
    const images = {
      clearDay: "./assets/imgs/sunny.jpg",
      clearNight: "./assets/imgs/clear-night.jpg",
      cloudy: "./assets/imgs/cloudy.jpg",
      lightCloudDay: "./assets/imgs/partly-cloudy-day.jpg",
      lightCloudNight: "./assets/imgs/partly-cloudy-night.jpg",
      overcast: "./assets/imgs/overcast.jpg",
      lightRain: "./assets/imgs/light-rain.jpg",
      rain: "./assets/imgs/rain.jpg",
      rainNight: "./assets/imgs/rain-night.jpg",
      thunderstorm: "./assets/imgs/thunderstorm.jpg",
      snow: "./assets/imgs/snow.jpg",
      blizzard: "./assets/imgs/blizzard.jpg",
      fog: "./assets/imgs/fog.jpg",
    };
  }
}
