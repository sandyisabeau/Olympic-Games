let stageHeight, stageWidth;
let data, cityContinents, groupedData, summerGames, winterGames, cumulatedSummerGames, cumulatedWinterGames, cumulatedCountries, cumulatedContinents;
let stage;
// let showingChart;
$(function() {
    stage = $('#stage');
    stageHeight = stage.height();
    stageWidth = stage.width();
    prepareData();
    // createDots()
    // drawTimespiral();
    // drawSpiral();
    drawMap();
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
    gmynd.deletePropsInData(data, ["alpha2Code", "iso2", "numericCode", "countryName", "number"]);


    // Function to see the Min and Max of the athletes characteristics
    // let extremesHeight = gmynd.dataExtremes(data, "Height");
    // let extremesWeight = gmynd.dataExtremes(data, "Weight");
    // let extremesAge = gmynd.dataExtremes(data, "Age");



    // Function to see the Min and Max in relation to the gender
    // let femaleAthletes = gmynd.findAllByValue(data, "Sex", "F");
    // let maleAthletes = gmynd.findAllByValue(data, "Sex", "M");

    // let extremesHeightFemale = gmynd.dataExtremes(femaleAthletes, "Height");
    // let extremesWeightFemale = gmynd.dataExtremes(femaleAthletes, "Weight");
    // let extremesAgeFemale = gmynd.dataExtremes(femaleAthletes, "Age");


    // let extremesHeightMale = gmynd.dataExtremes(maleAthletes, "Height");
    // let extremesWeightMale = gmynd.dataExtremes(maleAthletes, "Weight");
    // let extremesAgeMale = gmynd.dataExtremes(maleAthletes, "Age");


    // const groupedTeams = gmynd.groupData(data, "NOC");
    // let femaleAthletes = gmynd.findAllByValue(athlete, "Sex", "F");

    //Functions to separate Winter and Summer Games (for further calculations)
    summerGames = gmynd.findAllByValue(cityContinents, "Season", "Summer");
    winterGames = gmynd.findAllByValue(cityContinents, "Season", "Winter");
    console.log(data);

    // Function to see number of athletes
    countriesAtBothGames = gmynd.cumulateData(data, ["NOC", "longitude", "latitude"]);
    countriesAtSummerGames = gmynd.findAllByValue(data, "Season", "Summer");
    countriesAtWinterGames = gmynd.findAllByValue(data, "Season", "Winter");
    console.log(countriesAtSummerGames);
    console.log(countriesAtWinterGames);

    // Functions to calculate Winter and Summer Games
    cumulatedSummerGames = gmynd.cumulateData(summerGames, ["Year", "City", "continent"]);
    cumulatedWinterGames = gmynd.cumulateData(winterGames, ["Year", "City", "continent"]);

    // Some calculations
    // const calculations = [{
    //     value: 'Year',
    //     method: 'Min',
    // }];
    // cumulatedGames = gmynd.cumulateData(gameData, "Season", calculations);
    // console.log(cumulatedGames);


    //Grouping both seasons
    groupedData = gmynd.groupData(data, "Season");

}

function continentColor() {
    if (continent == "Europe") {
        dot.css({
            'background-color': '#2796EA',
        });
    }
    if (continent == "Asia") {
        dot.css({
            'background-color': '#FF9839',
        });
    }
    if (continent == "Oceania") {
        dot.css({
            'background-color': '#22AE70',
        });
    }
    if (continent == "North America") {
        dot.css({
            'background-color': '#DF366E',
        });
    }
    if (continent == "South America") {
        dot.css({
            'background-color': '#DF366E',
        });
    }
}

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
        angle = gmynd.radians(angle);
        const area = gmynd.map(summerGame.count, 19, 2031, 20, 500);
        const rSpiral = gmynd.circleRadius(area);

        let xSpiral = (startX + (Math.cos(angle - 1.5)) * 15 * 10) - rSpiral; // cosinus vom winkel
        let ySpiral = (startY + (Math.sin(angle - 1.5)) * 15 * 10) - rSpiral; // sinus vom winkel

        let spiralDot = $('<div></div>');
        spiralDot.addClass("summerGame");
        spiralDot.css({
            'height': rSpiral * 2,
            'width': rSpiral * 2,
            'left': xSpiral,
            'top': ySpiral,
            'position': 'absolute',
            'border-radius': '100%',
            'background-color': 'white',
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
        angle = gmynd.radians(angle);
        const area = gmynd.map(winterGame.count, 19, 2031, 20, 500);
        const rSpiral = gmynd.circleRadius(area);

        let xSpiral = (startX + (Math.cos(angle - 1.5)) * 20 * 10) - rSpiral; // cosinus vom winkel
        let ySpiral = (startY + (Math.sin(angle - 1.5)) * 20 * 10) - rSpiral; // sinus vom winkel

        let spiralDot = $('<div></div>');
        spiralDot.addClass("winterGame");
        spiralDot.css({
            'height': rSpiral * 2,
            'width': rSpiral * 2,
            'left': xSpiral,
            'top': ySpiral,
            'position': 'absolute',
            'border-radius': '100%',
            'background-color': 'white',
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
    const athletesPerTeam = gmynd.dataExtremes(countriesAtBothGames, "count");
    // const longitudeExtremes = gmynd.dataExtremes(cumulatedCountries, "longitude");
    // const latitudeExtremes = gmynd.dataExtremes(cumulatedCountries, "latitude");


    // console.log(latitudeExtremes);

    // console.log(countryExtremes);
    countriesAtBothGames.forEach(country => {
        const area = gmynd.map(country.count, athletesPerTeam.min, athletesPerTeam.max, 25, 500);
        const rMap = gmynd.circleRadius(area);
        const xMap = gmynd.map(country.longitude, -102, 174, 0, stageWidth) - rMap;
        const yMap = gmynd.map(country.latitude, -41, 65, stageHeight, 0) - rMap;
        let dot = $('<div></div>');
        dot.addClass("country");
        dot.css({
            'height': rMap * 2,
            'width': rMap * 2,
            'left': xMap,
            'top': yMap,
            'border-radius': '100%',
            'background-color': 'white',
        });
        dot.data(country);
        stage.append(dot);
        dot.mouseover(() => {
            dot.addClass("hover");
            $('#hoverLabel').text('Country : ' + country.country + ', ' + 'Athletes : ' + country.count);
        });
        dot.mouseout(() => {
            dot.removeClass("hover");
            $('#hoverLabel').text("");
        });
    });
}

// function drawDiagram() {
//     größe
//     gewicht
//     alter
//     if abfrage, was geklickt wurde
//     x udn y abstände berechnen
// }