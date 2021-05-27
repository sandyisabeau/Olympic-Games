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
    drawHistoryCircle();
});

function prepareData() {
    //Filter to remove incomplete Data
    let filteredWeight = gmynd.filterPropType(gameData, "Weight", "Number");
    let filteredHeight = gmynd.filterPropType(filteredWeight, "Height", "Number");
    let filteredAge = gmynd.filterPropType(filteredHeight, "Age", "Number");


    // Function to see the Min and Max of the athletes characteristics
    // let extremesHeight = gmynd.dataExtremes(filteredAge, "Height");
    // let extremesWeight = gmynd.dataExtremes(filteredAge, "Weight");
    let extremesAge = gmynd.dataExtremes(filteredAge, "Age");
    // console.log(extremesHeight);
    // console.log(extremesWeight);
    // console.log(extremesAge);


    // Function to see the Min and Max in relation to the gender
    let femaleAthletes = gmynd.findAllByValue(filteredAge, "Sex", "F");
    let maleAthletes = gmynd.findAllByValue(filteredAge, "Sex", "M");

    let extremesHeightFemale = gmynd.dataExtremes(femaleAthletes, "Height");
    let extremesWeightFemale = gmynd.dataExtremes(femaleAthletes, "Weight");
    let extremesAgeFemale = gmynd.dataExtremes(femaleAthletes, "Age");
    // console.log(extremesHeightFemale);
    // console.log(extremesWeightFemale);
    // console.log(extremesAgeFemale);

    let extremesHeightMale = gmynd.dataExtremes(maleAthletes, "Height");
    let extremesWeightMale = gmynd.dataExtremes(maleAthletes, "Weight");
    let extremesAgeMale = gmynd.dataExtremes(maleAthletes, "Age");
    console.log(extremesHeightMale);
    console.log(extremesWeightMale);
    console.log(extremesAgeMale);

    // Function to see number of female and male athletes
    let athleteTeamCount = gmynd.cumulateData(gameData, ["NOC"]);
    // let femaleAthletes = gmynd.findAllByValue(athlete, "Sex", "F");

    console.log(athleteTeamCount);
    //Functions to separate Winter and Summer Games (for further calculations)
    summerGames = gmynd.findAllByValue(gameData, "Season", "Summer");
    winterGames = gmynd.findAllByValue(gameData, "Season", "Winter");

    // Functions to calculate Winter and Summer Games
    cumulatedSummerGames = gmynd.cumulateData(summerGames, ["Year"]);
    cumulatedWinterGames = gmynd.cumulateData(winterGames, ["Year"]);

    const calculations = [{
        value: 'Year',
        method: 'Min',
    }];

    cumulatedGames = gmynd.cumulateData(gameData, "Season", calculations);
    // console.log(cumulatedGames);

    //Grouping both seasons
    groupedData = gmynd.groupData(gameData, "Season");

}

function drawHistoryCircle() {
    // console.log(cumulatedSummerGames);
    // console.log(cumulatedWinterGames);



    // const allGames = cumulatedSummerGames.length + 3;

    const startX = stageWidth / 2;
    const startY = stageHeight / 2;

    const keys = Object.keys(cumulatedSummerGames);
    const keyCount = keys.length;
    const minAthleteCountSummer = gmynd.dataMin(cumulatedSummerGames, "count");
    const maxAthleteCountSummer = gmynd.dataMax(cumulatedSummerGames, "count");

    let i = 0;
    for (let key in groupedData) {
        const continentCountries = groupedData[key];
        continentCountries.forEach((Year, j) => {
            const dot = $('<div></div>');
            dot.addClass("Year");

            let angle = 360 / cumulatedSummerGames.length * i;

            angle = gmynd.radians(angle);
            let area = gmynd.map(keyCount, minAthleteCountSummer, maxAthleteCountSummer, 100, 200);
            let r = gmynd.circleRadius(area);

            for (let j = 0; j < 1; j++) {
                let x = startX + (Math.cos(angle) * r * 20 * (j + 1)); // cosinus vom winkel
                let y = startY + (Math.sin(angle) * r * 20 * (j + 1)); // sinus vom winkel

                dot.gameData({
                    'height': r,
                    'width': r,
                    'background-color': 'white',
                    'position': 'absolute',
                    'left': x,
                    'top': y,
                    'border-radius': '100%'
                });
            }
            stage.append(dot);
        });
        i++;
    }

    // for (let i = 8; i < cumulatedSummerGames.length; i++) {
    //     let angle = 360 / cumulatedSummerGames.length * i;

    //     angle = gmynd.radians(angle);
    //     let area = gmynd.map(cumulatedWinterGames.count, 0, maxAthleteCountWinter, 0, 20);
    //     let r = gmynd.circleRadius(area);

    //     for (let j = 0; j < 1; j++) {
    //         let x = startX + (Math.cos(angle) * r * 30 * (j + 1)); // cosinus vom winkel
    //         let y = startY + (Math.sin(angle) * r * 30 * (j + 1)); // sinus vom winkel

    //         const dot = $('<div></div>');
    //         dot.css({
    //             'height': r,
    //             'width': r,
    //             'background-color': 'white',
    //             'position': 'absolute',
    //             'left': x,
    //             'top': y,
    //             'border-radius': '100%'
    //         });
    //         $('#stage').append(dot);
    //     }
    // }
}