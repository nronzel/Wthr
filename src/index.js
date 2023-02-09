import UI from "../src/modules/ui.js";

const main = () => {
  UI.clearInput();
  UI.setEventListeners();
  UI.changeUnit();
  UI.displayDailyData();
};

document.addEventListener("DOMContentLoaded", main);
