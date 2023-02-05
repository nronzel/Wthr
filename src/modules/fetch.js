import UI from "./ui.js";

export async function getData() {
  const zip = UI.getZip();
  if (zip === undefined) return;
  const url = `https://api.weatherapi.com/v1/current.json?key=9efd72673aa64db4961180618232901&q=${zip}&aqi=no`;

  let response = await fetch(url, { mode: "cors" });

  let data = await response.json();

  let weatherInfo = {
    location: data.location,
    current: data.current,
  };

  await parseData(weatherInfo);
}

async function parseData(data) {
  try {
    let todayWeather = await data;
    let unit = UI.getUnit();
    UI.displayData(todayWeather, unit);
    UI.animateArrow(todayWeather.current.wind_degree);
  } catch (error) {
    console.error(error.message);
  }
}
