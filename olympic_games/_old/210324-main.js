const data = [4, 5, 2, 7, 3, 8, 1];
// console.log(data[3]);
// console.log(data.length);


/*
 i++ 
i = i+1
i +=1

i*=2
i = i * 2 
*/

for (let i = 0; i < data.length; i++) {
    const h = data[i] * 10;
    const x = i * 20;
    const y = $('#stage').innerHeight() - h;
    let bar = $('<div></div>');
    bar.css({
        'height': h,
        'width': 10,
        'background-color': 'white',
        'position': 'absolute',
        'left': x,
        'top': y
    });
    $('#stage').append(bar);
}

