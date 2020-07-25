const startTimer = (function(){

    function getArcPath(seconds) {
        const margin = 10;
        const r = 140;

        const degree = seconds / 10; // 60 min is 360 degree
        const rad = degree * Math.PI / 180;

        const y = -Math.cos(rad) * r;
        const x = -Math.sin(rad) * r;

        const svgTargetX = Math.round(x + r + margin).toString();
        const svgTargetY = Math.round(y + r + margin).toString();
        const biggerThanHalf = degree % 360 > 180 ? "1" : "0";

        const dirtyFullTimeHack = degree === 360 ? ".0001" : "";
        const dirtyBiggerThanHalf = degree === 360 ? "1" : biggerThanHalf;

        const pathString = `M 150,10 A 140,140 1,${dirtyBiggerThanHalf},0 ${svgTargetX}${dirtyFullTimeHack},${svgTargetY}`;
        return pathString;
    }

    const drawTimer = function(rootId, seconds) {
        const timeDisplay = document.getElementById("remaining-time-display");
        const svgRoot = document.getElementById(rootId);
        svgRoot.innerHtml = ' ';
        while(svgRoot.firstChild) svgRoot.removeChild(svgRoot.lastChild);

        const pink = "#ff2cb4";
        const turquoise = "#40E0D0";
        const grey = "#979797";

        let phase;
        if (seconds >= 60) {
            phase = "running";
        } else if (seconds > 0) {
            phase = "critical"; 
        } else if (seconds > -30) {
            phase = "alarm"
        } else {
            phase = "over";
        }

        switch(phase) {
            case "running": timeDisplay.innerHTML = "<strong>" + Math.floor(seconds/60) + "</strong> minutes"; break;
            case "critical": timeDisplay.innerHTML = "<strong>" + seconds + "</strong> seconds"; break;
            default: timeDisplay.innerHTML = "Time is up.";
        }

        const elem = function(tagName, attributes){
            const children = [];
            return {
                attributes: attributes,
                append: function(child) {
                    children.push(child);
                },
                init: function(parent) {
                    const e = document.createElementNS('http://www.w3.org/2000/svg', tagName);
                    if (typeof this.render === "function") {
                        this.render();
                    }
                    Object.entries(this.attributes).map(function(a) {
                        if (typeof a[1] === "function") {
                            e.setAttribute(a[0],a[1]());
                        } else {
                            e.setAttribute(a[0],a[1]);
                        }
                    });
                    children.forEach(child => child.init(e));
                    parent.appendChild(e);
                }
            }
        }

        const timerGroup = elem("g", {fill: "none", transform: "translate(50, 50)"});
        const outerCircle = elem("circle", {
            cx: "150", cy: "150", r: "140", "stroke-width": "20",
            stroke: () =>  phase === "alarm" ? pink : grey});
        timerGroup.append(outerCircle);

        const arc = elem("path", {
            d: () => getArcPath(phase === "over" ? 15*60 : seconds),
            "stroke-width": "80",
            stroke: () =>  phase === "critical" ? pink : turquoise,
            display: () =>  phase === "alarm" ? "none" : ""});
        timerGroup.append(arc);

        const innerCircle = elem("circle", {
            cx: "150", cy: "150", r: "40", 
            fill: () =>  phase === "alarm" ? pink : grey});
        timerGroup.append(innerCircle);

        const alarmAnimation = elem("circle", {
            cx: "150", cy: "150", fill: pink, r: "20", "stroke-width": "0",
            display: () =>  phase === "alarm" ? "" : "none"});
        alarmAnimation.append(elem("animate", {attributeName: "r", from: "20", to: "155", dur: "2s", begin: "0s", repeatCount: "15"}));
        alarmAnimation.append(elem("animate", {attributeName: "opacity", from: "1", to: "0", dur: "2s", begin: "0s", repeatCount: "15"}));
        timerGroup.append(alarmAnimation);

        timerGroup.init(svgRoot);
    };

    var interval;
    const startTimer = function (durationMinutes) {
        var seconds = durationMinutes * 60;
        interval = setInterval(function(){
            console.log(seconds);
            if(seconds > -31) {
                drawTimer("remaining-time-indicator", seconds);
            }
            else {
                clearInterval(interval);
            }
            seconds -= 1;
        }, 1000);
        return {
            stop: () => {clearInterval(interval)},
            restart: () => {clearInterval(interval); startTimer(durationMinutes);},
            reset: () => {clearInterval(interval); drawTimer("remaining-time-indicator", durationMinutes * 60);},
            logo: () => {clearInterval(interval); drawTimer("remaining-time-indicator", 15 * 60);}
        };
    }

    return startTimer;
})();
