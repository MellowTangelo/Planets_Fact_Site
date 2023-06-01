/**
 * Returns data from JSON file.
 * @return {[object]} Data from JSON file.
 */
async function fetchData() {
  try {
    const response = await fetch("./Sources/data.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

fetchData().then((data) => {
  const menu = document.querySelector(".menu-items");
  data.forEach((element) => {
    menu.insertAdjacentHTML(
      "beforeend",
      `<li class="menu-item">
            <button class="menu-item-button">
                <div class="menu-planet-container">
                    <svg class="menu-planet-circle" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="10"/>
                    </svg>
                <p class="menu-planet-name">${element.name}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="6" height="8"><path fill="none" stroke="#FFF" opacity=".4" d="M1 0l4 4-4 4"/></svg>
            </button>
        </li>`
    );
  });

  /*Define constants and initialize variables*/

  let currentPlanetIndex = 0;
  const circleColor = [
    "#DEF4FC",
    "#F7CC7F",
    "#545BFE",
    "#FF6A45",
    "#ECAD7A",
    "#FCCB6B",
    "#65F0D5",
    "#497EFA",
  ];
  const afterColor = [
    "#419EBB",
    "#EDA249",
    "#6D2ED5",
    "#D14C32",
    "#D83A34",
    "#CD5120",
    "#1EC1A2",
    "#2D68F0",
  ];

  const planetColorCircles = document.querySelectorAll(".menu-planet-circle");
  const hamburgerButton = document.querySelector(".hamburger-button");
  const overviewButton = document.querySelector(".overview");
  const structureButton = document.querySelector(".structure");
  const surfaceButton = document.querySelector(".surface");
  const planetInfo = document.querySelector(".planet-info-text");
  const imageContainer = document.querySelector(".planet-image");
  const wikiLink = document.querySelector(".wiki-link");
  const planetButtons = document.querySelectorAll(".menu-item-button");
  const planetName = document.querySelector(".planet-name");
  const planetRotation = document.querySelector("#rotation");
  const planeteRevolution = document.querySelector("#revolution");
  const planetRadius = document.querySelector("#radius");
  const planetTemperature = document.querySelector("#temperature");

  overviewButton.classList.add("active");
  overviewButton.style.setProperty("--after-bg-color", afterColor[0]);
  structureButton.style.setProperty("--after-bg-color", afterColor[0]);
  surfaceButton.style.setProperty("--after-bg-color", afterColor[0]);
  for (let i = 0; i < planetColorCircles.length; i++) {
    planetColorCircles[i].style.fill = circleColor[i];
  }

  /* Register event listeners */

  overviewButton.addEventListener("click", () => {
    switchView(0);
  });
  structureButton.addEventListener("click", () => {
    switchView(1);
  });
  surfaceButton.addEventListener("click", () => {
    switchView(2);
  });

  hamburgerButton.addEventListener("click", toggleMenu);

  window.addEventListener("resize", defaultMenuSettings);

  planetButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      switchPlanetInfo(index);
    });
    button.style.setProperty("--after-bg-color", afterColor[index]);
  });

  /*Define helper functions*/

  /**
   * Toggles menu in navigation bar while in mobile layout.
   */
  function toggleMenu() {
    hamburgerButton.classList.toggle("show");
    if (menu.classList.contains("show")) {
      menu.classList.toggle("show");
      setTimeout(() => {
        menu.classList.toggle("appear");
      }, 400);
    } else {
      menu.classList.toggle("appear");
      setTimeout(() => {
        menu.classList.toggle("show");
      }, 0);
    }
  }

  /**
   * Changes active SVG representing a drawing of a planet.
   * @param  {[string]} svgPath Path to SVG file.
   * @param  {[string]} planetSurfaceSrcFile Path to PNG file of planet's surface.
   * @param {[boolean]} isSurface Flag that checks if user clicked on surface button.
   */
  function changeSVG(svgPath, planetSurfaceSrcFile, isSurface) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", svgPath, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var svgContent = xhr.responseText;
        var planetSurface = "";
        if (isSurface) {
          planetSurface = `<img width="75" class="planet-surface" alt="Surface of a planet" src=${planetSurfaceSrcFile}>`;
        }

        imageContainer.innerHTML = svgContent + planetSurface;
      }
    };
    xhr.send();
  }

  /**
   * Switches view depending on buttons: Overview, (Internal) Structure, Surface (Geology).
   * @param  {[number]} index 0 -> Overview,, 1 -> (Internal) Structure, 2 -> Surface (Geology).
   */
  function switchView(index) {
    if (index === 0 && !overviewButton.classList.contains("active")) {
      overviewButton.classList.add("active");
      structureButton.classList.remove("active");
      surfaceButton.classList.remove("active");

      planetInfo.style.opacity = 0;
      imageContainer.style.opacity = 0;

      setTimeout(function () {
        changeSVG(
          data[currentPlanetIndex].images.planet,
          data[currentPlanetIndex].images.geology,
          false
        );
        planetInfo.textContent = data[currentPlanetIndex].overview.content;
        wikiLink.href = data[currentPlanetIndex].overview.source;
        planetInfo.style.opacity = 1;
        imageContainer.style.opacity = 1;
      }, 300);
    } else if (index === 1 && !structureButton.classList.contains("active")) {
      overviewButton.classList.remove("active");
      structureButton.classList.add("active");
      surfaceButton.classList.remove("active");

      planetInfo.style.opacity = 0;
      imageContainer.style.opacity = 0;

      setTimeout(function () {
        changeSVG(
          data[currentPlanetIndex].images.internal,
          data[currentPlanetIndex].images.geology,
          false
        );
        planetInfo.textContent = data[currentPlanetIndex].structure.content;
        wikiLink.href = data[currentPlanetIndex].structure.source;
        planetInfo.style.opacity = 1;
        imageContainer.style.opacity = 1;
      }, 300);
    } else if (index === 2 && !surfaceButton.classList.contains("active")) {
      overviewButton.classList.remove("active");
      structureButton.classList.remove("active");
      surfaceButton.classList.add("active");

      planetInfo.style.opacity = 0;
      imageContainer.style.opacity = 0;

      setTimeout(function () {
        changeSVG(
          data[currentPlanetIndex].images.planet,
          data[currentPlanetIndex].images.geology,
          true
        );
        planetInfo.textContent = data[currentPlanetIndex].geology.content;
        wikiLink.href = data[currentPlanetIndex].geology.source;
        planetInfo.style.opacity = 1;
        imageContainer.style.opacity = 1;
      }, 300);
    }
  }

  /**
   * Switches planet depending on buttons in the navigation bar (see "menu-items" in html file).
   * @param  {[number]} index Each index represents a planet starting from the Mercury.
   */
  function switchPlanetInfo(index) {
    if (currentPlanetIndex !== index) {
      planetName.style.opacity = 0;
      imageContainer.style.opacity = 0;
      planetRotation.style.opacity = 0;
      planeteRevolution.style.opacity = 0;
      planetRadius.style.opacity = 0;
      planetTemperature.style.opacity = 0;
      planetInfo.style.opacity = 0;
      currentPlanetIndex = index;
      overviewButton.style.setProperty("--after-bg-color", afterColor[index]);
      structureButton.style.setProperty("--after-bg-color", afterColor[index]);
      surfaceButton.style.setProperty("--after-bg-color", afterColor[index]);

      planetButtons.forEach((button, index) => {
        if (index === currentPlanetIndex) {
          button.classList.add("active");
        } else {
          button.classList.remove("active");
        }
      });

      setTimeout(function () {
        planetName.textContent = data[index].name;
        planetRotation.textContent = data[index].rotation;
        planeteRevolution.textContent = data[index].revolution;
        planetRadius.textContent = data[index].radius;
        planetTemperature.textContent = data[index].temperature;

        if (overviewButton.classList.contains("active")) {
          planetInfo.textContent = data[index].overview.content;
          wikiLink.href = data[currentPlanetIndex].overview.source;
          changeSVG(
            data[currentPlanetIndex].images.planet,
            data[currentPlanetIndex].images.geology,
            false
          );
        } else if (structureButton.classList.contains("active")) {
          planetInfo.textContent = data[index].structure.content;
          wikiLink.href = data[currentPlanetIndex].structure.source;
          changeSVG(
            data[currentPlanetIndex].images.internal,
            data[currentPlanetIndex].images.geology,
            false
          );
        } else if (surfaceButton.classList.contains("active")) {
          planetInfo.textContent = data[index].geology.content;
          wikiLink.href = data[currentPlanetIndex].geology.source;
          changeSVG(
            data[currentPlanetIndex].images.planet,
            data[currentPlanetIndex].images.geology,
            true
          );
        }

        planetName.style.opacity = 1;
        imageContainer.style.opacity = 1;
        planetRotation.style.opacity = 1;
        planeteRevolution.style.opacity = 1;
        planetRadius.style.opacity = 1;
        planetTemperature.style.opacity = 1;
        planetInfo.style.opacity = 1;
      }, 300);
    }

    if (window.innerWidth < 650) {
      toggleMenu();
    }
  }

  /**
   * Reinitializes menu in navigation bar, if user exits mobile layout by widening the screen.
   */
  function defaultMenuSettings() {
    let windowSize = window.innerWidth;

    if (windowSize > 650) {
      menu.classList.remove("appear");
      menu.classList.remove("show");
      hamburgerButton.classList.remove("show");
    }
  }
});
