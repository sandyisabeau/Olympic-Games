const data = [4, 5, 2, 7, 3, 8, 1];
let stageHeight, stageWidth;

$(function () {
    // wird erst ausgeführt, wenn Website komplett geladen:
    stageHeight = $('#stage').innerHeight();
    stageWidth = $('#stage').innerWidth();
    drawSunChart();
});

function drawBarChart() {
    const w = 25;
    const h = 25;
    for (let i = 0; i < data.length; i++) {
        // console.log("i = " + i);
        for (let j = 0; j < data[i]; j++) {
            const x = i * 2 * w;
            const y = stageHeight - (j * h * 1.5) - h;

            let dot = $('<div></div>');
            dot.css({
                'height': h,
                'width': w,
                'background-color': 'white',
                'position': 'absolute',
                'left': x,
                'top': y,
                'border-radius': '100%'
            });
            $('#stage').append(dot);

            // console.log("j = " + j);
        }
    }
}

function drawSunChart() {
    const r = 10;
    // const w = 10;
    //const h = 10;
    const startX = stageWidth / 2;
    const startY = stageHeight / 2;
    for (let i = 0; i < data.length; i++) {
        let angle = 360 / data.length * i;

        angle = gmynd.radians(angle);

        for (let j = 0; j < data[i]; j++) {
            const x = startX + (Math.cos(angle) * r * 1.35 * (j + 1)); // cosinus vom winkel
            const y = startY + (Math.sin(angle) * r * 1.35 * (j + 1)); // sinus vom winkel

            let dot = $('<div></div>');
            dot.css({
                'height': r,
                'width': r,
                'background-color': 'gold',
                'position': 'absolute',
                'left': x,
                'top': y,
                'border-radius': '100%'
            });
            $('#stage').append(dot);
        }
    }
}



