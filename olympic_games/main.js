let stageHeight, stageWidth;
let data, groupedData, summerGames, winterGames, cumulatedSummerGames, cumulatedWinterGames, cumulatedCountries, cumulatedContinents;
let stage;
// let showingChart;
$(function() {
    stage = $('#stage');
    stageHeight = stage.height();
    stageWidth = stage.width();
    prepareData();
    // createDots()
    // drawTimespiral();
    drawSpiral();
    // drawMap();
    // drawDiagram();
});

function prepareData() {

    data = gmynd.mergeData(gameData, positionData, "NOC", "alpha3Code");
    data = gmynd.mergeData(data, continentalData, "NOC", "iso3");

    gmynd.deletePropsInData(data, ["alpha2Code", "iso2", "numericCode", "countryName", "number"]);



    //Filter to remove incomplete Data
    // let filteredWeight = gmynd.filterPropType(data, "Weight", "Number");
    // let filteredHeight = gmynd.filterPropType(filteredWeight, "Height", "Number");
    // let filteredAge = gmynd.filterPropType(filteredHeight, "Age", "Number");


    // Function to see the Min and Max of the athletes characteristics
    // let extremesHeight = gmynd.dataExtremes(filteredAge, "Height");
    // let extremesWeight = gmynd.dataExtremes(filteredAge, "Weight");
    // let extremesAge = gmynd.dataExtremes(filteredAge, "Age");



    // Function to see the Min and Max in relation to the gender
    // let femaleAthletes = gmynd.findAllByValue(filteredAge, "Sex", "F");
    // let maleAthletes = gmynd.findAllByValue(filteredAge, "Sex", "M");

    // let extremesHeightFemale = gmynd.dataExtremes(femaleAthletes, "Height");
    // let extremesWeightFemale = gmynd.dataExtremes(femaleAthletes, "Weight");
    // let extremesAgeFemale = gmynd.dataExtremes(femaleAthletes, "Age");


    // let extremesHeightMale = gmynd.dataExtremes(maleAthletes, "Height");
    // let extremesWeightMale = gmynd.dataExtremes(maleAthletes, "Weight");
    // let extremesAgeMale = gmynd.dataExtremes(maleAthletes, "Age");

    // Function to see number of athletes

    cumulatedCountries = gmynd.cumulateData(data, ["NOC", "Team", "longitude", "latitude"]);
    // groupedCountries = gmynd.groupData(data, ['NOC']);

    // const groupedTeams = gmynd.groupData(data, "NOC");
    // let femaleAthletes = gmynd.findAllByValue(athlete, "Sex", "F");

    //Functions to separate Winter and Summer Games (for further calculations)
    summerGames = gmynd.findAllByValue(data, "Season", "Summer");
    winterGames = gmynd.findAllByValue(data, "Season", "Winter");

    // Functions to calculate Winter and Summer Games
    cumulatedSummerGames = gmynd.cumulateData(summerGames, ["Year", "City"]);
    cumulatedWinterGames = gmynd.cumulateData(winterGames, ["Year", "City"]);

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

function drawSpiral() {
    const startX = stageWidth / 2;
    const startY = stageHeight / 2;
    const athletesPerSummerGame = gmynd.dataExtremes(cumulatedSummerGames, "count");
    const athletesPerWinterGame = gmynd.dataExtremes(cumulatedWinterGames, "count");
    console.log(cumulatedSummerGames);

    // console.log(countryExtremes);
    cumulatedSummerGames.forEach(summerGame => {
        let angle = (summerGame.Year - 1896) * 2.9;
        angle = gmynd.radians(angle);
        const area = gmynd.map(summerGame.count, 20, 1771, 10, 500);
        const rSpiral = gmynd.circleRadius(area);

        let xSpiral = (startX + (Math.cos(angle - 1.5)) * 15 * 10) - rSpiral; // cosinus vom winkel
        let ySpiral = (startY + (Math.sin(angle - 1.5)) * 15 * 10) - rSpiral; // sinus vom winkel

        let dot = $('<div></div>');
        dot.addClass("summerGame");
        dot.css({
            'height': rSpiral * 2,
            'width': rSpiral * 2,
            'left': xSpiral,
            'top': ySpiral,
            'position': 'absolute',
            'border-radius': '100%',
            'background-color': 'white',
        });
        dot.data(summerGame);
        stage.append(dot);
        dot.mouseover(() => {
            dot.addClass("hover");
            $('#hoverLabel').text('Season: Summer' + ',' + ' Year : ' + summerGame.Year + ', ' + 'City: ' + summerGame.City + ', ' + 'Athletes: ' + summerGame.count);
        });
        dot.mouseout(() => {
            dot.removeClass("hover");
            $('#hoverLabel').text("");
        });
    });
    console.log(cumulatedWinterGames);

    // console.log(countryExtremes);
    cumulatedWinterGames.forEach(winterGame => {
        let angle = (winterGame.Year - 1896) * 2.9;
        angle = gmynd.radians(angle);
        const area = gmynd.map(winterGame.count, 20, 1771, 10, 500);
        const rSpiral = gmynd.circleRadius(area);

        let xSpiral = (startX + (Math.cos(angle - 1.5)) * 20 * 10) - rSpiral; // cosinus vom winkel
        let ySpiral = (startY + (Math.sin(angle - 1.5)) * 20 * 10) - rSpiral; // sinus vom winkel

        let dot = $('<div></div>');
        dot.addClass("winterGame");
        dot.css({
            'height': rSpiral * 2,
            'width': rSpiral * 2,
            'left': xSpiral,
            'top': ySpiral,
            'position': 'absolute',
            'border-radius': '100%',
            'background-color': 'white',
        });
        dot.data(winterGame);
        stage.append(dot);
        dot.mouseover(() => {
            dot.addClass("hover");
            $('#hoverLabel').text('Season: Winter' + ',' + ' Year : ' + winterGame.Year + ', ' + 'City: ' + winterGame.City + ', ' + 'Athletes: ' + winterGame.count);
        });
        dot.mouseout(() => {
            dot.removeClass("hover");
            $('#hoverLabel').text("");
        });
    });
}

function drawMap() {
    const athletesPerTeam = gmynd.dataExtremes(cumulatedCountries, "count");
    // const longitudeExtremes = gmynd.dataExtremes(cumulatedCountries, "longitude");
    // const latitudeExtremes = gmynd.dataExtremes(cumulatedCountries, "latitude");


    // console.log(latitudeExtremes);

    // console.log(countryExtremes);
    cumulatedCountries.forEach(country => {
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
            $('#hoverLabel').text('Country : ' + country.Team + ', ' + 'Athletes : ' + country.count);
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