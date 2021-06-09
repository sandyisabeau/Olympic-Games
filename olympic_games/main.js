let stageHeight, stageWidth;
let data, cityContinents, groupedData, summerGames, winterGames, cumulatedSummerGames, cumulatedWinterGames, medalistsAtSummerGames, medalistsAtWinterGames, allMedalists;
let stage;
let dot
    // let showingChart;
$(function() {
    stage = $('#stage');
    stageHeight = stage.height();
    stageWidth = stage.width();
    prepareData();
    // continentColor();
    // createDots();
    // drawTimespiral();
    drawSpiral();
    // drawMap();
    // drawDiagram();
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

    //Functions to separate Winter and Summer Games (for Spiral)
    summerGames = gmynd.findAllByValue(cityContinents, "Season", "Summer");
    winterGames = gmynd.findAllByValue(cityContinents, "Season", "Winter");

    // Functions to calculate Winter and Summer Games (for Spiral)
    cumulatedSummerGames = gmynd.cumulateData(summerGames, ["Year", "City", "continent"]);
    cumulatedWinterGames = gmynd.cumulateData(winterGames, ["Year", "City", "continent"]);

    //Functions to separate Winter and Summer Games (for Map)
    medalistsAtSummerGames = gmynd.findAllByValue(data, "Season", "Summer");
    medalistsAtWinterGames = gmynd.findAllByValue(data, "Season", "Winter");

    //Functions to separate male and female medalists
    let femaleMedalists = gmynd.findAllByValue(data, "Sex", "F");
    let maleMedalists = gmynd.findAllByValue(data, "Sex", "M");

    //Functions to group the different types of medals in relation to gender
    femaleMedalists = gmynd.groupData(femaleMedalists, "Medal");
    maleMedalists = gmynd.groupData(maleMedalists, "Medal");
    console.log(femaleMedalists);
    console.log(maleMedalists);

    // Function to see number of medalists
    allMedalists = gmynd.cumulateData(data, ["NOC", "longitude", "latitude", "countryName"]);
    medalistsAtSummerGames = gmynd.cumulateData(medalistsAtSummerGames, ["NOC", "longitude", "latitude", "countryName"]);
    medalistsAtWinterGames = gmynd.cumulateData(medalistsAtWinterGames, ["NOC", "longitude", "latitude", "countryName"]);

    // console.log(allMedalists);
}

// function continentColor() {
//     if (summerGame.continent == "Europe") {
//         spiralDot.css({
//             'background-color': '#2796EA',
//         });
//     }
//     if (summerGame.continent == "Asia") {
//         spiralDot.css({
//             'background-color': '#FF9839',
//         });
//     }
//     if (summerGame.continent == "Oceania") {
//         spiralDot.css({
//             'background-color': '#22AE70',
//         });
//     }
//     if (summerGame.continent == "North America") {
//         spiralDot.css({
//             'background-color': '#DF366E',
//         });
//     }
//     if (summerGame.continent == "South America") {
//         spiralDot.css({
//             'background-color': '#DF366E',
//         });
//     }
// }

function drawSpiral() {
    const startX = stageWidth / 2;
    const startY = stageHeight / 2;
    const athletesPerSummerGame = gmynd.dataExtremes(cumulatedSummerGames, "count");
    const athletesPerWinterGame = gmynd.dataExtremes(cumulatedWinterGames, "count");
    // console.log(athletesPerSummerGame);
    // console.log(athletesPerWinterGame);

    // console.log(countryExtremes);
    cumulatedSummerGames.forEach(summerGame => {
        let angle = (summerGame.Year - 1896) * 2.9;
        angle = gmynd.radians(angle - 90);
        const area = gmynd.map(summerGame.count, 19, 2031, 50, 750);
        const rSpiral = gmynd.circleRadius(area);

        let xSpiral = (startX + (Math.cos(angle)) * 15 * 20 - rSpiral); // cosinus vom winkel
        let ySpiral = (startY + (Math.sin(angle)) * 15 * 20 - rSpiral); // sinus vom winkel

        let spiralDot = $('<div></div>');
        spiralDot.addClass("Game");

        if (summerGame.continent == "Europe") {
            spiralDot.css({
                'background-color': '#2796EA',
            });
        }
        if (summerGame.continent == "Asia") {
            spiralDot.css({
                'background-color': '#FF9839',
            });
        }
        if (summerGame.continent == "Oceania") {
            spiralDot.css({
                'background-color': '#22AE70',
            });
        }
        if (summerGame.continent == "North America") {
            spiralDot.css({
                'background-color': '#DF366E',
            });
        }
        if (summerGame.continent == "South America") {
            spiralDot.css({
                'background-color': '#DF366E',
            });
        }
        spiralDot.css({
            'height': rSpiral * 2,
            'width': rSpiral * 2,
            'left': xSpiral,
            'top': ySpiral,
            'position': 'absolute',
            'border-radius': '100%',
        });
        spiralDot.data(summerGame);
        stage.append(spiralDot);
        spiralDot.mouseover(() => {
            spiralDot.addClass("hover");
            $('#hoverLabel').text('Season: Summer' + ',' + ' Year : ' + summerGame.Year + ', ' + 'City: ' + summerGame.City + ', ' + 'Continent: ' + summerGame.continent + ', ' + 'Athletes: ' + summerGame.count);
        });
        spiralDot.mouseout(() => {
            spiralDot.removeClass("hover");
            $('#hoverLabel').text("");
        });
    });

    // console.log(countryExtremes);
    cumulatedWinterGames.forEach(winterGame => {
        let angle = (winterGame.Year - 1896) * 2.9;
        angle = gmynd.radians(angle - 90);
        const area = gmynd.map(winterGame.count, 19, 2031, 50, 750);
        const rSpiral = gmynd.circleRadius(area);

        let xSpiral = (startX + (Math.cos(angle)) * 20 * 20 - rSpiral); // cosinus vom winkel
        let ySpiral = (startY + (Math.sin(angle)) * 20 * 20 - rSpiral); // sinus vom winkel

        let spiralDot = $('<div></div>');
        spiralDot.addClass("Game");

        if (winterGame.continent == "Europe") {
            spiralDot.css({
                'background-color': '#2796EA',
            });
        }
        if (winterGame.continent == "Asia") {
            spiralDot.css({
                'background-color': '#FF9839',
            });
        }
        if (winterGame.continent == "Oceania") {
            spiralDot.css({
                'background-color': '#22AE70',
            });
        }
        if (winterGame.continent == "North America") {
            spiralDot.css({
                'background-color': '#DF366E',
            });
        }
        if (winterGame.continent == "South America") {
            spiralDot.css({
                'background-color': '#DF366E',
            });
        }

        spiralDot.css({
            'height': rSpiral * 2,
            'width': rSpiral * 2,
            'left': xSpiral,
            'top': ySpiral,
            'position': 'absolute',
            'border-radius': '100%',
        });
        spiralDot.data(winterGame);
        stage.append(spiralDot);
        spiralDot.mouseover(() => {
            spiralDot.addClass("hover");
            $('#hoverLabel').text('Season: Winter' + ',' + ' Year : ' + winterGame.Year + ', ' + 'City: ' + winterGame.City + ', ' + 'Continent: ' + winterGame.continent + ', ' + 'Athletes: ' + winterGame.count);
        });
        spiralDot.mouseout(() => {
            spiralDot.removeClass("hover");
            $('#hoverLabel').text("");
        });
    });
}

function drawMap() {
    // allMedalists.forEach(country => {
    //     const area = gmynd.map(country.count, 1, 4383, 30, 700);
    //     const rMap = gmynd.circleRadius(area);
    //     const xMap = gmynd.map(country.longitude, -180, 180, 0, stageWidth) - rMap;
    //     const yMap = gmynd.map(country.latitude, -90, 90, stageHeight, 0) - rMap;
    //     let dot = $('<div></div>');
    //     dot.addClass("country");
    //     dot.css({
    //         'height': rMap * 2,
    //         'width': rMap * 2,
    //         'left': xMap,
    //         'top': yMap,
    //         'border-radius': '100%',
    //         'background-color': 'white',
    //     });
    //     dot.data(country);
    //     stage.append(dot);
    //     dot.mouseover(() => {
    //         dot.addClass("hover");
    //         $('#hoverLabel').text('Country : ' + country.countryName + ', ' + 'Athletes : ' + country.count);
    //     });
    //     dot.mouseout(() => {
    //         dot.removeClass("hover");
    //         $('#hoverLabel').text("");
    //     });
    // });

    medalistsAtSummerGames.forEach(country => {
        const area = gmynd.map(country.count, 1, 4383, 25, 500);
        const rMap = gmynd.circleRadius(area);
        const xMap = gmynd.map(country.longitude, -180, 180, 0, stageWidth) - rMap;
        const yMap = gmynd.map(country.latitude, -90, 90, stageHeight, 0) - rMap;
        let dot = $('<div></div>');
        dot.addClass("medalistsAtSummerGames");
        dot.css({
            'height': rMap * 2,
            'width': rMap * 2,
            'left': xMap,
            'top': yMap,
        });
        dot.data(country);
        stage.append(dot);
        dot.mouseover(() => {
            $('.medalistsAtSummerGames').addClass("hoverSummer");
            dot.removeClass("hoverSummer");
            $('#hoverLabel').text('Country : ' + country.countryName + ', ' + 'Athletes : ' + country.count);
        });
        dot.mouseout(() => {
            $('.medalistsAtSummerGames').removeClass("hoverSummer");
            $('#hoverLabel').text("");
        });
    });

    // medalistsAtWinterGames.forEach(country => {
    //     const area = gmynd.map(country.count, 1, 4383, 25, 500);
    //     const rMap = gmynd.circleRadius(area);
    //     const xMap = gmynd.map(country.longitude, -180, 180, 0, stageWidth) - rMap;
    //     const yMap = gmynd.map(country.latitude, -90, 90, stageHeight, 0) - rMap;
    //     let dot = $('<div></div>');
    //     dot.addClass("medalistsAtWinterGames");
    //     dot.css({
    //         'height': rMap * 2,
    //         'width': rMap * 2,
    //         'left': xMap,
    //         'top': yMap,
    //     });
    //     dot.data(country);
    //     stage.append(dot);
    //     dot.mouseover(() => {
    //         dot.addClass("hoverWinter");
    //         $('#hoverLabel').text('Country : ' + country.countryName + ', ' + 'Athletes : ' + country.count);
    //     });
    //     dot.mouseout(() => {
    //         dot.removeClass("hoverWinter");
    //         $('#hoverLabel').text("");
    //     });
    // });
}

function drawDiagram() {}

// Wichtig:
// Wie schaffe ich es, dass bei einem Mousover alle andern Objekte sich verfärben (also nicht das Objekt, über welches gehovert wird)?
// Warum sind manche Kreise nicht rund (auf der Karte)?
// Wie lege ich Größen etc an, sodass sie responsiv bleiben (auch beim Text etc).?


// Wie drehe ich eine Spirale richtig? 
// Warum sind manche Kreise nicht rund (auf der Karte)?
// Texte positionieren ohne Stage zu verschieben?
// Wie kann ich einem Kontinent eine Farbe zuweisen?