let speed = 50;

$(function () {

    let ws_protocol = window.location.protocol == "https:" ? "wss:" : "ws:";
    let uri = `${window.location.hostname}:${window.location.port}`;

    let websocket = new WebSocket(`${ws_protocol}//${uri}/${channel_id}`);

    websocket.onmessage = function (event) {
        data = JSON.parse(event.data);
        console.log(`<${data.author}> ${data.message}`);
        push_new_line(data.message, data.color);
    }

    setInterval(step, 100);
}
)

function push_new_line(text, color) {
    let new_line = $("<p></p>");
    new_line.text(text);

    let pos = $(window).width();
    new_line.attr("pos", pos);
    new_line.css("left", `${pos}px`);

    if (color == "#000000") {
        color = "#FFFFFF";
    }

    let shadow_color = "#FFFFFF";

    let brightness = brightness_by_color(color);
    if (brightness > 180) {
        shadow_color = "#000000"
    }

    new_line.css("color", color);

    let shadow_css = [];
    for (x = -1; x <= 1; x++) {
        for (y = -1; y <= 1; y++) {
            shadow_css.push(`${x}px ${y}px 2px ${shadow_color}`);
        }
    }

    new_line.css("text-shadow", shadow_css.join(", "));
    $("body").append(new_line);

    let height = Math.random() * ($(window).height() - new_line.height());
    new_line.css("top", `${height}px`);
}

function step() {
    $("p").each(function () {
        let line = $(this);
        let pos = Number(line.attr("pos"));
        pos -= speed;

        line.attr("pos", pos);
        line.css("left", `${pos}px`);

        if (pos < -line.width()) {
            line.remove();
        }
    });

}

/**
 * Calculate brightness value by RGB or HEX color.
 * 
 * Taken from https://gist.github.com/w3core/e3d9b5b6d69a3ba8671cc84714cca8a4
 * 
 * @param color (String) The color value in RGB or HEX (for example: #000000 || #000 || rgb(0,0,0) || rgba(0,0,0,0))
 * @returns (Number) The brightness value (dark) 0 ... 255 (light)
 */
function brightness_by_color(color) {
    var color = "" + color, isHEX = color.indexOf("#") == 0, isRGB = color.indexOf("rgb") == 0;
    if (isHEX) {
        const hasFullSpec = color.length == 7;
        var m = color.substr(1).match(hasFullSpec ? /(\S{2})/g : /(\S{1})/g);
        if (m) var r = parseInt(m[0] + (hasFullSpec ? '' : m[0]), 16), g = parseInt(m[1] + (hasFullSpec ? '' : m[1]), 16), b = parseInt(m[2] + (hasFullSpec ? '' : m[2]), 16);
    }
    if (isRGB) {
        var m = color.match(/(\d+){3}/g);
        if (m) var r = m[0], g = m[1], b = m[2];
    }
    if (typeof r != "undefined") return ((r * 299) + (g * 587) + (b * 114)) / 1000;
}