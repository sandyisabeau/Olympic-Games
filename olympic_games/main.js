let stage, stageHeight, stageWidth;
let data, cityContinents; //for general data preparation
let games, summerGames, winterGames, cumulatedSummerGames, cumulatedWinterGames; // for spiral
let medalistsAtSummerGames, medalistsAtWinterGames; // for map
let medalsSummer, medalsWinter;
let segmentedAthletes; //for diagram
let mostFrequentMedal;
let mostFrequentMedalsPerCountry = {};


let cumulatedCountries;

let showSpiral;
showSpiral = true;

let showSummerMap;
showSummerMap = false;

let showWinterMap;
showWinterMap = false;

let showAgeAndHeight;
showAgeAndHeight = false;

let showWeightAndAge;
showWeightAndAge = false;

let showHeightAndWeight;
showHeightAndWeight = false;

let thirdParameter = [];
let currentFilters = [];
let currentData;
let medalColor = [];

function getColor(g, s, b, max) {
    let R = gmynd.map((g / max) * 255, 0, 255, 50, 150);
    let G = gmynd.map((s / max) * 255, 0, 255, 50, 150);
    let B = gmynd.map((b / max) * 255, 0, 255, 50, 150);

    medalColor.push(chroma([R, G, B]));
}


$(function() {
    $('.summer').hide();
    $('.winter').hide();
    $('.ageAndHeight').hide();
    $('.weightAndAge').hide();
    $('.heightAndWeight').hide();
    stage = $('#stage');
    stageHeight = stage.height();
    stageWidth = stage.width();
    prepareData();
    drawSpiral();
});

//Functions for segmentedAthletes
function addToFilters(prop) {
    currentFilters.push(prop);
    currentFilters.pop();
};

function getDataSubset() {
    const calculations = [{
            value: thirdParameter,
            method: "Average",
        },
        {
            value: "Height",
            method: "Min",
        },
        {
            value: "Height",
            method: "Max",
        },
        {
            value: "Weight",
            method: "Min",
        },
        {
            value: "Weight",
            method: "Max",
        },
        {
            value: "Age",
            method: "Min",
        },
        {
            value: "Age",
            method: "Max",
        },
    ];
    return gmynd.cumulateData(segmentedAthletes, ["Sex", ...currentFilters], calculations);
};

function addToParameters() {
    thirdParameter.push(prop);
    thirdParameter.pop();
};

function getThirdParameter() {
    return gmynd.cumulateData(currentData, [thirdParameter]);
};

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

    // Functions to calculate Games (for Spiral)
    games = gmynd.cumulateData(cityContinents, ["Year", "City", "continent", "Season"]);
    console.log(games);
    //Functions to separate Winter and Summer Games (for Map)
    medalistsAtSummerGames = gmynd.findAllByValue(data, "Season", "Summer");
    medalistsAtWinterGames = gmynd.findAllByValue(data, "Season", "Winter");
    console.log(medalistsAtSummerGames);

    //Functions to calculate the number of different medals
    medalsSummer = gmynd.cumulateData(medalistsAtSummerGames, ["countryName", "Medal"]);
    groupedMedals = gmynd.groupData(medalsSummer, ["countryName"]);
    medalsWinter = gmynd.cumulateData(medalistsAtWinterGames, ["countryName", "Medal"]);
    console.log("groupedMedals:");
    console.log(groupedMedals);


    for (let countryName in groupedMedals) {
        let country = groupedMedals[countryName];
        mostFrequentMedal = { countryName: countryName, Medal: "", count: 0 };
        let goldCount, silverCount, bronzeCount = 0;
        country.forEach(medalType => {

            if (medalType.count > mostFrequentMedal.count) {
                mostFrequentMedal = {};
                mostFrequentMedal = Object.assign({}, medalType);
            };

            // let medals = { countryName: countryName, Medal: medalType.Medal, count: medalType.count };
            // console.log(medals);
            if (medalType.Medal == "Gold") {
                goldCount = medalType.count;
                // console.log("Gold" + goldCount)
            }
            if (medalType.Medal == "Silver") {
                silverCount = medalType.count;
                // console.log("Silver" + silverCount)
            }
            if (medalType.Medal == "Bronze") {
                bronzeCount = medalType.count;
                // console.log("Bronze" + bronzeCount)
            }
        });
        console.log("-----");
        // console.log(mostFrequentMedal);
        mostFrequentMedalsPerCountry[countryName] = mostFrequentMedal;
        // console.log(goldCount, silverCount, bronzeCount, mostFrequentMedal.count);
        getColor(goldCount, silverCount, bronzeCount, mostFrequentMedal.count);
    }

    // console.log("mostFrequentMedalsPerCountry:");
    // console.log(mostFrequentMedalsPerCountry);

    // Function to see number of medalists
    medalistsAtSummerGames = gmynd.cumulateData(medalistsAtSummerGames, ["longitude", "latitude", "countryName", "continent"]);
    medalistsAtWinterGames = gmynd.cumulateData(medalistsAtWinterGames, ["longitude", "latitude", "countryName", "continent"]);
    console.log(medalistsAtSummerGames);

    //Functions to put medalists into segments
    segmentedAthletes = gmynd.addPropSegment(data, "Age", 20);
    segmentedAthletes = gmynd.addPropSegment(data, "Height", 20);
    segmentedAthletes = gmynd.addPropSegment(data, "Weight", 20);
    console.log(segmentedAthletes);
}

function drawSpiral() {
    showSpiral = true;
    $('.summer').hide();
    $('.winter').hide();
    $('.all').hide();
    $('.gold').hide();
    $('.silver').hide();
    $('.bronze').hide();
    $('.ageAndHeight').hide();
    $('.weightAndAge').hide();
    $('.heightAndWeight').hide();

    const startX = stageWidth / 2;
    const startY = stageHeight / 2;

    games.forEach(game => {
        let angle = (game.Year - 1896) * 2.9;
        angle = gmynd.radians(angle - 90);
        const area = gmynd.map(game.count, 19, 2031, 50, 750);
        const rSpiral = gmynd.circleRadius(area);
        let xSpiral;
        let ySpiral;

        if (game.Season === "Summer") {
            xSpiral = (startX + (Math.cos(angle)) * ((game.Year - 1896) / 4 + 250) - rSpiral); // cosinus vom winkel
            ySpiral = (startY + (Math.sin(angle)) * ((game.Year - 1896) / 4 + 250) - rSpiral); // sinus vom winkel  
        }
        if (game.Season === "Winter") {
            xSpiral = (startX + (Math.cos(angle)) * ((game.Year - 1896) / 4 + 350) - rSpiral); // cosinus vom winkel
            ySpiral = (startY + (Math.sin(angle)) * ((game.Year - 1896) / 4 + 350) - rSpiral); // sinus vom winkel  
        }

        let spiralDot = $('<div></div>');
        spiralDot.addClass("Game");
        let spiralDotColor;

        if (game.continent === "Europe") {
            spiralDotColor = '#2796EA';
        } else if (game.continent === "Asia") {
            spiralDotColor = '#FF9839';
        } else if (game.continent === "Oceania") {
            spiralDotColor = '#22AE70';
        } else if (game.continent === "North America") {
            spiralDotColor = '#DF366E';
        } else if (game.continent === "South America") {
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
        spiralDot.data(game);
        stage.append(spiralDot);

        spiralDot.mouseover(() => {
            spiralDot.addClass("hover");
            //Season
            $('#hoverSeason').text('Olympic ' + game.Season + ' Game');
            $('#hoverSeason').css({
                'color': 'white',
            });
            //Continent
            $('#hoverContinent').text(game.continent);
            $('#hoverContinent').css({
                'color': spiralDotColor,
            });
            //Year
            $('#hoverYear').text(game.Year);
            $('#hoverYear').css({
                'color': 'white',
            });
            //City
            $('#hoverCity').text(game.City);
            $('#hoverCity').css({
                'color': 'white',
            });
            //Medalists
            $('#hoverMedalist').text(game.count + ' Medalists');
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

function drawSummerMap() {
    showSummerMap = true;
    $('.summer').show();
    $('.winter').show();
    $('.all').show();
    $('.gold').show();
    $('.silver').show();
    $('.bronze').show();
    $('.ageAndHeight').hide();
    $('.weightAndAge').hide();
    $('.heightAndWeight').hide();

    medalistsAtSummerGames.forEach(function(country, index) {
        $('.medalistsAtSummerGames').show();
        const area = gmynd.map(country.count, 1, 3875, 50, 3000);
        const rMap = gmynd.circleRadius(area);
        const xMap = gmynd.map(country.longitude, -120, 160, 0, stageWidth) - rMap;
        const yMap = gmynd.map(country.latitude, -85, 105, stageHeight, 0) - rMap;
        let dot = $('<div></div>');
        let col = chroma.random();
        dot.addClass("medalistsAtSummerGames");
        dot.css({
            'height': rMap * 2,
            'width': rMap * 2,
            'left': xMap,
            'top': yMap,
            'border-radius': '100%',
            'position': 'absolute',
            'background-color': medalColor[index],
        });
        dot.data(country);
        stage.append(dot);

        dot.mouseover(() => {
            $('.medalistsAtSummerGames').addClass("hoverSummer");
            dot.removeClass("hoverSummer");
            //Season
            $('#hoverOriginMap').text('Medalists Country of Origin');
            $('#hoverOriginMap').css({
                'color': 'white',
            });
            //Continent
            $('#hoverCountryMap').text(country.countryName);
            $('#hoverCountryMap').css({
                'color': 'orange',
            });
            //Year
            $('#hoverMedalistMap').text(country.count + ' Medalists');
            $('#hoverMedalistMap').css({
                'color': 'white',
            });
        });

        dot.mouseout(() => {
            $('.medalistsAtSummerGames').removeClass("hoverSummer");
            $('#hoverOriginMap').text("");
            $('#hoverCountryMap').text("");
            $('#hoverMedalistMap').text("");
        });
    });
}

function drawWinterMap() {
    showWinterMap = true;
    $('.summer').show();
    $('.winter').show();
    $('.all').show();
    $('.gold').show();
    $('.silver').show();
    $('.bronze').show();
    $('.ageAndHeight').hide();
    $('.weightAndAge').hide();
    $('.heightAndWeight').hide();

    medalistsAtWinterGames.forEach(country => {
        $('.medalistsAtWinterGames').show();

        const area = gmynd.map(country.count, 1, 3875, 50, 3000);
        const rMap = gmynd.circleRadius(area);
        const xMap = gmynd.map(country.longitude, -120, 160, 0, stageWidth) - rMap;
        const yMap = gmynd.map(country.latitude, -85, 105, stageHeight, 0) - rMap;
        let dot = $('<div></div>');
        dot.addClass("medalistsAtWinterGames");
        dot.css({
            'height': rMap * 2,
            'width': rMap * 2,
            'left': xMap,
            'top': yMap,
            'position': 'absolute',
            'background-color': 'blue',
            'border-radius': '100%',
        });
        dot.data(country);
        stage.append(dot);

        dot.mouseover(() => {
            $('.medalistsAtWinterGames').addClass("hoverWinter");
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
            $('.medalistsAtWinterGames').removeClass("hoverWinter");
            $('#hoverSeasonMap').text("");
            $('#hoverCountryMap').text("");
            $('#hoverMedalistMap').text("");
        });
    });
}

function createDots() {
    //for scatterplot
    dot.data({
        plotHeight: rPlot * 2,
        plotWidth: rPlot * 2,
        plotLeft: xPlot,
        plotTop: yPlot,
        plotPosition: 'absolute',
        plotColor: thirdParameterColor,
        plotRadius: '100%',
    });
}

function drawAgeAndHeight() {
    showAgeAndHeight = true;

    $('.summer').hide();
    $('.winter').hide();
    $('.all').hide();
    $('.gold').hide();
    $('.silver').hide();
    $('.bronze').hide();
    $('.ageAndHeight').show();
    $('.weightAndAge').show();
    $('.heightAndWeight').show();

    // Diagram based on Age and Height
    currentFilters = ["AgeSegmentOf20", "HeightSegmentOf20"];
    thirdParameter = "Weight";
    currentData = getDataSubset();
    console.log(currentData);

    currentData.forEach(medalistGroup => {
        const colorScale = gmynd.map(medalistGroup.WeightAverage, 34.5, 119.5, 5, 1);
        const thirdParameterColor = chroma('#3C33CE').brighten(colorScale);
        const area = gmynd.map(medalistGroup.count, 1, 4971, 50, 6000);
        const rPlot = gmynd.circleRadius(area);
        const xPlot = gmynd.map(medalistGroup.AgeSegmentOf20, 0, 19, 200, 1720) - rPlot;
        let yPlot

        if (medalistGroup.Sex == "F") {
            yPlot = gmynd.map(medalistGroup.HeightSegmentOf20, 0, 19, 590, 200) - rPlot;
        } else {
            yPlot = gmynd.map(medalistGroup.HeightSegmentOf20, 0, 19, 610, 1000) - rPlot;
        }
        let scatterPlotDot = $('<div></div>');
        scatterPlotDot.addClass("medalistGroup");
        scatterPlotDot.css({
            'height': rPlot * 2,
            'width': rPlot * 2,
            'left': xPlot,
            'top': yPlot,
            'position': 'absolute',
            'background-color': thirdParameterColor,
            'border-radius': '100%',
        });
        scatterPlotDot.data(medalistGroup);
        stage.append(scatterPlotDot);

        scatterPlotDot.mouseover(() => {
            scatterPlotDot.addClass("hover");
            //Gender
            $('#hoverGender').text(medalistGroup.Sex);
            $('#hoverGender').css({
                'color': 'white',
            });
            //Age
            $('#hoverAge').text(medalistGroup.AgeMin + " - " + medalistGroup.AgeMax + " years");
            $('#hoverAge').css({
                'color': 'white',
            });
            //Weight
            $('#hoverWeight').text(medalistGroup.HeightMin + " - " + medalistGroup.HeightMax + " kg");
            $('#hoverWeight').css({
                'color': 'white',
            });
            //Height
            $('#hoverHeight').text('Height Average: ' + Math.round(medalistGroup.WeightAverage) + " cm");
            $('#hoverHeight').css({
                'color': thirdParameterColor,
            });
            //Count
            $('#hoverCount').text('Count: ' + medalistGroup.count);
            $('#hoverCount').css({
                'color': 'white',
            });
        });

        scatterPlotDot.mouseout(() => {
            scatterPlotDot.removeClass("hover");
            $('#hoverGender').text("");
            $('#hoverAge').text("");
            $('#hoverWeight').text("");
            $('#hoverHeight').text("");
            $('#hoverCount').text("");
        });
    });
}

function drawWeightAndAge(filter1, filter2, third) {
    showWeightAndAge = true;
    $('.summer').hide();
    $('.winter').hide();
    $('.all').hide();
    $('.gold').hide();
    $('.silver').hide();
    $('.bronze').hide();
    $('.age').show();
    $('.weight').show();
    $('.height').show();
    // Diagram based on Age and Weight
    currentFilters = [filter1, filter2];
    /* currentFilters = ["AgeSegmentOf20", "WeightSegmentOf20"]; */
    /* thirdParameter = "Height"; */
    thirdParameter = third;
    currentData = getDataSubset();
    console.log(currentData);



    currentData.forEach(medalistGroup => {
        const colorScale = gmynd.map(medalistGroup[third + "Average"], 151, 198, 5, 1);
        const thirdParameterColor = chroma('#3C33CE').brighten(colorScale);
        const area = gmynd.map(medalistGroup.count, 1, 4971, 50, 6000);
        const rDiagram = gmynd.circleRadius(area);
        const xDiagram = gmynd.map(medalistGroup[filter1], 0, 19, 200, 1720) - rDiagram;
        let yDiagram

        if (medalistGroup.Sex == "F") {
            yDiagram = gmynd.map(medalistGroup[filter2], 0, 19, 590, 200) - rDiagram;
        } else {
            yDiagram = gmynd.map(medalistGroup.WeightSegmentOf20, 0, 19, 610, 1000) - rDiagram;
        }
        let scatterPlotDot = $('<div></div>');
        scatterPlotDot.addClass("medalistGroup");
        scatterPlotDot.animate({
            'height': rDiagram * 2,
            'width': rDiagram * 2,
            'left': xDiagram,
            'top': yDiagram,
            'position': 'absolute',
            'background-color': thirdParameterColor,
            'border-radius': '100%',
        }, 500);
        scatterPlotDot.data(medalistGroup);
        stage.append(scatterPlotDot);

        scatterPlotDot.mouseover(() => {
            scatterPlotDot.addClass("hover");
            //Gender
            $('#hoverGender').text(medalistGroup.Sex);
            $('#hoverGender').css({
                'color': 'white',
            });
            //Age
            $('#hoverAge').text(medalistGroup.AgeMin + " - " + medalistGroup.AgeMax + " years");
            $('#hoverAge').css({
                'color': 'white',
            });
            //Weight
            $('#hoverWeight').text(medalistGroup.WeightMin + " - " + medalistGroup.WeightMax + " kg");
            $('#hoverWeight').css({
                'color': 'white',
            });
            //Height
            $('#hoverHeight').text('Height Average: ' + Math.round(medalistGroup.HeightAverage) + " cm");
            $('#hoverHeight').css({
                'color': thirdParameterColor,
            });
            //Count
            $('#hoverCount').text('Count: ' + medalistGroup.count);
            $('#hoverCount').css({
                'color': 'white',
            });
        });

        scatterPlotDot.mouseout(() => {
            scatterPlotDot.removeClass("hover");
            $('#hoverGender').text("");
            $('#hoverAge').text("");
            $('#hoverWeight').text("");
            $('#hoverHeight').text("");
            $('#hoverCount').text("");
        });
    });
}

function drawHeightAndWeight() {
    showHeightAndWeight = true;
    $('.summer').hide();
    $('.winter').hide();
    $('.all').hide();
    $('.gold').hide();
    $('.silver').hide();
    $('.bronze').hide();
    $('.age').show();
    $('.weight').show();
    $('.height').show();
    // Diagram based on Age and Weight
    currentFilters = ["HeightSegmentOf20", "WeightSegmentOf20"];
    thirdParameter = "Age";
    currentData = getDataSubset();
    console.log(currentData);


    // Diagram based on height and weight
    currentFilters = ["HeightSegmentOf20", "WeightSegmentOf20"];
    currentData = getDataSubset();

    currentData.forEach(medalistGroup => {
        const colorScale = gmynd.map(medalistGroup.AgeAverage, 15, 47, 5, 1);
        const thirdParameterColor = chroma('#3C33CE').brighten(colorScale);
        const area = gmynd.map(medalistGroup.count, 1, 4971, 50, 6000);
        const rDiagram = gmynd.circleRadius(area);
        const xDiagram = gmynd.map(medalistGroup.WeightSegmentOf20, 0, 19, 200, 1720) - rDiagram;
        let yDiagram

        if (medalistGroup.Sex == "F") {
            yDiagram = gmynd.map(medalistGroup.HeightSegmentOf20, 0, 19, 590, 200) - rDiagram;
        } else {
            yDiagram = gmynd.map(medalistGroup.HeightSegmentOf20, 0, 19, 610, 1000) - rDiagram;
        }
        let scatterPlotDot = $('<div></div>');
        scatterPlotDot.addClass("medalistGroup");
        scatterPlotDot.css({
            'height': rDiagram * 2,
            'width': rDiagram * 2,
            'left': xDiagram,
            'top': yDiagram,
            'position': 'absolute',
            'background-color': thirdParameterColor,
            'border-radius': '100%',
        });
        scatterPlotDot.data(medalistGroup);
        stage.append(scatterPlotDot);

        scatterPlotDot.mouseover(() => {
            scatterPlotDot.addClass("hover");
            //Gender
            $('#hoverGender').text(medalistGroup.Sex);
            $('#hoverGender').css({
                'color': 'white',
            });
            //Age
            $('#hoverAge').text(medalistGroup.AgeMin + " - " + medalistGroup.AgeMax + " years");
            $('#hoverAge').css({
                'color': 'white',
            });
            //Weight
            $('#hoverWeight').text(medalistGroup.WeightMin + " - " + medalistGroup.WeightMax + " kg");
            $('#hoverWeight').css({
                'color': 'white',
            });
            //Height
            $('#hoverHeight').text('Height Average: ' + Math.round(medalistGroup.HeightAverage) + " cm");
            $('#hoverHeight').css({
                'color': thirdParameterColor,
            });
            //Count
            $('#hoverCount').text('Count: ' + medalistGroup.count);
            $('#hoverCount').css({
                'color': 'white',
            });
        });

        scatterPlotDot.mouseout(() => {
            scatterPlotDot.removeClass("hover");
            $('#hoverGender').text("");
            $('#hoverAge').text("");
            $('#hoverWeight').text("");
            $('#hoverHeight').text("");
            $('#hoverCount').text("");
        });
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
    drawSummerMap();
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
    drawAgeAndHeight();
    $('.spiral').css({
        'color': 'rgba(255, 255, 255, 0.5)',
    });

    $('.map').css({
        'color': 'rgba(255, 255, 255, 0.5)',
    });

    $('.diagram').css({
        'color': "white",
    });
    $('.ageAndHeight').css({
        'color': 'white',
    });
    $('.weightAndAge').css({
        'color': 'white',
    });

    $('.heightAndWeight').css({
        'color': '#A98BFC',
    });
    console.log("medalistView");
}

function summerView() {
    stage.empty();
    drawSummerMap();
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
    drawWinterMap();
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

function allMedalsView() {
    stage.empty();
    console.log("allMedalsView");
}

function goldView() {
    stage.empty();
    console.log("goldView");
}

function silverView() {
    stage.empty();
    console.log("silverView");
}

function bronzeView() {
    stage.empty();
    console.log("bronzeView");
}

function ageAndHeightView() {
    stage.empty();
    drawAgeAndHeight();
    console.log("ageAndHeightView");
    $('.ageAndHeight').css({
        'color': 'white',
    });
    $('.weightAndAge').css({
        'color': 'rgba(255, 255, 255, 0.8)',
    });

    $('.heightAndWeight').css({
        'color': '#A98BFC',
    });
}

function weightAndAgeView() {
    stage.empty();
    drawWeightAndAge();
    console.log("weightAndAgeView");
    $('.ageAndHeight').css({
        'color': 'white',
    });
    $('.weightAndAge').css({
        'color': '#A98BFC',
    });

    $('.heightAndWeight').css({
        'color': 'white',
    });
}

function heightAndWeightView() {
    stage.empty();
    drawHeightAndWeight();
    console.log("heightAndWeight");
    $('.ageAndHeight').css({
        'color': '#A98BFC',
    });
    $('.weightAndAge').css({
        'color': 'white',
    });

    $('.heightAndWeight').css({
        'color': 'white',
    });
}