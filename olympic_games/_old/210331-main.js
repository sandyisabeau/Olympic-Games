const data = [4, 5, 2, 7, 3, 8, 1, 55, 4, 7, 4, 7, 9, 1];
let stageHeight, stageWidth;
let max = data[0];

$(function() {
    // wird erst ausgeführt, wenn Website komplett geladen:
    stageHeight = $('#stage').innerHeight();
    stageWidth = $('#stage').innerWidth();
    getMaximum();
    drawBarChart();
});



function getMaximum() {
    for (let i = 1; i < data.length; i++) {
        if (data[i] > max) {
            max = data[i];
        }
    }

    /* 
    // Das hier macht das gleiche:
    data.forEach( value => {
        if (value > max) {
            max = value;
        }
    } ); */

    // Das hier macht auch das gleiche:)
    // let max = Math.max(...data);
    console.log("Maximum: " + max);
}

function drawBarChart() {
    for (let i = 0; i < data.length; i++) {
        const heightFactor = stageHeight / max;
        const h = data[i] * heightFactor;
        const w = stageWidth / ((data.length * 2) - 1);
        const x = i * 2 * w;
        const y = stageHeight - h;
        let bar = $('<div></div>');
        bar.css({
            'height': h,
            'width': w,
            'background-color': 'white',
            'position': 'absolute',
            'left': x,
            'top': y
        });
        $('#stage').append(bar);
    }
}