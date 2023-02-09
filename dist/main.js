(()=>{"use strict";async function t(){const t=`https://api.weatherapi.com/v1/forecast.json?key=9efd72673aa64db4961180618232901&q=${e.getLocation()}&days=4&aqi=no`,a=await fetch(t,{mode:"cors"});return(await a.json()).forecast}class e{static async displayData(){const t=e.getUnit(),a=await async function(){const t=`https://api.weatherapi.com/v1/current.json?key=9efd72673aa64db4961180618232901&q=${e.getLocation()}&aqi=no`;let a=await fetch(t,{mode:"cors"}),n=await a.json();return{location:n.location,current:n.current}}();e.clearScreen(),e.setBgImage(a.current.condition.code);let n=document.createElement("div"),s=document.createElement("div"),i=document.createElement("div");const d=document.querySelector(".main-container");i.innerHTML=`\n    <h1 class="location">${a.location.name}</h1>\n    <h1 class="location region">${a.location.region}</h1>\n    `,s.innerHTML=`\n    <p class="condition">${a.current.condition.text}</p>\n    <p class="small-txt last-updated">Last Updated ${a.current.last_updated}</p>\n    `,s.classList.add("condition"),n.classList.add("weather-container"),n.classList.add("flex-column"),i.classList.add("location-container");const c=e.setPropertyUnits(t,a);e.#t(c,n),e.displayWeatherStats(a,c,n),e.displayWindStats(a,c,n),d.append(i),d.append(s),d.append(n),e.animateArrow(a)}static async displayDailyData(){const t=await e.getDailyForecast(),a=document.querySelector(".secondary-container"),n=document.querySelector(".hourly-container");a.classList.add("active"),n.firstChild.innerHTML="",n.classList.remove("active"),document.querySelector(".secondary-container").innerHTML="",t.forEach((t=>e.drawDailyCard(t)))}static drawDailyCard(t){const e=document.querySelector(".secondary-container"),a=document.createElement("div");a.classList.add("daily-container","glassify"),a.innerHTML=`\n    <p class="weather-data-header date">${t.date}</p>\n    <div class="daily-header">\n      <img class="wicon" src="https:${t.icon}" alt="weather-icon">\n      <p class="weather-data-header midweight">${t.condition}</p>\n    </div>\n    <div class="daily-data-container">\n      <p class="daily-data-header">Temp</p>\n      <p class="daily-data">${t.temp} <span class="small-txt">${t.unit}</span></p>\n      <p class="daily-data-header">Wind</p>\n      <p class="daily-data">${t.wind} <span class="small-txt">${t.windUnit}</span></p>\n      <p class="daily-data-header">Rain</p>\n      <p class="daily-data">${t.rain} <span class="small-txt">%</span></p>\n      <p class="daily-data-header">Humidity</p>\n      <p class="daily-data">${t.humidity} <span class="small-txt">%</span></p>\n      <p class="daily-data-header">Sunrise</p>\n      <p class="daily-data">${t.sunrise.split(" ")[0]} <span class="small-txt">AM</span></p>\n      <p class="daily-data-header">Sunset</p>\n      <p class="daily-data">${t.sunset.split(" ")[0]} <span class="small-txt">PM</span></p>\n    </div>\n    `,e.append(a)}static async getDailyForecast(){const a=(await t()).forecastday.slice(1),n=[];return a.forEach((t=>n.push(e.#e(t)))),n}static async getHourlyForecast(){const e=await t();return[e.forecastday[0].hour,e.forecastday[1].hour]}static async displayHourlyData(){const t=document.querySelector(".secondary-container"),a=document.querySelector(".hourly-container");t.classList.remove("active"),a.classList.add("active");const n=await e.getHourlyForecast();let s=e.getHourlyData(n);e.clearHourlyContainer(),s.forEach((t=>e.addHourlyRow(t)))}static clearHourlyContainer(){document.querySelector(".hourly-data-container").innerHTML='\n    <div class="hourly-row">\n    <div class="grid">\n      \x3c!-- <p>Time</p> --\x3e\n    </div>\n    <div class="grid"></div>\n    <div class="grid">\n      \x3c!-- <p>Condition</p> --\x3e\n    </div>\n    <div class="grid">\n      <p>Feels Like</p>\n    </div>\n    <div class="grid">\n      <p>Rain</p>\n    </div>\n    <div class="grid">\n      <p>Humidity</p>\n    </div>\n    <div class="grid">\n      <p>Wind Dir</p>\n    </div>\n    <div class="grid">\n      <p>Wind Speed</p>\n    </div>\n  </div>\n    '}static addHourlyRow(t){const e=document.createElement("div"),a=document.querySelector(".hourly-data-container");e.classList.add("hourly-row"),e.innerHTML=`\n    <div class="grid">\n            <p>${t.hour}</p>\n          </div>\n          <div class="grid"><img class="wicon" src="https:${t.icon}"\n              alt="weather-icon"></div>\n          <div class="grid">\n            <p>${t.condition}</p>\n          </div>\n          <div class="grid">\n            <p>${t.feelsLike} <span class="smaller-txt">${t.unit}</span></p>\n          </div>\n          <div class="grid">\n            <p>${t.rain} <span class="smaller-txt">%</span></p>\n          </div>\n          <div class="grid">\n            <p>${t.humidity} <span class="smaller-txt">%</span></p>\n          </div>\n          <div class="grid">\n            <p>${t.windDir}</p>\n          </div>\n          <div class="grid">\n            <p>${t.windSpeed} <span class="smaller-txt">${t.windUnit}</span></p>\n          </div>\n        </div>\n    `,a.append(e)}static getHourlyData(t){let a=e.#a(t),n=[];return a.forEach((t=>n.push(e.#n(t)))),n}static#a(t){let a;const n=e.getTimeHour(),s=t[0].slice(n),i=t[1];let d=s.length;if(d<24){let t=24-d,e=i.slice(0,t);a=[].concat(s,e),d=a.length}return a}static#n(t){const a=e.getUnit();return{hour:t.time.split(" ")[1],icon:t.condition.icon,condition:t.condition.text,feelsLike:"F"===a?t.feelslike_f:t.feelslike_c,rain:t.chance_of_rain,humidity:t.humidity,windDir:t.wind_dir,windSpeed:"F"===a?t.wind_mph:t.wind_kph,unit:a,windUnit:"F"===a?"mph":"kph"}}static#e(t){const a=t.day,n=e.getUnit();return{date:`${t.date.split("-")[1]}/${t.date.split("-")[2]}`,condition:a.condition.text,temp:"F"===n?a.avgtemp_f:a.avgtemp_c,wind:"F"===n?a.maxwind_mph:a.maxwind_kph,rain:a.daily_chance_of_rain,humidity:a.avghumidity,sunrise:t.astro.sunrise,sunset:t.astro.sunset,icon:a.condition.icon,unit:n,windUnit:"F"===n?"mph":"kph"}}static#t(t,e){const a=document.createElement("div"),n=document.createElement("div");a.classList.add("temperature-stats"),n.classList.add("flex-column"),a.innerHTML=`\n    <i class="fas fa-temperature-half"></i>\n    <p class="current-temp">${t.currentTemp}${t.temp_unit}</p>\n    `,n.innerHTML=`\n    <p class="med-txt">FEELS LIKE</p>\n    <p class="feels-like">${t.feelsLike} ${t.temp_unit}</p>\n    `,a.append(n),e.append(a)}static displayWeatherStats(t,e,a){const n=document.createElement("div"),s=document.createElement("div"),i=document.createElement("div"),d=document.createElement("div");n.classList.add("weather-stats-container"),s.classList.add("weather-data"),i.classList.add("weather-data"),d.classList.add("weather-data"),s.innerHTML=`\n    <p class="weather-data-header">HUMIDITY</p>\n    <p class="weather-data-value">${t.current.humidity}%</p>\n    `,i.innerHTML=`\n    <p class="weather-data-header">UV INDEX</p>\n    <p class="weather-data-value">${t.current.uv}</p>\n    `,d.innerHTML=`\n    <p class="weather-data-header">PRECIP.</p>\n    <p class="weather-data-value">${e.precip} <span class="small-txt">${e.precip_unit}</span></p>\n    `,n.append(s),n.append(i),n.append(d),a.append(n)}static displayWindStats(t,e,a){const n=document.createElement("div"),s=document.createElement("div"),i=document.createElement("div"),d=document.createElement("div"),c=document.createElement("div");n.classList.add("wind-main-container"),n.classList.add("flex-column"),s.classList.add("wind-data-container"),i.classList.add("wind-data"),d.classList.add("wind-data"),c.classList.add("wind-data"),n.innerHTML='<p class="weather-data-header">WIND</p>',d.innerHTML=`\n    <p class="wind-data-header">DIRECTION</p>\n    <p class="wind-data-value"><span><i class="fas fa-arrow-up"></i></span>${t.current.wind_dir}</p>\n    `,i.innerHTML=`\n    <p class="wind-data-header">SPEED</p>\n    <p class="wind-data-value">${e.currentWind} <span class="small-txt">${e.wind_unit}</span></p>\n    `,c.innerHTML=`\n    <p class="wind-data-header">GUST</p>\n    <p class="wind-data-value">${e.gust} <span class="small-txt">${e.wind_unit}</span></p>\n    `,s.append(d),s.append(i),s.append(c),n.append(s),a.append(n)}static getLocation(){let t=document.getElementById("Zip");return void 0!==document.body.dataset.lastZip?document.body.dataset.lastZip:""!==t.value?t.value:"auto:ip"}static clearInput(){let t=document.getElementById("Zip"),e=document.querySelector(".fa-check");t.value="",e.classList.remove("active")}static setEventListeners(){const t=document.getElementById("Zip"),a=document.getElementById("myToggle"),n=document.getElementById("hourly"),s=document.getElementById("threeday");n.addEventListener("click",e.displayHourlyData),s.addEventListener("click",e.displayDailyData),a.addEventListener("change",e.changeUnit),t.addEventListener("keypress",(t=>{"Enter"===t.key&&e.submitBtnAction})),t.addEventListener("keydown",e.showSubmitBtn)}static clearScreen(){document.querySelector(".main-container").innerHTML=""}static showSubmitBtn(){let t=document.querySelector(".submit");t.classList.add("active"),t.addEventListener("click",e.submitBtnAction)}static submitBtnAction(){const t=document.getElementById("Zip"),a=document.querySelector(".hourly-container");if(document.body.setAttribute("data-last-zip",t.value),e.clearInput(),e.hideSubmitBtn(),a.classList.contains("active"))return e.displayHourlyData(),void e.displayData();e.displayData(),e.displayDailyData()}static hideSubmitBtn(){document.querySelector(".submit").classList.remove("active")}static getUnit(){return document.getElementById("unit").textContent}static setPropertyUnits(t,e){return"F"==t?{temp_unit:t,wind_unit:"mph",precip_unit:"in",feelsLike:e.current.feelslike_f,gust:e.current.gust_mph,precip:e.current.precip_in,currentTemp:e.current.temp_f,currentWind:e.current.wind_mph}:{temp_unit:"C",wind_unit:"kph",precip_unit:"mm",feelsLike:e.current.feelslike_c,gust:e.current.gust_kph,precip:e.current.precip_mm,currentTemp:e.current.temp_c,currentWind:e.current.wind_kph}}static changeUnit(){const t=document.getElementById("myToggle"),a=document.getElementById("unit"),n=document.querySelector(".hourly-container");if(t.checked){if(a.textContent="C",n.classList.contains("active"))return void e.displayHourlyData();e.displayData(a)}else{if(a.textContent="F",n.classList.contains("active"))return void e.displayHourlyData();e.displayData(a)}}static animateArrow(t){const e=document.querySelector(".fa-arrow-up"),a=t.current.wind_degree;e.style.transform=`rotate(${a}deg)`}static getTimeHour(){return(new Date).getHours()}static setBgImage(t){const a="./assets/imgs/rain-night.jpg";let n=e.checkDayOrNight(),s=e.getWeatherCondition(t);const i=document.getElementById("Background1");if("day"===n){let t="",e=document.getElementById("Background2");return e.classList.remove("hidden"),"clear"==s&&(t+="./assets/imgs/sun.jpg"),"partly-cloudy"==s&&(t+="./assets/imgs/partly-cloudy-day.jpg"),"overcast"==s&&(t+="./assets/imgs/overcast.jpg"),"blizzard"==s&&(t+="./assets/imgs/blizzard.jpg"),"light-rain"==s&&(t+="./assets/imgs/light-rain.jpg"),"rain"==s&&(t+="./assets/imgs/rain.jpg"),"thunderstorm"==s&&(t+="./assets/imgs/thunderstorm.jpg"),"snow"==s&&(t+="./assets/imgs/snow.jpg"),"fog"==s&&(t+="./assets/imgs/fog.jpg"),e.src=t,i.classList.add("hidden"),t}if("night"==n){let t="";return"clear"==s&&(t+="./assets/imgs/clear-night.jpg"),"partly-cloudy"==s&&(t+="./assets/imgs/partly-cloudy-night.jpg"),"overcast"==s&&(t+="./assets/imgs/overcast-night.jpg"),"blizzard"==s&&(t+="./assets/imgs/blizzard-night.jpg"),"light-rain"==s&&(t+=a),"rain"==s&&(t+=a),"thunderstorm"==s&&(t+=a),"snow"==s&&(t+="./assets/imgs/snow-night.jpg"),"fog"==s&&(t+="./assets/imgs/night-fog.jpg"),document.getElementById("Background2").src=t,i.classList.add("hidden"),t}{let t=document.getElementById("Background");console.log("default image"),t.src="./assets/imgs/default.jpg"}}static getWeatherCondition(t){const e={1e3:"clear",1003:"partly-cloudy",1009:"overcast",1117:"blizzard"};return t in e?e[t]:[1063,1069,1072,1150,1153,1168,1171,1180,1183,1198,1204,1240,1249].includes(t)?"light-rain":[1186,1189,1192,1195,1201,1207,1243,1246,1252].includes(t)?"rain":[1087,1273,1276].includes(t)?"thunderstorm":[1066,1114,1210,1213,1216,1219,1222,1225,1237,1255,1258,1261,1264].includes(t)?"snow":[1030,1135,1147].includes(t)?"fog":void 0}static checkDayOrNight(){const t=e.getTimeHour();return[6,7,8,9,10,11,12,13,14,15,16,17].includes(t)?"day":"night"}}document.addEventListener("DOMContentLoaded",(()=>{e.clearInput(),e.setEventListeners(),e.changeUnit(),e.displayDailyData()}))})();