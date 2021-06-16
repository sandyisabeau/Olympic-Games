let stage;
let stageHeight, stageWidth;
let data, cityContinents; //for general data preparation
let summerGames, winterGames, cumulatedSummerGames, cumulatedWinterGames; // for spiral
let medalistsAtSummerGames, medalistsAtWinterGames; // for map
let medalsSummer, medalsWinter;
let segmentedAthletes; //for diagram
let dot;

let showSpiral;
showSpiral = true;

let showMap;
showMap = false;

let showDiagram;
showDiagram = false;


let currentFilters = [];
let currentData

function addToFilters(prop) {
    currentFilters.push(prop);
    currentFilters.pop();
}

function getDataSubset() {
    return gmynd.cumulateData(segmentedAthletes, ["Sex", ...currentFilters]);
}

$(function() {
    $('.summer').hide();
    $('.winter').hide();
    $('.age').hide();
    $('.weight').hide();
    $('.height').hide();
    stage = $('#stage');
    stageHeight = stage.height();
    stageWidth = stage.width();
    prepareData();
    drawSpiral();
});

function prepareData() {

    //Functions to merge all datasets
    data = gmynd.mergeData(gameData, positionData, "NOC", "alpha3Code");
    data = gmynd.mergeData(data, continentalData, "NOC", "iso3");

    //Filter to remove incomplete Data
    data = gmynd.filterPropType(data, "Weight", "Number");
    data = gmynd.filterPropType(data, "Height", "Number");
    data = gmynd.filterPropType(data, "Age", "Number");

    //Function to merge the continents of the city in which the games took place    
    cityContinents = gmynd.mergeData(data, cityData, "City");

    //Filter to delete incomplete Data
    gmynd.deletePropsInData(data, ["alpha2Code", "iso2", "numericCode", "country", "number"]);

    // -----------------------------------------------------------------------------------------------

    //Functions to separate Winter and Summer Games (for Spiral)
    summerGames = gmynd.findAllByValue(cityContinents, "Season", "Summer");
    winterGames = gmynd.findAllByValue(cityContinents, "Season", "Winter");

    // Functions to calculate Winter and Summer Games (for Spiral)
    cumulatedSummerGames = gmynd.cumulateData(summerGames, ["Year", "City", "continent"]);
    cumulatedWinterGames = gmynd.cumulateData(winterGames, ["Year", "City", "continent"]);

    //Functions to separate Winter and Summer Games (for Map)
    medalistsAtSummerGames = gmynd.findAllByValue(data, "Season", "Summer");
    medalistsAtWinterGames = gmynd.findAllByValue(data, "Season", "Winter");

    //Functions to calculate the number of different medals
    medalsSummer = gmynd.groupData(medalistsAtSummerGames, ['countryName', 'Medal']);
    medalsWinter = gmynd.groupData(medalistsAtWinterGames, ['countryName', 'Medal']);
    console.log(medalsSummer);

    // Function to see number of medalists
    medalistsAtSummerGames = gmynd.cumulateData(medalistsAtSummerGames, ["longitude", "latitude", "countryName"]);
    medalistsAtWinterGames = gmynd.cumulateData(medalistsAtWinterGames, ["longitude", "latitude", "countryName"]);

    //Functions to separate male and female medalists
    segmentedAthletes = gmynd.addPropSegment(data, "Age", 20);
    segmentedAthletes = gmynd.addPropSegment(data, "Height", 20);
    segmentedAthletes = gmynd.addPropSegment(data, "Weight", 20);
    //segmentedAthletes = gmynd.cumulateData(segmentedAthletes, ["Sex", "HeightSegmentOf8", "WeightSegmentOf8"]);
    console.log(segmentedAthletes);

    //Functions to group the different types of medals in relation to gender
    // femaleMedalists = gmynd.groupData(femaleMedalists, "Medal");
    // maleMedalists = gmynd.groupData(maleMedalists, "Medal");
}


function drawSpiral() {
    showSpiral = true;

    $('.summer').hide();
    $('.winter').hide();
    $('.age').hide();
    $('.weight').hide();
    $('.height').hide();

    const startX = stageWidth / 2;
    const startY = stageHeight / 2;
    // const athletesPerSummerGame = gmynd.dataExtremes(cumulatedSummerGames, "count");
    // const athletesPerWinterGame = gmynd.dataExtremes(cumulatedWinterGames, "count");

    cumulatedSummerGames.forEach(summerGame => {
        let angle = (summerGame.Year - 1896) * 2.9;
        angle = gmynd.radians(angle - 90);
        const area = gmynd.map(summerGame.count, 19, 2031, 50, 750);
        const rSpiral = gmynd.circleRadius(area);

        let xSpiral = (startX + (Math.cos(angle)) * ((summerGame.Year - 1896) / 4 + 250) - rSpiral); // cosinus vom winkel
        let ySpiral = (startY + (Math.sin(angle)) * ((summerGame.Year - 1896) / 4 + 250) - rSpiral); // sinus vom winkel

        let spiralDot = $('<div></div>');
        spiralDot.addClass("Game");
        let spiralDotColor;

        if (summerGame.continent == "Europe") {
            spiralDotColor = '#2796EA';
        } else if (summerGame.continent == "Asia") {
            spiralDotColor = '#FF9839';
        } else if (summerGame.continent == "Oceania") {
            spiralDotColor = '#22AE70';
        } else if (summerGame.continent == "North America") {
            spiralDotColor = '#DF366E';
        } else if (summerGame.continent == "South America") {
            spiralDotColor = '#DF366E';
        }

        spiralDot.css({
            'height': rSpiral * 2,
            'width': rSpiral * 2,
            'left': xSpiral,
            'top': ySpiral,
            'position': 'absolute',
            'border-radius': '100%',
            'background-color': spiralDotColor,
        });
        spiralDot.data(summerGame);
        stage.append(spiralDot);

        spiralDot.mouseover(() => {
            spiralDot.addClass("hover");
            //Season        
            $('#hoverSeason').text('Olympic Summer Game');
            $('#hoverSeason').css({
                'color': 'white',
            });
            //Continent
            $('#hoverContinent').text(summerGame.continent);
            $('#hoverContinent').css({
                'color': spiralDotColor,
            });
            //Year
            $('#hoverYear').text(summerGame.Year);
            $('#hoverYear').css({
                'color': 'white',
            });
            //City
            $('#hoverCity').text(summerGame.City);
            $('#hoverCity').css({
                'color': 'white',
            });
            //Medalists
            $('#hoverMedalist').text(summerGame.count + ' Medalists');
            $('#hoverMedalist').css({
                'color': 'white',
            });
        });

        spiralDot.mouseout(() => {
            spiralDot.removeClass("hover");
            $('#hoverSeason').text("");
            $('#hoverContinent').text("");
            $('#hoverYear').text("");
            $('#hoverCity').text("");
            $('#hoverMedalist').text("");
        });
    });

    cumulatedWinterGames.forEach(winterGame => {
        let angle = (winterGame.Year - 1896) * 2.9;
        angle = gmynd.radians(angle - 90);
        const area = gmynd.map(winterGame.count, 19, 2031, 50, 750);
        const rSpiral = gmynd.circleRadius(area);

        let xSpiral = (startX + (Math.cos(angle)) * ((winterGame.Year - 1896) / 4 + 350) - rSpiral); // cosinus vom winkel
        let ySpiral = (startY + (Math.sin(angle)) * ((winterGame.Year - 1896) / 4 + 350) - rSpiral); // sinus vom winkel

        let spiralDot = $('<div></div>');
        spiralDot.addClass("Game");

        let spiralDotColor;

        if (winterGame.continent == "Europe") {
            spiralDotColor = '#2796EA';
        } else if (winterGame.continent == "Asia") {
            spiralDotColor = '#FF9839';
        } else if (winterGame.continent == "Oceania") {
            spiralDotColor = '#22AE70';
        } else if (winterGame.continent == "North America") {
            spiralDotColor = '#DF366E';
        } else if (winterGame.continent == "South America") {
            spiralDotColor = '#DF366E';
        }

        spiralDot.css({
            'height': rSpiral * 2,
            'width': rSpiral * 2,
            'left': xSpiral,
            'top': ySpiral,
            'position': 'absolute',
            'border-radius': '100%',
            'background-color': spiralDotColor,
        });

        spiralDot.data(winterGame);
        stage.append(spiralDot);

        spiralDot.mouseover(() => {
            spiralDot.addClass("hover");
            //Season        
            $('#hoverSeason').text('Olympic Winter Game');
            $('#hoverSeason').css({
                'color': 'white',
            });
            //Continent
            $('#hoverContinent').text(winterGame.continent);
            $('#hoverContinent').css({
                'color': spiralDotColor,
            });
            //Year
            $('#hoverYear').text(winterGame.Year);
            $('#hoverYear').css({
                'color': 'white',
            });
            //City
            $('#hoverCity').text(winterGame.City);
            $('#hoverCity').css({
                'color': 'white',
            });
            //Medalists
            $('#hoverMedalist').text(winterGame.count + ' Medalists');
            $('#hoverMedalist').css({
                'color': 'white',
            });
        });

        spiralDot.mouseout(() => {
            spiralDot.removeClass("hover");
            $('#hoverSeason').text("");
            $('#hoverContinent').text("");
            $('#hoverYear').text("");
            $('#hoverCity').text("");
            $('#hoverMedalist').text("");
        });
    });
}

function drawMap() {
    showMap = true;
    $('.summer').show();
    $('.winter').show();
    $('.age').hide();
    $('.weight').hide();
    $('.height').hide();

    medalistsAtSummerGames.forEach(country => {
        $('.medalistsAtSummerGames').show();

        const area = gmynd.map(country.count, 1, 3875, 50, 2000);
        const rMap = gmynd.circleRadius(area);
        const xMap = gmynd.map(country.longitude, -140, 200, 0, stageWidth) - rMap;
        const yMap = gmynd.map(country.latitude, -100, 100, stageHeight, 0) - rMap;

        if (country.countryName == medalsSummer.countryName) {

        }

        let dot = $('<div></div>');
        dot.addClass("medalistsAtSummerGames");
        dot.css({
            'height': rMap * 2,
            'width': rMap * 2,
            'left': xMap,
            'top': yMap,
            'border-radius': '100%',
        });
        dot.data(country);
        stage.append(dot);

        dot.mouseover(() => {
            $('.medalistsAtSummerGames').addClass("hoverSummer");
            dot.removeClass("hoverSummer");
            //Season        
            $('#hoverSeasonMap').text('Olympic Summer Game');
            $('#hoverSeasonMap').css({
                'color': 'white',
            });
            //Continent
            $('#hoverCountryMap').text(country.countryName);
            $('#hoverCountryMap').css({
                'color': "#FF7A00",
            });
            //Year
            $('#hoverMedalistMap').text(country.count + ' Medalists');
            $('#hoverMedalistMap').css({
                'color': 'white',
            });
        });

        dot.mouseout(() => {
            $('.medalistsAtSummerGames').removeClass("hoverSummer");
            $('#hoverSeasonMap').text("");
            $('#hoverCountryMap').text("");
            $('#hoverMedalistMap').text("");
        });
    });

    medalistsAtWinterGames.forEach(country => {
        $('.medalistsAtWinterGames').show();

        const area = gmynd.map(country.count, 1, 3875, 50, 2000);
        const rMap = gmynd.circleRadius(area);
        const xMap = gmynd.map(country.longitude, -140, 200, 0, stageWidth) - rMap;
        const yMap = gmynd.map(country.latitude, -100, 100, stageHeight, 0) - rMap;
        let dot = $('<div></div>');
        dot.addClass("medalistsAtWinterGames");
        dot.css({
            'height': rMap * 2,
            'width': rMap * 2,
            'left': xMap,
            'top': yMap,
            'border-radius': '100%',
        });
        dot.data(country);
        stage.append(dot);

        dot.mouseover(() => {
            $('.medalistsAtSummerGames').addClass("hoverWinter");
            //Season        
            $('#hoverSeasonMap').text('Olympic Winter Game');
            $('#hoverSeasonMap').css({
                'color': 'white',
            });
            //Continent
            $('#hoverCountryMap').text(country.countryName);
            $('#hoverCountryMap').css({
                'color': "#00C2FF",
            });
            //Year
            $('#hoverMedalistMap').text(country.count + ' Medalists');
            $('#hoverMedalistMap').css({
                'color': 'white',
            });
        });

        dot.mouseout(() => {
            $('.medalistsAtSummerGames').removeClass("hoverWinter");
            $('#hoverSeason').text("");
            $('#hoverCountry').text("");
            $('#hoverMedalists').text("");
        });
    });


}

function drawDiagram() {
    showDiagram = true;
    $('.summer').hide();
    $('.winter').hide();
    $('.age').show();
    $('.weight').show();
    $('.height').show();

    // // Diagram based on height and weight
    //     currentFilters = ["HeightSegmentOf20", "WeightSegmentOf20"];
    //     currentData = getDataSubset();

    //     currentData.forEach(medalistGroup => {
    //         const area = gmynd.map(medalistGroup.count, 1, 4971, 50, 6000);
    //         const rDiagram = gmynd.circleRadius(area);
    //         const xDiagram = gmynd.map(medalistGroup.WeightSegmentOf20, 0, 19, 100, 1850) - rDiagram;
    //         const yDiagram = gmynd.map(medalistGroup.HeightSegmentOf20, 0, 19, 200, 1000) - rDiagram;

    //         let dot = $('<div></div>');
    //         dot.addClass("medalistGroup");
    //         dot.css({
    //             'height': rDiagram * 2,
    //             'width': rDiagram * 2,
    //             'left': xDiagram,
    //             'top': yDiagram,
    //             'position': 'absolute',
    //             'background-color': 'white',
    //             'border-radius': '100%',
    //         });
    //         dot.data(medalistGroup);
    //         stage.append(dot);
    //         console.log(yDiagram)
    //     });

    // // Diagram based on Age and Height
    // currentFilters = ["AgeSegmentOf20", "HeightSegmentOf20"];
    // currentData = getDataSubset();

    // currentData.forEach(medalistGroup => {
    //     const area = gmynd.map(medalistGroup.count, 1, 4971, 50, 6000);
    //     const rDiagram = gmynd.circleRadius(area);
    //     const xDiagram = gmynd.map(medalistGroup.AgeSegmentOf20, 0, 19, 100, 1850) - rDiagram;
    //     const yDiagram = gmynd.map(medalistGroup.HeightSegmentOf20, 0, 19, 200, 1000) - rDiagram;

    //     let dot = $('<div></div>');
    //     dot.addClass("medalistGroup");
    //     dot.css({
    //         'height': rDiagram * 2,
    //         'width': rDiagram * 2,
    //         'left': xDiagram,
    //         'top': yDiagram,
    //         'position': 'absolute',
    //         'background-color': 'white',
    //         'border-radius': '100%',
    //     });
    //     dot.data(medalistGroup);
    //     stage.append(dot);
    //     console.log(yDiagram)
    // });

    // // Diagram based on Age and Weight
    currentFilters = ["AgeSegmentOf20", "WeightSegmentOf20"];
    currentData = getDataSubset();

    currentData.forEach(medalistGroup => {
        const area = gmynd.map(medalistGroup.count, 1, 4971, 50, 6000);
        const rDiagram = gmynd.circleRadius(area);
        const xDiagram = gmynd.map(medalistGroup.AgeSegmentOf20, 0, 19, 100, 1850) - rDiagram;
        const yDiagram = gmynd.map(medalistGroup.WeightSegmentOf20, 0, 19, 200, 1000) - rDiagram;

        let dot = $('<div></div>');
        dot.addClass("medalistGroup");
        dot.css({
            'height': rDiagram * 2,
            'width': rDiagram * 2,
            'left': xDiagram,
            'top': yDiagram,
            'position': 'absolute',
            'background-color': 'white',
            'border-radius': '100%',
        });
        dot.data(medalistGroup);
        stage.append(dot);
        console.log(yDiagram)
    });
}

function gameView() {
    stage.empty();
    drawSpiral();
    $('.spiral').css({
        'color': "white",
    });

    $('.map').css({
        'color': 'rgba(255, 255, 255, 0.5)',
    });

    $('.diagram').css({
        'color': 'rgba(255, 255, 255, 0.5)',
    });
    console.log("gameView");
}

function teamView() {
    stage.empty();
    drawMap();
    $('.spiral').css({
        'color': 'rgba(255, 255, 255, 0.5)',
    });

    $('.map').css({
        'color': "white",
    });

    $('.diagram').css({
        'color': 'rgba(255, 255, 255, 0.5)',
    });
    $('.summer').css({
        'color': 'white',
    });
    console.log("teamView");
}

function medalistView() {
    stage.empty();
    drawDiagram();
    $('.spiral').css({
        'color': 'rgba(255, 255, 255, 0.5)',
    });

    $('.map').css({
        'color': 'rgba(255, 255, 255, 0.5)',
    });

    $('.diagram').css({
        'color': "white",
    });
    console.log("medalistView");
}

function summerView() {
    stage.empty();
    $('.medalistsAtSummerGames').show();
    $('.medalistsAtWinterGames').hide();

    $('.summer').css({
        'color': 'white',
    });

    $('.winter').css({
        'color': 'rgba(255, 255, 255, 0.5)',
    });

    console.log("summerView");
}

function winterView() {
    stage.empty();
    $('.medalistsAtSummerGames').hide();
    $('.medalistsAtWinterGames').show();

    $('.summer').css({
        'color': 'rgba(255, 255, 255, 0.5)',
    });

    $('.winter').css({
        'color': 'white',
    });

    console.log("winterView");
}

function ageView() {
    stage.empty();
    console.log("AgeView");
}

function weightView() {
    stage.empty();
    console.log("WeightView");
}

function heightView() {
    stage.empty();
    console.log("HeightView");
}

//Wie kann ich die Medaillen aufschlüsseln? 
//Geht das über das Object oder brauche ich eine neue Funktion/Berechnung?
//Wie kann ich Athleten gruppieren bzw. einer Gruppe einen Abschnitt auf einer Achse zuweisen?
//Wie lassen sich den Achsen unterschiedliche "Eigenschaften" zuwesien? 
//Verlinkung von Sommer und Winter? Also das etwas was in einer Function steht nicht zeitgleich angezeigt wird?
//Wie kann ich die Map besser codieren also mit einem createDots()?