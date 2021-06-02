function getTimeSpiral(settings, parent = null) {
    settings = gmynd.parentOverride(settings, parent);
    const sortedByTime = settings.array.sort(function(a, b) {
        return Date.parse(a[settings.property]) > Date.parse(b[settings.property]);
    });
    if (!settings.start) settings.start = sortedByTime[0][settings.property];
    if (!settings.end) {
        for (let i = sortedByTime.length - 1; i >= 0; i--) {
            if (sortedByTime[i].hasOwnProperty(settings.time.property)) {
                if (sortedByTime[i][settings.property] > 0) { // TODO: this is not ideal
                    settings.end = sortedByTime[0][settings.property];
                }
            }
        }
    }
    settings.start = Date.parse(settings.start);
    settings.end = Date.parse(settings.end);
    const timeRange = settings.end - settings.start;

    if (!settings.revolutions) {
        if (settings.msForRevolution) {
            settings.revolutions = timeRange / settings.msForRevolution;
        } else {
            settings.revolutions = 4;
        } // just some arbitrarily chosen value
    }
    settings.msForRevolution = timeRange / settings.revolutions;
    const center = { x: settings.width / 2, y: settings.height / 2 };
    const maxRadius = Math.min(center.x, center.y);
    const revolutionWidth = maxRadius / settings.revolutions;
    const spiralArea = gmynd.getAreaByRadius(maxRadius);
    const baseElSize = settings.size.sizeFactor * (settings.size.rounded ?
        gmynd.getRadiusByArea(spiralArea / settings.array.length) :
        Math.sqrt(spiralArea / settings.array.length));
    let container = $('<div class="time-spiral"></div>');

    settings.array.forEach(obj => {
        if (obj.hasOwnProperty(settings.property)) {
            if (!isNaN(obj[settings.property])) {
                const passedTime = Math.max(0, Date.parse(obj.independenceDate) - settings.start);
                const revolutionNumber = Math.floor(passedTime / settings.msForRevolution);
                const angle = (passedTime % settings.msForRevolution) / settings.msForRevolution * Math.PI * 2;
                const radius = (revolutionNumber + (passedTime % settings.msForRevolution) / settings.msForRevolution) * revolutionWidth;
                const xPos = Math.sin(angle) * radius + center.x + settings.position.x;
                const yPos = Math.cos(angle) * radius + center.y + settings.position.y;
                // TODO: implement size adjustments
                let element = $('<div class="timespiral-element"></div>');
                element.css({
                    "position": "absolute",
                    "background-color": settings.color,
                    "width": baseElSize,
                    "height": baseElSize,
                    "left": xPos,
                    "top": yPos,
                    "border-radius": settings.size.rounded ? "50%" : 0
                });
                gmynd.connectData(element, obj);
                if (settings.label.active) gmynd.activateLabel(element, settings);

                container.append(element);
            }
        }
    });