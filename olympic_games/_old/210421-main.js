let stageHeight, stageWidth;
let data;
$(function () {
    stageHeight = $('#stage').innerHeight();
    stageWidth = $('#stage').innerWidth();
    prepareData();
    drawMap();
});

function prepareData() {

    data = gmynd.mergeData(positionData, populationData, "alpha3Code");

    /*    positionData.forEach(posCountry => {
           populationData.forEach(popCountry => {
               if (posCountry.alpha3Code === popCountry.countryCode) {
                   posCountry.population = popCountry.population;
               }
           });
       }); */

    console.log(data);
}

function drawMap() {
    // console.log(data.length);
    const populationMax = gmynd.dataMax(data, "population");
    //console.log("max: " + populationMax);
    data.forEach(country => {
        const area = gmynd.map(country.population, 0, populationMax, 2, 20);
        //console.log(country.longitude);
        const x = gmynd.map(country.longitude, -180, 180, 0, stageWidth) - r;
        const y = gmynd.map(country.latitude, -90, 90, stageHeight, 0) - r;
        let dot = $('<div></div>');
        dot.css({
            'height': r,
            'width': r,
            'background-color': 'white',
            'position': 'absolute',
            'left': x,
            'top': y,
            'border-radius': '100%'
        });
        $('#stage').append(dot);
    })
}


/*
function myFunction(a, b, c) {

}

//arrow function
myFunction = (a, b, c) => {

} */
/*
let a = 2;
let b = "2";

a == b // true
a === b // false */