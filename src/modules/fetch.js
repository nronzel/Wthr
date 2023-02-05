import UI from "./ui.js";

export async function getData() {
  let zip = UI.getZip();
  if (zip === undefined) zip = "auto:ip";

  const url = `https://api.weatherapi.com/v1/current.json?key=9efd72673aa64db4961180618232901&q=${zip}&aqi=no`;

  let response = await fetch(url, { mode: "cors" });
  let data = await response.json();

  let weatherInfo = {
    location: data.location,
    current: data.current,
  };

  return weatherInfo;
}
