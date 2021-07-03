let stage, stageHeight, stageWidth;
let data, cityContinents; //for general data preparation
let games, summerGames, winterGames, cumulatedSummerGames, cumulatedWinterGames; // for spiral
let medalistsAtSummerGames, medalistsAtWinterGames; // for map
let medalsSummer, medalsWinter;
let segmentedAthletes; //for diagram
let mostFrequentMedal;
let mostFrequentMedalsPerCountry = {};
let medalsPerCountry = {};
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
let medalColorSummer = [];
let medalColorWinter = [];

function getColorSummer(g = 0, s = 0, b = 0, max) {
    let R = gmynd.map((s / max) * 255, 0, 255, 0, 255);
    let G = gmynd.map((b / max) * 255, 0, 255, 0, 255);
    let B = gmynd.map((g / max) * 255, 0, 255, 0, 255);
    let color = chroma([255 - R, 255 - G, 255 - B]);
    let lab = color.lab();
    color = chroma.lab([70, lab[1], lab[2]]);
    medalColorSummer.push(color);
}

function getColorWinter(g = 0, s = 0, b = 0, max) {
    let R = gmynd.map((s / max) * 255, 0, 255, 0, 255);
    let G = gmynd.map((b / max) * 255, 0, 255, 0, 255);
    let B = gmynd.map((g / max) * 255, 0, 255, 0, 255);
    let color = chroma([255 - R, 255 - G, 255 - B]);
    let lab = color.lab();
    color = chroma.lab([70, lab[1], lab[2]]);
    medalColorWinter.push(color);

}
$(function() {
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
    groupedMedalsSummer = gmynd.groupData(medalsSummer, ["countryName"]);
    medalsWinter = gmynd.cumulateData(medalistsAtWinterGames, ["countryName", "Medal"]);
    groupedMedalsWinter = gmynd.groupData(medalsSummer, ["countryName"]);

    console.log(groupedMedalsSummer);

    for (let countryName in groupedMedalsSummer) {
        let country = groupedMedalsSummer[countryName];
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
        console.log(goldCount, silverCount, bronzeCount, mostFrequentMedal.count);
        getColorSummer(goldCount, silverCount, bronzeCount, mostFrequentMedal.count)
    }
    for (let countryName in groupedMedalsWinter) {
        let country = groupedMedalsWinter[countryName];
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
        console.log(goldCount, silverCount, bronzeCount, mostFrequentMedal.count);
        medalsPerCountry = getColorWinter(goldCount, silverCount, bronzeCount, mostFrequentMedal.count);
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
    $('.age').hide();
    $('.weight').hide();
    $('.height').hide();

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
            spiralDotColor = '#FF7A00';
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
            $('.hover').animate({
                'height': rSpiral * 2.5,
                'width': rSpiral * 2.5,
                'left': xSpiral - (rSpiral * 0.25),
                'top': ySpiral - (rSpiral * 0.25),
            }, 200);
            //Season
            $('#hoverTitle').text('Olympic ' + game.Season + ' Game');
            $('#hoverTitle').css({
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
            spiralDot.animate({
                'height': rSpiral * 2,
                'width': rSpiral * 2,
                'left': xSpiral,
                'top': ySpiral,
            }, 200);
            spiralDot.removeClass("hover");
            $('#hoverTitle').text("");
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
    $('.age').hide();
    $('.weight').hide();
    $('.height').hide();
    console.log(medalsPerCountry);

    medalistsAtSummerGames.forEach(function(country, index) {
        $('.medalistsAtSummerGames').show();
        const area = gmynd.map(country.count, 1, 3875, 50, 3000);
        const rMap = gmynd.circleRadius(area);
        const xMap = gmynd.map(country.longitude, -120, 160, 0, stageWidth) - rMap;
        const yMap = gmynd.map(country.latitude, -85, 105, stageHeight, 0) - rMap;
        let dot = $('<div></div>');
        dot.addClass("medalistsAtSummerGames");
        dot.css({
            'height': rMap * 2,
            'width': rMap * 2,
            'left': xMap,
            'top': yMap,
            'border-radius': '100%',
            'position': 'absolute',
            'background-color': medalColorSummer[index],
        });
        dot.data(country);
        stage.append(dot);

        dot.mouseover(() => {
            dot.removeClass("hoverSummer");
            dot.animate({
                'height': rMap * 2.5,
                'width': rMap * 2.5,
                'left': xMap - (rMap * 0.25),
                'top': yMap - (rMap * 0.25),
            }, 200);
            //Season
            $('#hoverOriginMap').text('Medalists Country of Origin');
            $('#hoverOriginMap').css({
                'color': 'white',
            });
            //Continent
            $('#hoverCountryMap').text(country.countryName);
            $('#hoverCountryMap').css({
                'color': medalColorSummer[index],
            });
            //Gold medals
            $('#hoverGold').text(country.count + ' x Gold');
            $('#hoverGold').css({
                'color': 'white',
            });
            //Silver medals
            $('#hoverSilver').text(country.count + ' x Silver');
            $('#hoverSilver').css({
                'color': 'white',
            });
            //Bronze medals
            $('#hoverBronze').text(country.count + ' x Bronze');
            $('#hoverBronze').css({
                'color': 'white',
            });
        });

        dot.mouseout(() => {
            dot.animate({
                'height': rMap * 2,
                'width': rMap * 2,
                'left': xMap,
                'top': yMap,
            }, 200);
            $('.medalistsAtSummerGames').removeClass("hoverSummer");
            $('#hoverOriginMap').text("");
            $('#hoverCountryMap').text("");
            $('#hoverGold').text("");
            $('#hoverSilver').text("");
            $('#hoverBronze').text("");

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
    $('.age').hide();
    $('.weight').hide();
    $('.height').hide();

    medalistsAtWinterGames.forEach(function(country, index) {
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
            'background-color': medalColorWinter[index],
            'border-radius': '100%',
        });
        dot.data(country);
        stage.append(dot);

        dot.mouseover(() => {
            dot.addClass("hoverWinter");
            dot.animate({
                'height': rMap * 2.5,
                'width': rMap * 2.5,
                'left': xMap - (rMap * 0.25),
                'top': yMap - (rMap * 0.25),
            }, 200);
            //Season
            $('#hoverSeasonMap').text('Olympic Winter Game');
            $('#hoverSeasonMap').css({
                'color': 'white',
            });
            //Continent
            $('#hoverCountryMap').text(country.countryName);
            $('#hoverCountryMap').css({
                'color': medalColorWinter[index],
            });
            //Year
            $('#hoverMedalistMap').text(country.count + ' Medalists');
            $('#hoverMedalistMap').css({
                'color': 'white',
            });
        });

        dot.mouseout(() => {
            dot.animate({
                'height': rMap * 2,
                'width': rMap * 2,
                'left': xMap,
                'top': yMap,
            }, 200);
            scatterPlotDot.removeClass("hover");
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
    $('.age').show();
    $('.weight').show();
    $('.height').show();

    // Diagram based on Age and Height
    currentFilters = ["AgeSegmentOf20", "HeightSegmentOf20"];
    thirdParameter = "Weight";
    currentData = getDataSubset();
    console.log(currentData);

    currentData.forEach(medalistGroup => {
        const colorScale = gmynd.map(medalistGroup.WeightAverage, 34.5, 119.5, 4, 1);
        const thirdParameterColor = chroma('#A93AFF').brighten(colorScale);
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
            $('.hover').animate({
                'height': rPlot * 2.5,
                'width': rPlot * 2.5,
                'left': xPlot - (rPlot * 0.25),
                'top': yPlot - (rPlot * 0.25),
            }, 200);
            //Gender
            $('#hoverGender').text(medalistGroup.Sex);
            $('#hoverGender').css({
                'color': 'white',
            });
            //Age
            $('#hoverParameterOne').text(medalistGroup.AgeMin + " - " + medalistGroup.AgeMax + " years");
            $('#hoverParameterOne').css({
                'color': 'white',
            });
            //Weight
            $('#hoverParameterTwo').text(medalistGroup.HeightMin + " - " + medalistGroup.HeightMax + "cm");
            $('#hoverParameterTwo').css({
                'color': 'white',
            });
            //Height
            $('#hoverParameterThree').text('Weight Average: ' + Math.round(medalistGroup.WeightAverage) + " kg");
            $('#hoverParameterThree').css({
                'color': thirdParameterColor,
            });
            //Count
            $('#hoverCount').text('Count: ' + medalistGroup.count);
            $('#hoverCount').css({
                'color': 'white',
            });
        });

        scatterPlotDot.mouseout(() => {
            scatterPlotDot.animate({
                'height': rPlot * 2,
                'width': rPlot * 2,
                'left': xPlot,
                'top': yPlot,
            }, 200);
            scatterPlotDot.removeClass("hover");

            $('#hoverGender').text("");
            $('#hoverParameterOne').text("");
            $('#hoverParameterTwo').text("");
            $('#hoverParameterThree').text("");
            $('#hoverCount').text("");
        });
    });
}

function drawWeightAndAge() {
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
    // currentFilters = [filter1, filter2];
    currentFilters = ["AgeSegmentOf20", "WeightSegmentOf20"];
    thirdParameter = "Height";
    // thirdParameter = third;
    currentData = getDataSubset();
    console.log(currentData);



    currentData.forEach(medalistGroup => {
        const colorScale = gmynd.map(medalistGroup.HeightAverage, 151, 198, 4, 1);
        const thirdParameterColor = chroma('#B28FE1').brighten(colorScale);
        const area = gmynd.map(medalistGroup.count, 1, 4971, 50, 6000);
        const rPlot = gmynd.circleRadius(area);
        const xPlot = gmynd.map(medalistGroup.AgeSegmentOf20, 0, 19, 200, 1720) - rPlot;
        let yPlot

        if (medalistGroup.Sex == "F") {
            yPlot = gmynd.map(medalistGroup.WeightSegmentOf20, 0, 19, 590, 200) - rPlot;
        } else {
            yPlot = gmynd.map(medalistGroup.WeightSegmentOf20, 0, 19, 610, 1000) - rPlot;
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
            $('.hover').animate({
                'height': rPlot * 2.5,
                'width': rPlot * 2.5,
                'left': xPlot - (rPlot * 0.25),
                'top': yPlot - (rPlot * 0.25),
            }, 200);
            //Gender
            $('#hoverGender').text(medalistGroup.Sex);
            $('#hoverGender').css({
                'color': 'white',
            });
            //Age
            $('#hoverParameterOne').text(medalistGroup.AgeMin + " - " + medalistGroup.AgeMax + " years");
            $('#hoverParameterOne').css({
                'color': 'white',
            });
            //Weight
            $('#hoverParameterTwo').text(medalistGroup.WeightMin + " - " + medalistGroup.WeightMax + " kg");
            $('#hoverParameterTwo').css({
                'color': 'white',
            });
            //Height
            $('#hoverParameterThree').text('Height Average: ' + Math.round(medalistGroup.HeightAverage) + " cm");
            $('#hoverParameterThree').css({
                'color': thirdParameterColor,
            });
            //Count
            $('#hoverCount').text('Count: ' + medalistGroup.count);
            $('#hoverCount').css({
                'color': 'white',
            });
        });

        scatterPlotDot.mouseout(() => {
            scatterPlotDot.animate({
                'height': rPlot * 2,
                'width': rPlot * 2,
                'left': xPlot,
                'top': yPlot,
            }, 200);
            scatterPlotDot.removeClass("hover");

            $('#hoverGender').text("");
            $('#hoverParameterOne').text("");
            $('#hoverParameterTwo').text("");
            $('#hoverParameterThree').text("");
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
        const colorScale = gmynd.map(medalistGroup.AgeAverage, 15, 47, 4, 1);
        const thirdParameterColor = chroma('#A93AFF').brighten(colorScale);
        const area = gmynd.map(medalistGroup.count, 1, 4971, 50, 6000);
        const rPlot = gmynd.circleRadius(area);
        const xPlot = gmynd.map(medalistGroup.WeightSegmentOf20, 0, 19, 200, 1720) - rPlot;
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
            $('.hover').animate({
                'height': rPlot * 2.5,
                'width': rPlot * 2.5,
                'left': xPlot - (rPlot * 0.25),
                'top': yPlot - (rPlot * 0.25),
            }, 200);
            //Gender
            $('#hoverGender').text(medalistGroup.Sex);
            $('#hoverGender').css({
                'color': 'white',
            });
            //Age
            $('#hoverParameterOne').text(medalistGroup.WeightMin + " - " + medalistGroup.WeightMax + " kg");
            $('#hoverParameterOne').css({
                'color': 'white',
            });
            //Weight
            $('#hoverParameterTwo').text(medalistGroup.HeightMin + " - " + medalistGroup.HeightMax + " cm");
            $('#hoverParameterTwo').css({
                'color': 'white',
            });
            //Height
            $('#hoverParameterThree').text('Age Average: ' + Math.round(medalistGroup.AgeAverage) + " years");
            $('#hoverParameterThree').css({
                'color': thirdParameterColor,
            });
            //Count
            $('#hoverCount').text('Count: ' + medalistGroup.count);
            $('#hoverCount').css({
                'color': 'white',
            });
        });
        scatterPlotDot.mouseout(() => {
            scatterPlotDot.animate({
                'height': rPlot * 2,
                'width': rPlot * 2,
                'left': xPlot,
                'top': yPlot,
            }, 200);
            scatterPlotDot.removeClass("hover");

            $('#hoverGender').text("");
            $('#hoverParameterOne').text("");
            $('#hoverParameterTwo').text("");
            $('#hoverParameterThree').text("");
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
    drawHeightAndWeight();
    $('.spiral').css({
        'color': 'rgba(255, 255, 255, 0.5)',
    });

    $('.map').css({
        'color': 'rgba(255, 255, 255, 0.5)',
    });

    $('.diagram').css({
        'color': "white",
    });
    $('.age').css({
        'color': '#E67BFC',
    });
    $('.weight').css({
        'color': 'white',
    });

    $('.height').css({
        'color': 'white',
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

function ageView() {
    stage.empty();
    drawHeightAndWeight();
    console.log("ageAndHeightView");
    $('.age').css({
        'color': '#E67BFC',
    });
    $('.weight').css({
        'color': 'white',
    });

    $('.height').css({
        'color': 'white',
    });
}

function weightView() {
    stage.empty();
    drawAgeAndHeight();
    console.log("weightAndAgeView");
    $('.age').css({
        'color': 'white',
    });
    $('.weight').css({
        'color': '#E67BFC',
    });

    $('.height').css({
        'color': 'white',
    });
}

function heightView() {
    stage.empty();
    drawWeightAndAge();
    console.log("heightAndWeight");
    $('.age').css({
        'color': 'white',
    });
    $('.weight').css({
        'color': 'white',
    });

    $('.height').css({
        'color': '#E67BFC',
    });
}