var geojsonLayer;
// original style
function style(feature) {
    return {
        fillColor: '#CCCCCC',
        fillOpacity: 1,
        weight: 2,
        opacity: 1,
        color: 'white'
    };
}
$.getJSON("https://rawgit.com/johan/world.geo.json/master/countries.geo.json", function (data) {
    geojsonLayer = L.geoJson(data, {
        style: style
    });
    loadMap();
});
//var geojsonLayer = new L.GeoJSON.AJAX("https://rawgit.com/johan/world.geo.json/master/countries.geo.json", {
//      style: style
//});
function loadMap() {
    console.log(geojsonLayer);
    var map = L.map('map').setView([0, 0], 3);
    geojsonLayer.addTo(map);
    geojsonLayer.on('mouseover', mousedFeature);
}

function mousedFeature(evt) {
    console.log(evt);
    var newColor = get_random_color();
    //evt.layer.setStyle({
    //  fillColor : newColor
    //});
    fade(evt.layer, newColor, '#CCCCCC', 1500);
}

// random color
// http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
function get_random_color() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

// linear interpolation between two values a and b
// u controls amount of a/b and is in range [0.0,1.0]
// http://stackoverflow.com/questions/11292649/javascript-color-animation
lerp = function (a, b, u) {
    return (1 - u) * a + u * b;
};

// color fade
// http://stackoverflow.com/questions/11292649/javascript-color-animation
function fade(layer, start, end, duration) {
    console.log(start, end);
    var interval = 10;
    var steps = duration / interval;
    var step_u = 1.0 / steps;
    var u = 0.0;
    var start = hexToRgb(start);
    var end = hexToRgb(end);
    var theInterval = setInterval(function () {
        if (u >= 1.0) {
            clearInterval(theInterval)
        }
        if (start && end) {
            var r = parseInt(lerp(start.r, end.r, u));
            var g = parseInt(lerp(start.g, end.g, u));
            var b = parseInt(lerp(start.b, end.b, u));
            //console.log(r,g,b,colorname);
            var colorname = 'rgb(' + r + ',' + g + ',' + b + ')';
            layer.setStyle({
                fillColor: colorname
            });
            u += step_u;
        }
    }, interval);
};

// convert from hex to rgb
// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
