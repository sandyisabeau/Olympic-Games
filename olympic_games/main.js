let stageHeight, stageWidth;
let data, groupedData, cumulatedCountries;
let stage;
let showingChart;
$(function() {
    // stage = $('#stage');
    // stageHeight = stage.height();
    // stageWidth = stage.width();
    prepareData();
    // createDots()
    // drawBarChart();
});

function prepareData() {
    let filteredGame = gmynd.filterPropType(gameData, "medal", "String");
    console.log(filteredGame);
    let download = gmynd.saveData(filteredGame, filename = 'filteredGameData.json', pretty = true);

    // data = gmynd.mergeData(positionData, populationData, "alpha3Code");
    // data = gmynd.mergeData(data, continentalData, "alpha3Code", "iso3");
    // gmynd.deletePropsInData(data, ["iso2", "number", "country"]);
    // const africanCountries = gmynd.findAllByValue(data, "continent", "Africa");

    // const calculations = [
    //     {
    //         value: 'population',
    //         method: 'Average',
    //     },
    //     {
    //         value: 'population',
    //         method: 'Median',
    //     },
    //     {
    //         value: 'longitude',
    //         method: 'Min',
    //         title: 'westEnd'
    //     },
    //     {
    //         value: 'longitude',
    //         method: 'Max',
    //         title: 'eastEnd'
    //     },
    //     {
    //         value: 'population',
    //         method: 'Sum',
    //     },
    //     {
    //         value: 'population',
    //         method: 'Percentile',
    //         p: .75
    //     },];
    // cumulatedCountries = gmynd.cumulateData(data, "continent", calculations);
    // console.log(cumulatedCountries);

    // groupedData = gmynd.groupData(data, "continent");

    // console.log(groupedData);
    // gmynd.saveData(groupedData);
}


// function createDots() {
//     const keys = Object.keys(groupedData);
//     const keyCount = keys.length;
//     const maxCountriesPerContinent = gmynd.dataMax(cumulatedCountries, "count");
//     const populationMax = gmynd.dataMax(data, "population");
//     console.log(maxCountriesPerContinent);

//     const countryWidth = stageWidth / (keyCount * 2 - 1);
//     let i = 0;
//     for (let key in groupedData) {
//         const continentCountries = groupedData[key];
//         const xPos = i * countryWidth * 2;
//         continentCountries.forEach((country, j) => {
//             const dot = $('<div></div>');
//             dot.addClass("country");
//             const _height = stageHeight / maxCountriesPerContinent;
//             const yPos = stageHeight - _height * j - _height;

//             const area = gmynd.map(country.population, 0, populationMax, 25, 200);
//             const r = gmynd.circleRadius(area);
//             const x = gmynd.map(country.longitude, -180, 180, 0, stageWidth) - r;
//             const y = gmynd.map(country.latitude, -90, 90, stageHeight, 0) - r;

//          dot.data({
//                 barWidth: countryWidth,
//                 barHeight: _height,
//                 barLeft: xPos,
//                 barTop: yPos,

//                 mapHeight: r * 2,
//                 mapWidth: r * 2,
//                 mapLeft: x,
//                 mapTop: y,
//             });

//             stage.append(dot);
//         });
//         i++;
//     }
// }


// function drawBarChart() {
//     showingChart = true;

//     $('.country').each(function () {
//         const dotData = $(this).data();
//         $(this).animate({
//             'width': dotData.barWidth,
//             'height': dotData.barHeight,
//             'left': dotData.barLeft,
//             'top': dotData.barTop,
//             'border-radius': 0,
//         }, 500);
//     });
// }


// function toggleView() {
//     console.log("togglewoggle");

//     // stage.empty();
//     if (showingChart) {
//         drawMap();
//     }
//     else {
//         drawBarChart();
//     }
// }


// function drawMap() {
//     showingChart = false;

//     $('.country').each(function () {
//         const dotData = $(this).data();
//         $(this).css({

//         });
//         $(this).animate({
//             'background-color': 'rgb(255, 0, 0)',
//             'width': dotData.mapWidth,
//             'height': dotData.mapHeight,
//             'left': dotData.mapLeft,
//             'top': dotData.mapTop,
//             'border-radius': '100%',
//         }, 1500);
//     });
// }
/* 
dot.data(country);

dot.click(() => {
    $(".clicked").removeClass("clicked");
    dot.addClass("clicked");
    $('#clickLabel').text(dot.data().countryName);
});

dot.mouseover(() => {
    dot.addClass("hover");
    $('#hoverLabel').text(country.countryName);

});

dot.mouseout(() => {
    dot.removeClass("hover");
    $('#hoverLabel').text("");

}); */