let stageHeight, stageWidth;
let data, cityContinents, groupedData, summerGames, winterGames, cumulatedSummerGames, cumulatedWinterGames, medalistsAtSummerGames, medalistsAtWinterGames, allMedalists;
let segmentedAthletes
let stage;
let dot
let showSpiral;
let showMap;
let showDiagram;

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

    //Functions to calculate the number of different medals
    let medalsSummer = gmynd.groupData(medalistsAtSummerGames, ['countryName', 'Medal']);
    let medalsWinter = gmynd.groupData(medalistsAtWinterGames, ['countryName', 'Medal']);
    console.log(medalsSummer);
    console.log(medalsWinter);

    // Function to see number of medalists
    // allMedalists = gmynd.cumulateData(data, ["longitude", "latitude", "countryName"]);
    medalistsAtSummerGames = gmynd.cumulateData(medalistsAtSummerGames, ["longitude", "latitude", "countryName"]);
    medalistsAtWinterGames = gmynd.cumulateData(medalistsAtWinterGames, ["longitude", "latitude", "countryName"]);


    //Functions to separate male and female medalists
    // segmentedAthletes = gmynd.addPropSegment(data, "Age", 8);
    // segmentedAthletes = gmynd.addPropSegment(data, "Height", 8);
    // segmentedAthletes = gmynd.addPropSegment(data, "Weight", 8);
    // console.log(segmentedAthletes);

    //Functions to group the different types of medals in relation to gender
    // femaleMedalists = gmynd.groupData(femaleMedalists, "Medal");
    // maleMedalists = gmynd.groupData(maleMedalists, "Medal");

}


function drawSpiral() {
    showSpiral = true;
    showDiagram = false;
    showMap = false;


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

        let xSpiral = (startX + (Math.cos(angle)) * (summerGame.Year - 1896 + 200) - rSpiral); // cosinus vom winkel
        let ySpiral = (startY + (Math.sin(angle)) * (summerGame.Year - 1896 + 200) - rSpiral); // sinus vom winkel

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
            $('#hoverMedalists').text(summerGame.count + ' Medalists');
            $('#hoverMedalists').css({
                'color': 'white',
            });
        });

        spiralDot.mouseout(() => {
            spiralDot.removeClass("hover");
            $('#hoverSeason').text("");
            $('#hoverContinent').text("");
            $('#hoverYear').text("");
            $('#hoverCity').text("");
            $('#hoverMedalists').text("");
        });
    });

    // console.log(countryExtremes);
    cumulatedWinterGames.forEach(winterGame => {
        let angle = (winterGame.Year - 1896) * 2.9;
        angle = gmynd.radians(angle - 90);
        const area = gmynd.map(winterGame.count, 19, 2031, 50, 750);
        const rSpiral = gmynd.circleRadius(area);

        let xSpiral = (startX + (Math.cos(angle)) * (winterGame.Year - 1896 + 300) - rSpiral); // cosinus vom winkel
        let ySpiral = (startY + (Math.sin(angle)) * (winterGame.Year - 1896 + 300) - rSpiral); // sinus vom winkel

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
            $('#hoverMedalists').text(winterGame.count + ' Medalists');
            $('#hoverMedalists').css({
                'color': 'white',
            });
        });

        spiralDot.mouseout(() => {
            spiralDot.removeClass("hover");
            $('#hoverSeason').text("");
            $('#hoverContinent').text("");
            $('#hoverYear').text("");
            $('#hoverCity').text("");
            $('#hoverMedalists').text("");
        });
    });
}

function drawMap() {
    showSpiral = false;
    showDiagram = false;
    showMap = true;

    medalistsAtSummerGames.forEach(country => {
        const area = gmynd.map(country.count, 1, 3875, 50, 2000);
        const rMap = gmynd.circleRadius(area);
        const xMap = gmynd.map(country.longitude, -140, 200, 0, stageWidth) - rMap;
        const yMap = gmynd.map(country.latitude, -100, 100, stageHeight, 0) - rMap;
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
            //Season        
            $('#hoverSeasonMap').text('Olympic Summer Game');
            $('#hoverSeasonMap').css({
                'color': 'white',
            });
            //Continent
            $('#hoverCountryMap').text(country.countryName);
            $('#hoverCountryMap').css({
                'color': spiralDotColor,
            });
            //Year
            $('#hoverMedalistsMap').text(country.count + ' Medalists');
            $('#hoverMedalistsMap').css({
                'color': 'white',
            });
        });

        dot.mouseout(() => {
            $('.medalistsAtSummerGames').removeClass("hoverSummer");
            $('#hoverSeasonMap').text("");
            $('#hoverCountryMap').text("");
            $('#hoverMedalistsMap').text("");
        });
    });

    // medalistsAtWinterGames.forEach(country => {
    //     const area = gmynd.map(country.count, 1, 3875, 50, 2000);
    //     const rMap = gmynd.circleRadius(area);
    //     const xMap = gmynd.map(country.longitude, -140, 200, 0, stageWidth) - rMap;
    //     const yMap = gmynd.map(country.latitude, -100, 100, stageHeight, 0) - rMap;
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

    // dot.mouseover(() => {
    // $('.medalistsAtSummerGames').addClass("hoverWinter");
    //     //Season        
    //     $('#hoverSeasonMap').text('Olympic Winter Game');
    //     $('#hoverSeasonMap').css({
    //         'color': 'white',
    //     });
    //     //Continent
    //     $('#hoverCountryMap').text(country.countryName);
    //     $('#hoverCountryMap').css({
    //         'color': spiralDotColor,
    //     });
    //     //Year
    //     $('#hoverMedalistsMap').text(country.count + ' Medalists');
    //     $('#hoverMedalistsMap').css({
    //         'color': 'white',
    //     });
    // });

    // dot.mouseout(() => {
    //     $('.medalistsAtSummerGames').removeClass("hoverWinter");
    //     $('#hoverSeason').text("");
    //     $('#hoverCountry').text("");
    //     $('#hoverMedalists').text("");
    // });
    // });
}

function drawDiagram() {

    // for (let i = 0; i < segmentedAthleteAge; i++) {
    //     for (let j = 0; j < segmentedAthleteWeight; j++) {
    //         const rDiagram = AgeSegmentOf8 + WeightSegmentOf8;
    //         const x = stageWidth / AgeSegmentOf8;
    //         const y = stageHeight / WeightSegmentOf8;
    //         console.log("Hey")

    //         let dot = $('<div></div>');
    //         dot.css({
    //             'height': rDiagram,
    //             'width': rDiagram,
    //             'background-color': 'white',
    //             'position': 'absolute',
    //             'left': x,
    //             'top': y,
    //             'border-radius': '100%'
    //         });
    //         $('#stage').append(dot);

    //         // console.log("j = " + j);
    //     }
    // }

    // segmentedAthletes.forEach(segment => {
    //     const area = 20;
    //     const rMap = gmynd.circleRadius(area);
    //     const xMap = gmynd.map(segment.count, 0, 8, 0, 1920) - rMap;
    //     const yMap = gmynd.map(segment.count, 0, 8, 0, 1080) - rMap;
    //     let dot = $('<div></div>');
    //     dot.addClass("segmentedAthletes");
    //     console.log("Hey")
    //     dot.css({
    //         'height': rMap * 2,
    //         'width': rMap * 2,
    //         'left': xMap,
    //         'top': yMap,
    //         'background-color': 'white',
    //     });
    //     dot.data(segment);
    //     stage.append(dot);
    // dot.mouseover(() => {
    //     $('.segmentedAthletes').addClass("hoverSummer");
    //     dot.removeClass("hoverSummer");
    //     $('#hoverLabel').text('Country : ' + country.countryName + ', ' + 'Athletes : ' + country.count);
    // });
    // dot.mouseout(() => {
    //     $('.medalistsAtSummerGames').removeClass("hoverSummer");
    //     $('#hoverLabel').text("");
    // });
    // });
}


function teamView() {
    stage.empty();
    if (showSpiral || showDiagram) {
        drawMap();
    }
    console.log("teamView");
}

function gameView() {
    stage.empty();
    if (showMap || showDiagram) {
        drawSpiral();
    }
    console.log("gameView");
}

function medalistView() {
    stage.empty();
    if (showSpiral || showMap) {
        drawDiagram();
    }
    console.log("medalistView");
}