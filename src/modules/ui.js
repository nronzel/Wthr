import { getData, getDailyAndHourlyData } from "./fetch.js";

export default class UI {
  static async displayData() {
    const unit = UI.getUnit();
    const data = await getData();

    UI.clearScreen();
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
    <p class="small-txt last-updated">Last Updated ${data.current.last_updated}</p>
    `;

    condition.classList.add("condition");
    container.classList.add("weather-container");
    container.classList.add("flex-column");
    // container.classList.add("glassify");
    location.classList.add("location-container");

    const units = UI.setPropertyUnits(unit, data);

    UI.#displayTodayTemp(units, container);
    UI.displayWeatherStats(data, units, container);
    UI.displayWindStats(data, units, container);

    mainContainer.append(location);
    mainContainer.append(condition);
    mainContainer.append(container);
    UI.animateArrow(data);
  }

  static async displayDailyData() {
    const daily = await UI.getDailyForecast();
    const container = document.querySelector(".secondary-container");
    const hourly = document.querySelector(".hourly-container");

    container.classList.add("active");
    hourly.firstChild.innerHTML = "";
    hourly.classList.remove("active");

    document.querySelector(".secondary-container").innerHTML = "";
    daily.forEach((day) => UI.drawDailyCard(day));
  }

  static drawDailyCard(day) {
    const mainContainer = document.querySelector(".secondary-container");
    const dailyContainer = document.createElement("div");

    dailyContainer.classList.add("daily-container", "glassify");

    dailyContainer.innerHTML = `
    <p class="weather-data-header date">${day.date}</p>
    <div class="daily-header">
      <img class="wicon" src="https:${day.icon}" alt="weather-icon">
      <p class="weather-data-header midweight">${day.condition}</p>
    </div>
    <div class="daily-data-container">
      <p class="daily-data-header">Temp</p>
      <p class="daily-data">${day.temp} <span class="small-txt">${
      day.unit
    }</span></p>
      <p class="daily-data-header">Wind</p>
      <p class="daily-data">${day.wind} <span class="small-txt">${
      day.windUnit
    }</span></p>
      <p class="daily-data-header">Rain</p>
      <p class="daily-data">${day.rain} <span class="small-txt">%</span></p>
      <p class="daily-data-header">Humidity</p>
      <p class="daily-data">${day.humidity} <span class="small-txt">%</span></p>
      <p class="daily-data-header">Sunrise</p>
      <p class="daily-data">${
        day.sunrise.split(" ")[0]
      } <span class="small-txt">AM</span></p>
      <p class="daily-data-header">Sunset</p>
      <p class="daily-data">${
        day.sunset.split(" ")[0]
      } <span class="small-txt">PM</span></p>
    </div>
    `;

    mainContainer.append(dailyContainer);
  }

  static async getDailyForecast() {
    const forecastRaw = await getDailyAndHourlyData();
    const threeDayForecast = forecastRaw.forecastday.slice(1);
    const forecastParsed = [];

    threeDayForecast.forEach((day) =>
      forecastParsed.push(UI.#parseSingleDay(day))
    );

    return forecastParsed;
  }

  // HOURLY DATA
  static async getHourlyForecast() {
    const forecastRaw = await getDailyAndHourlyData();
    const today = forecastRaw.forecastday[0].hour;
    const tomorrow = forecastRaw.forecastday[1].hour;
    return [today, tomorrow];
  }

  static async displayHourlyData() {
    const secondaryContainer = document.querySelector(".secondary-container");
    const hourlyContainer = document.querySelector(".hourly-container");
    secondaryContainer.classList.remove("active");
    hourlyContainer.classList.add("active");

    const rawData = await UI.getHourlyForecast();
    let nextTwentyFour = UI.getHourlyData(rawData);

    UI.clearHourlyContainer();

    nextTwentyFour.forEach((hour) => UI.addHourlyRow(hour));
  }

  static clearHourlyContainer() {
    const container = document.querySelector(".hourly-data-container");
    container.innerHTML = `
    <div class="hourly-row">
    <div class="grid">
      <!-- <p>Time</p> -->
    </div>
    <div class="grid"></div>
    <div class="grid">
      <!-- <p>Condition</p> -->
    </div>
    <div class="grid">
      <p>Feels Like</p>
    </div>
    <div class="grid">
      <p>Rain</p>
    </div>
    <div class="grid">
      <p>Humidity</p>
    </div>
    <div class="grid">
      <p>Wind Dir</p>
    </div>
    <div class="grid">
      <p>Wind Speed</p>
    </div>
  </div>
    `;
  }

  static addHourlyRow(hour) {
    const row = document.createElement("div");
    const container = document.querySelector(".hourly-data-container");
    row.classList.add("hourly-row");
    row.innerHTML = `
    <div class="grid">
            <p>${hour.hour}</p>
          </div>
          <div class="grid"><img class="wicon" src="https:${hour.icon}"
              alt="weather-icon"></div>
          <div class="grid">
            <p>${hour.condition}</p>
          </div>
          <div class="grid">
            <p>${hour.feelsLike} <span class="smaller-txt">${hour.unit}</span></p>
          </div>
          <div class="grid">
            <p>${hour.rain} <span class="smaller-txt">%</span></p>
          </div>
          <div class="grid">
            <p>${hour.humidity} <span class="smaller-txt">%</span></p>
          </div>
          <div class="grid">
            <p>${hour.windDir}</p>
          </div>
          <div class="grid">
            <p>${hour.windSpeed} <span class="smaller-txt">${hour.windUnit}</span></p>
          </div>
        </div>
    `;

    container.append(row);
  }

  static getHourlyData(data) {
    let nextDayData = UI.#getNextTwentyFourHours(data);
    let parsedData = [];

    nextDayData.forEach((hour) => parsedData.push(UI.#parseSingleHour(hour)));

    return parsedData;
  }

  static #getNextTwentyFourHours(data) {
    let nextDayData;

    const todayHour = UI.getTimeHour();
    const restOfToday = data[0].slice(todayHour);
    const tomorrow = data[1];

    let count = restOfToday.length;

    if (count < 24) {
      let remaining = 24 - count;
      let remainingHourData = tomorrow.slice(0, remaining);
      nextDayData = [].concat(restOfToday, remainingHourData);
      count = nextDayData.length;
    }
    return nextDayData;
  }

  static #parseSingleHour(hour) {
    const unit = UI.getUnit();
    const time = hour.time.split(" ")[1];

    const hourlyData = {
      hour: time,
      icon: hour.condition.icon,
      condition: hour.condition.text,
      feelsLike: unit === "F" ? hour.feelslike_f : hour.feelslike_c,
      rain: hour.chance_of_rain,
      humidity: hour.humidity,
      windDir: hour.wind_dir,
      windSpeed: unit === "F" ? hour.wind_mph : hour.wind_kph,
      unit: unit,
      windUnit: unit === "F" ? "mph" : "kph",
    };

    return hourlyData;
  }

  static #parseSingleDay(day) {
    const current = day.day;
    const unit = UI.getUnit();
    const date = `${day.date.split("-")[1]}/${day.date.split("-")[2]}`;

    const dailyData = {
      date: date,
      condition: current.condition.text,
      temp: unit === "F" ? current.avgtemp_f : current.avgtemp_c,
      wind: unit === "F" ? current.maxwind_mph : current.maxwind_kph,
      rain: current.daily_chance_of_rain,
      humidity: current.avghumidity,
      sunrise: day.astro.sunrise,
      sunset: day.astro.sunset,
      icon: current.condition.icon,
      unit: unit,
      windUnit: unit === "F" ? "mph" : "kph",
    };

    return dailyData;
  }

  static #displayTodayTemp(units, container) {
    const todayTempContainer = document.createElement("div");
    const feelsLikeContainer = document.createElement("div");

    todayTempContainer.classList.add("temperature-stats");
    feelsLikeContainer.classList.add("flex-column");

    todayTempContainer.innerHTML = `
    <i class="fas fa-temperature-half"></i>
    <p class="current-temp">${units.currentTemp}${units.temp_unit}</p>
    `;
    feelsLikeContainer.innerHTML = `
    <p class="med-txt">FEELS LIKE</p>
    <p class="feels-like">${units.feelsLike} ${units.temp_unit}</p>
    `;

    todayTempContainer.append(feelsLikeContainer);
    container.append(todayTempContainer);
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
    <p class="weather-data-header">PRECIP.</p>
    <p class="weather-data-value">${units.precip} <span class="small-txt">${units.precip_unit}</span></p>
    `;

    // append items
    weatherStatsContainer.append(humidityDiv);
    weatherStatsContainer.append(uvDiv);
    weatherStatsContainer.append(precipDiv);
    container.append(weatherStatsContainer);
  }

  static displayWindStats(data, units, container) {
    const windMainContainer = document.createElement("div");
    const windDataContainer = document.createElement("div");
    const windSpeedContainer = document.createElement("div");
    const windDirContainer = document.createElement("div");
    const windGustContainer = document.createElement("div");

    // add classes
    windMainContainer.classList.add("wind-main-container");
    windMainContainer.classList.add("flex-column");
    windDataContainer.classList.add("wind-data-container");

    windSpeedContainer.classList.add("wind-data");
    windDirContainer.classList.add("wind-data");
    windGustContainer.classList.add("wind-data");
    // add content

    windMainContainer.innerHTML = `<p class="weather-data-header">WIND</p>`;

    windDirContainer.innerHTML = `
    <p class="wind-data-header">DIRECTION</p>
    <p class="wind-data-value"><span><i class="fas fa-arrow-up"></i></span>${data.current.wind_dir}</p>
    `;

    windSpeedContainer.innerHTML = `
    <p class="wind-data-header">SPEED</p>
    <p class="wind-data-value">${units.currentWind} <span class="small-txt">${units.wind_unit}</span></p>
    `;

    windGustContainer.innerHTML = `
    <p class="wind-data-header">GUST</p>
    <p class="wind-data-value">${units.gust} <span class="small-txt">${units.wind_unit}</span></p>
    `;

    // append
    windDataContainer.append(windDirContainer);
    windDataContainer.append(windSpeedContainer);
    windDataContainer.append(windGustContainer);
    windMainContainer.append(windDataContainer);
    container.append(windMainContainer);
  }

  static getLocation() {
    let input = document.getElementById("Zip");

    if (document.body.dataset.lastZip !== undefined)
      return document.body.dataset.lastZip;
    if (input.value !== "") return input.value;

    return "auto:ip";
  }

  static clearInput() {
    let input = document.getElementById("Zip");
    let btn = document.querySelector(".fa-check");
    input.value = "";
    // input.textContent = "";
    btn.classList.remove("active");
  }

  static setEventListeners() {
    const input = document.getElementById("Zip");
    const toggle = document.getElementById("myToggle");
    const nextTwentyFour = document.getElementById("hourly");
    const daily = document.getElementById("threeday");

    nextTwentyFour.addEventListener("click", UI.displayHourlyData);
    daily.addEventListener("click", UI.displayDailyData);
    toggle.addEventListener("change", UI.changeUnit);

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") UI.submitBtnAction;
    });

    input.addEventListener("keydown", UI.showSubmitBtn);
  }

  static clearScreen() {
    let mainContainer = document.querySelector(".main-container");
    mainContainer.innerHTML = "";
  }

  // SUBMIT BTN
  static showSubmitBtn() {
    let btn = document.querySelector(".submit");
    btn.classList.add("active");
    btn.addEventListener("click", UI.submitBtnAction);
  }

  static submitBtnAction(e) {
    e.preventDefault();

    const input = document.getElementById("Zip");
    const hourly = document.querySelector(".hourly-container");

    if (input.value !== "")
      document.body.setAttribute("data-last-zip", input.value);

    if (hourly.classList.contains("active")) {
      UI.displayHourlyData();
      UI.displayData();
      return;
    }

    UI.clearInput();
    UI.hideSubmitBtn();

    UI.displayData();
    UI.displayDailyData();
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
    const hourly = document.querySelector(".hourly-container");

    if (toggle.checked) {
      unit.textContent = "C";
      if (hourly.classList.contains("active")) {
        UI.displayHourlyData();
        return;
      }
      UI.displayData(unit);
    } else {
      unit.textContent = "F";
      if (hourly.classList.contains("active")) {
        UI.displayHourlyData();
        return;
      }
      UI.displayData(unit);
    }
  }

  static animateArrow(data) {
    const arrow = document.querySelector(".fa-arrow-up");
    const windDeg = data.current.wind_degree;
    arrow.style.transform = `rotate(${windDeg}deg)`;
  }

  // TIME
  static getTimeHour() {
    const time = new Date();
    return time.getHours();
  }

  // BACKGROUND
  static setBgImage(weatherCode) {
    const nightImages = {
      clearNight: "./assets/imgs/clear-night.jpg",
      lightCloudNight: "./assets/imgs/partly-cloudy-night.jpg",
      overcastNight: "./assets/imgs/overcast-night.jpg",
      rainNight: "./assets/imgs/rain-night.jpg",
      snowNight: "./assets/imgs/snow-night.jpg",
      blizzardNight: "./assets/imgs/blizzard-night.jpg",
      fogNight: "./assets/imgs/night-fog.jpg",
    };

    const dayImages = {
      clearDay: "./assets/imgs/sun.jpg",
      cloudy: "./assets/imgs/cloudy.jpg",
      lightCloudDay: "./assets/imgs/partly-cloudy-day.jpg",
      overcast: "./assets/imgs/overcast.jpg",
      lightRain: "./assets/imgs/light-rain.jpg",
      rain: "./assets/imgs/rain.jpg",
      thunderstorm: "./assets/imgs/thunderstorm.jpg",
      snow: "./assets/imgs/snow.jpg",
      blizzard: "./assets/imgs/blizzard.jpg",
      fog: "./assets/imgs/fog.jpg",
    };

    let timeOfDay = UI.checkDayOrNight();
    let weatherCondition = UI.getWeatherCondition(weatherCode);
    const defaultBg = document.getElementById("Background1");

    if (timeOfDay === "day") {
      let image = "";
      let bg = document.getElementById("Background2");

      bg.classList.remove("hidden");
      if (weatherCondition == "clear") image += dayImages.clearDay;
      if (weatherCondition == "partly-cloudy") image += dayImages.lightCloudDay;
      if (weatherCondition == "overcast") image += dayImages.overcast;
      if (weatherCondition == "blizzard") image += dayImages.blizzard;
      if (weatherCondition == "light-rain") image += dayImages.lightRain;
      if (weatherCondition == "rain") image += dayImages.rain;
      if (weatherCondition == "thunderstorm") image += dayImages.thunderstorm;
      if (weatherCondition == "snow") image += dayImages.snow;
      if (weatherCondition == "fog") image += dayImages.fog;
      bg.src = image;
      defaultBg.classList.add("hidden");
      return image;
    } else if (timeOfDay == "night") {
      let image = "";
      let bg = document.getElementById("Background2");

      if (weatherCondition == "clear") image += nightImages.clearNight;
      if (weatherCondition == "partly-cloudy")
        image += nightImages.lightCloudNight;
      if (weatherCondition == "overcast") image += nightImages.overcastNight;
      if (weatherCondition == "blizzard") image += nightImages.blizzardNight;
      if (weatherCondition == "light-rain") image += nightImages.rainNight;
      if (weatherCondition == "rain") image += nightImages.rainNight;
      if (weatherCondition == "thunderstorm") image += nightImages.rainNight;
      if (weatherCondition == "snow") image += nightImages.snowNight;
      if (weatherCondition == "fog") image += nightImages.fogNight;
      bg.src = image;
      defaultBg.classList.add("hidden");
      return image;
    } else {
      // default image
      let bg = document.getElementById("Background");
      console.log("default image");
      bg.src = "./assets/imgs/default.jpg";
    }
  }

  static getWeatherCondition(weatherCode) {
    const lightRain = [
      1063, 1069, 1072, 1150, 1153, 1168, 1171, 1180, 1183, 1198, 1204, 1240,
      1249,
    ];
    const rain = [1186, 1189, 1192, 1195, 1201, 1207, 1243, 1246, 1252];
    const thunderstorm = [1087, 1273, 1276];
    const snow = [
      1066, 1114, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1255, 1258, 1261,
      1264,
    ];
    const fog = [1030, 1135, 1147];
    const miscCodes = {
      1000: "clear",
      1003: "partly-cloudy",
      1009: "overcast",
      1117: "blizzard",
    };

    if (weatherCode in miscCodes) return miscCodes[weatherCode];
    if (lightRain.includes(weatherCode)) return "light-rain";
    if (rain.includes(weatherCode)) return "rain";
    if (thunderstorm.includes(weatherCode)) return "thunderstorm";
    if (snow.includes(weatherCode)) return "snow";
    if (fog.includes(weatherCode)) return "fog";
  }

  static checkDayOrNight() {
    const hour = UI.getTimeHour();
    const day = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

    if (day.includes(hour)) return "day";
    else return "night";
  }
}
