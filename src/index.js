import UI from "../src/modules/ui.js";

const main = () => {
  UI.clearInput();
  UI.setEventListeners();
  UI.changeUnit();
};

document.addEventListener("DOMContentLoaded", main);
