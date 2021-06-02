let stageHeight, stageWidth;
let data, groupedData, summerGames, winterGames, cumulatedSummerGames, cumulatedWinterGames;
let stage;
// let showingChart;
$(function() {
    stage = $('#stage');
    stageHeight = stage.height();
    stageWidth = stage.width();
    prepareData();
    // createDots()
    // drawTimespiral();
    drawSpirale();
    // drawMap();
    // drawDiagram();
});

function prepareData() {

    data = gmynd.mergeData(gameData, positionData, "NOC", "alpha3Code");
    gmynd.deletePropsInData(data, ["alpha2Code", "numericCode", "countryName"]);
    console.log(data);

    //Filter to remove incomplete Data
    let filteredWeight = gmynd.filterPropType(data, "Weight", "Height", "Age", "Number");
    let filteredHeight = gmynd.filterPropType(filteredWeight, "Height", "Number");
    let filteredAge = gmynd.filterPropType(filteredHeight, "Age", "Number");


    // Function to see the Min and Max of the athletes characteristics
    // let extremesHeight = gmynd.dataExtremes(filteredAge, "Height");
    // let extremesWeight = gmynd.dataExtremes(filteredAge, "Weight");
    let extremesAge = gmynd.dataExtremes(filteredAge, "Age");



    // Function to see the Min and Max in relation to the gender
    let femaleAthletes = gmynd.findAllByValue(filteredAge, "Sex", "F");
    let maleAthletes = gmynd.findAllByValue(filteredAge, "Sex", "M");

    let extremesHeightFemale = gmynd.dataExtremes(femaleAthletes, "Height");
    let extremesWeightFemale = gmynd.dataExtremes(femaleAthletes, "Weight");
    let extremesAgeFemale = gmynd.dataExtremes(femaleAthletes, "Age");


    let extremesHeightMale = gmynd.dataExtremes(maleAthletes, "Height");
    let extremesWeightMale = gmynd.dataExtremes(maleAthletes, "Weight");
    let extremesAgeMale = gmynd.dataExtremes(maleAthletes, "Age");

    // Function to see number of female and male athletes
    let athleteTeamCount = gmynd.cumulateData(gameData, ["NOC"]);
    // let femaleAthletes = gmynd.findAllByValue(athlete, "Sex", "F");

    //Functions to separate Winter and Summer Games (for further calculations)
    summerGames = gmynd.findAllByValue(gameData, "Season", "Summer");
    winterGames = gmynd.findAllByValue(gameData, "Season", "Winter");

    // Functions to calculate Winter and Summer Games
    cumulatedSummerGames = gmynd.cumulateData(summerGames, ["Year"]);
    cumulatedWinterGames = gmynd.cumulateData(winterGames, ["Year"]);
    console.log(cumulatedSummerGames);

    //Functions to calculate athletes based on the team
    let cumulatedTeams = gmynd.cumulateData(filteredAge, ["NOC"])
    console.log(cumulatedTeams)

    // Some calculations
    const calculations = [{
        value: 'Year',
        method: 'Min',
    }];
    cumulatedGames = gmynd.cumulateData(gameData, "Season", calculations);
    // console.log(cumulatedGames);


    //Grouping both seasons
    groupedData = gmynd.groupData(gameData, "Season");

}

function drawSpirale() {
    const startX = stageWidth / 2;
    const startY = stageHeight / 2;

    for (let i = 0; i < cumulatedSummerGames.length; i++) {
        const summerYears = cumulatedSummerGames[i];

        const dot = $('<div></div>');
        dot.addClass("Year");

        let angle = -90 + ((summerYears.Year - 1896) * 2.9);

        angle = gmynd.radians(angle);
        let area = gmynd.map(summerYears.count, 1, 2048, 1, 600);
        let r = gmynd.circleRadius(area);

        let x = startX + (Math.cos(angle)) * 15 * 10; // cosinus vom winkel
        let y = startY + (Math.sin(angle)) * 15 * 10; // sinus vom winkel

        dot.css({
            'height': r,
            'width': r,
            'background-color': 'white',
            'position': 'absolute',
            'left': x,
            'top': y,
            'border-radius': '50%'
        });
        stage.append(dot);
    }

    for (let i = 0; i < cumulatedWinterGames.length; i++) {
        const winterYears = cumulatedWinterGames[i];

        const dot = $('<div></div>');
        dot.addClass("Year");

        let angle = -90 + ((winterYears.Year - 1896) * 2.9);

        angle = gmynd.radians(angle);
        let area = gmynd.map(winterYears.count, 1, 2048, 1, 600);
        let r = gmynd.circleRadius(area);

        let x = startX + (Math.cos(angle) * 20 * 10); // cosinus vom winkel
        let y = startY + (Math.sin(angle) * 20 * 10); // sinus vom winkel

        dot.css({
            'height': r,
            'width': r,
            'background-color': 'white',
            'position': 'absolute',
            'left': x,
            'top': y,
            'border-radius': '100%'
        });
        stage.append(dot);
    }
}