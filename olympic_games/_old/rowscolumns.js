const r = 5;
const circleGap = r;
const blockGap = 3 * r;

$(function () {
    draw();
});


function draw() {
    for (let i = 0; i < 200; i++) {
        const columnNumber = i % 10;
        /*  let blockOffset = 0;
         if (columnNumber >= 5) {
             blockOffset = blockGap;
         } */
        let blockOffset = columnNumber >= 5 ? blockGap : 0;
        const x = (3 * columnNumber * r) + blockOffset;
        const lineNumber = Math.floor(i / 10);
        const blockNumber = Math.floor(lineNumber / 5);
        const y = (lineNumber * 3 * r) + (blockNumber * blockGap);
        let dot = $('<div></div>');
        dot.css({
            'height': r * 2,
            'width': r * 2,
            'background-color': 'white',
            'position': 'absolute',
            'left': x,
            'top': y,
            'border-radius': '100%'
        });
        $('#stage').append(dot);
    }
}