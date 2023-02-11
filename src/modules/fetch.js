import UI from "./ui.js";

export async function getData() {
  let location = UI.getLocation();

  const url = `https://api.weatherapi.com/v1/current.json?key=9efd72673aa64db4961180618232901&q=${location}&aqi=no`;

  let response = await fetch(url, { mode: "cors" });
  let data = await response.json();

  let weatherInfo = {
    location: data.location,
    current: data.current,
  };

  return weatherInfo;
}

export async function getDailyAndHourlyData() {
  let location = UI.getLocation();

  const url = `https://api.weatherapi.com/v1/forecast.json?key=9efd72673aa64db4961180618232901&q=${location}&days=4&aqi=no`;

  const response = await fetch(url, { mode: "cors" });
  const data = await response.json();

  return data.forecast;
}
