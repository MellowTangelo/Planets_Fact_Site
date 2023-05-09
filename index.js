const menu = document.querySelector(".menu-items");
fetch('./Sources/data.json')
    .then(res => res.json())
    .then(data => {
        data.forEach(element => {
            menu.insertAdjacentHTML('beforeend',
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
            </li>`);
        });

        let currentPlanetIndex = 0;

        const circleColor = [
            '#DEF4FC',
            '#F7CC7F',
            '#545BFE',
            '#FF6A45',
            '#ECAD7A',
            '#FCCB6B',
            '#65F0D5',
            '#497EFA',
        ];

        const afterColor = [
            '#419EBB',
            '#EDA249',
            '#6D2ED5',
            '#D14C32',
            '#D83A34',
            '#CD5120',
            '#1EC1A2',
            '#2D68F0',
        ];
        
        const planetColorCircles = document.querySelectorAll(".menu-planet-circle");
        for (let i=0; i < planetColorCircles.length; i++){
            planetColorCircles[i].style.fill = circleColor[i];
        
        }

        const hamburgerButton = document.querySelector(".hamburger-button");

        hamburgerButton.addEventListener("click", toggleMenu);

        function toggleMenu() {
            hamburgerButton.classList.toggle('show');
            if(menu.classList.contains('show')) {
                menu.classList.toggle('show');
                setTimeout(() => {menu.classList.toggle('appear');}, 400);
            }
            else {
                menu.classList.toggle('appear');
                setTimeout(() => {menu.classList.toggle('show');}, 0);
            }
        }

        const overviewButton = document.querySelector(".overview");
        overviewButton.classList.add('active');
        const structureButton = document.querySelector(".structure");
        const surfaceButton = document.querySelector(".surface");

        const planetInfo = document.querySelector(".planet-info-text");
        const imageContainer = document.querySelector('.planet-image');
        const wikiLink = document.querySelector(".wiki-link");
        
        overviewButton.addEventListener("click", switchView.bind(null, 0));
        structureButton.addEventListener("click", switchView.bind(null, 1));
        surfaceButton.addEventListener("click", switchView.bind(null, 2));

        function changeSVG(svgPath){
            var xhr = new XMLHttpRequest();
            xhr.open('GET', svgPath, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var svgContent = xhr.responseText;
                    imageContainer.innerHTML = svgContent;
                }
            };
            xhr.send();
        }

        function switchView(index) {
            if(index == 0 && !overviewButton.classList.contains('active')){
                overviewButton.classList.add('active');
                structureButton.classList.remove('active');
                surfaceButton.classList.remove('active');
                
                planetInfo.style.opacity = 0;
                imageContainer.style.opacity = 0;

                setTimeout(function() {
                    changeSVG(data[currentPlanetIndex].images.planet);
                    planetInfo.textContent = data[currentPlanetIndex].overview.content;
                    wikiLink.href = data[currentPlanetIndex].overview.source;
                    planetInfo.style.opacity = 1;
                    imageContainer.style.opacity = 1;
                    }, 300);
            }
            else if(index == 1 && !structureButton.classList.contains('active')){
                overviewButton.classList.remove('active');
                structureButton.classList.add('active');
                surfaceButton.classList.remove('active');

                planetInfo.style.opacity = 0;
                imageContainer.style.opacity = 0;

                setTimeout(function() {
                    changeSVG(data[currentPlanetIndex].images.internal);
                    planetInfo.textContent = data[currentPlanetIndex].structure.content;
                    wikiLink.href = data[currentPlanetIndex].structure.source;
                    planetInfo.style.opacity = 1;
                    imageContainer.style.opacity = 1;
                    }, 300);
            }
            else if(index == 2 && !surfaceButton.classList.contains('active')){
                overviewButton.classList.remove('active');
                structureButton.classList.remove('active');
                surfaceButton.classList.add('active');

                planetInfo.style.opacity = 0;
                imageContainer.style.opacity = 0;

                setTimeout(function() {
                    changeSVG(data[currentPlanetIndex].images.planet);
                    planetInfo.textContent = data[currentPlanetIndex].geology.content;
                    wikiLink.href = data[currentPlanetIndex].geology.source;
                    planetInfo.style.opacity = 1;
                    imageContainer.style.opacity = 1;
                    }, 300);
            }
        }

        const planetButtons = document.querySelectorAll(".menu-item-button");
        const planetName = document.querySelector(".planet-name");
        const planetImage = document.querySelector(".planet-image");
        const planetRotation = document.querySelector("#rotation");
        const planeteRevolution = document.querySelector("#revolution");
        const planetRadius = document.querySelector("#radius");
        const planetTemperature = document.querySelector("#temperature");

        const overview = document.querySelector(".overview");
        overview.style.setProperty("--after-bg-color", afterColor[0]);

        const structure = document.querySelector(".structure");
        structure.style.setProperty("--after-bg-color", afterColor[0]);

        const surface = document.querySelector(".surface");
        surface.style.setProperty("--after-bg-color", afterColor[0]);

        planetButtons.forEach((button, index) => {
            button.addEventListener("click", switchPlanetInfo.bind(null, index))
        });

        function switchPlanetInfo(index){
            planetName.style.opacity = 0;
            planetImage.style.opacity = 0;
            planetRotation.style.opacity = 0;
            planeteRevolution.style.opacity = 0;
            planetRadius.style.opacity = 0;
            planetTemperature.style.opacity = 0;
            planetInfo.style.opacity = 0;
            currentPlanetIndex = index;
            overview.style.setProperty("--after-bg-color", afterColor[index]);
            structure.style.setProperty("--after-bg-color", afterColor[index]);
            surface.style.setProperty("--after-bg-color", afterColor[index]);

            setTimeout(function() {
                planetName.textContent = data[index].name;
                planetRotation.textContent = data[index].rotation;
                planeteRevolution.textContent = data[index].revolution;
                planetRadius.textContent = data[index].radius;
                planetTemperature.textContent = data[index].temperature;
    
                if(overviewButton.classList.contains('active')){
                    planetInfo.textContent = data[index].overview.content;
                    wikiLink.href = data[currentPlanetIndex].overview.source;
                    changeSVG(data[currentPlanetIndex].images.planet);
                }
                else if(structureButton.classList.contains('active')){
                    planetInfo.textContent = data[index].structure.content;
                    wikiLink.href = data[currentPlanetIndex].structure.source;
                    changeSVG(data[currentPlanetIndex].images.internal);
                }
                else if(surfaceButton.classList.contains('active')){
                    planetInfo.textContent = data[index].geology.content;
                    wikiLink.href = data[currentPlanetIndex].geology.source;
                    changeSVG(data[currentPlanetIndex].images.planet);
                }

                planetName.style.opacity = 1;
                planetImage.style.opacity = 1;
                planetRotation.style.opacity = 1;
                planeteRevolution.style.opacity = 1;
                planetRadius.style.opacity = 1;
                planetTemperature.style.opacity = 1;
                planetInfo.style.opacity = 1;
                }, 300);
        }
    });
    



