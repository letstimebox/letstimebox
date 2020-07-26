const startTimer = (function () {

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

    const elem = function (tagName, attributes) {
        const children = [];
        return {
            attributes: attributes,
            innerHTML: undefined,
            append: function (child) {
                children.push(child);
            },
            renderText: function (text) {
                this.innerHTML = text;
            },
            render: function (parent) {
                let e;
                if (tagName === "svg") {
                    e = document.createElementNS('http://www.w3.org/2000/svg', tagName);
                } else {
                    e = document.createElementNS(parent.namespaceURI, tagName);
                }
                Object.entries(this.attributes).map(function (a) {
                    if (typeof a[1] === "function") {
                        e.setAttribute(a[0], a[1]());
                    } else {
                        e.setAttribute(a[0], a[1]);
                    }
                });
                if (this.innerHTML) {
                    e.innerHTML = this.innerHTML;
                } else {
                    children.forEach(child => child.render(e));
                }
                parent.appendChild(e);
            }
        }
    }

    const emphasizeTimerDisplay = function (seconds) {
        if (seconds % (15 * 60) === 0) {
            return true;
        } else if (seconds <= 10 * 60 && seconds % 60 === 0) {
            return true;
        } else if (seconds === 45 || seconds === 30 || seconds === 15) {
            return true;
        } else if (seconds <= 10 && seconds >= 0) {
            return true;
        }
        return false;
    }

    const humanizeTextContent = function (seconds, phase) {
        switch (phase) {
            case "running":
                return "<strong>" + Math.floor(seconds / 60) + "</strong> minutes";
            case "critical":
                return "<strong>" + seconds + "</strong> seconds";
            default:
                return "Time <strong>is up!</strong>";
        }
    }

    const drawTimer = function (root, seconds) {
        while (root.firstChild) root.removeChild(root.lastChild);

        const svgRoot = elem("svg", {
            width: "400px",
            height: "400px",
            xmlns: "http://www.w3.org/2000/svg"
        });

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

        const timerGroup = elem("g", {
            fill: "none",
            transform: "translate(50, 50)"
        });
        svgRoot.append(timerGroup);

        const outerCircle = elem("circle", {
            cx: "150",
            cy: "150",
            r: "140",
            "stroke-width": "20",
            stroke: () => phase === "alarm" ? pink : grey
        });
        timerGroup.append(outerCircle);

        const arc = elem("path", {
            d: () => getArcPath(phase === "over" ? 15 * 60 : seconds),
            "stroke-width": "80",
            stroke: () => phase === "critical" ? pink : turquoise,
            display: () => phase === "alarm" ? "none" : ""
        });
        timerGroup.append(arc);

        const innerCircle = elem("circle", {
            cx: "150",
            cy: "150",
            r: "40",
            fill: () => phase === "alarm" ? pink : grey
        });
        timerGroup.append(innerCircle);

        const alarmAnimation = elem("circle", {
            cx: "150",
            cy: "150",
            fill: pink,
            r: "20",
            display: () => phase === "alarm" && seconds % 2 === 0 ? "show" : "none"
        });
        alarmAnimation.append(elem("animate", {
            attributeName: "r",
            from: "20",
            to: "155",
            dur: "1s"
        }));
        alarmAnimation.append(elem("animate", {
            attributeName: "opacity",
            from: "1",
            to: "0",
            dur: "1s"
        }));
        timerGroup.append(alarmAnimation);

        svgRoot.render(root);


        const timeDisplay = elem("div", {
            class: "timer-display"
        });
        timeDisplay.renderText(humanizeTextContent(seconds, phase));
        timeDisplay.render(root);
        if (emphasizeTimerDisplay(seconds)) {
            const timeDisplayAnimated = elem("div", {
                class: "timer-display animated"
            });
            timeDisplayAnimated.renderText(humanizeTextContent(seconds, phase));
            timeDisplayAnimated.render(root);
        }
    };

    var interval;
    const startTimer = function (root, durationMinutes) {
        var seconds = durationMinutes * 60;
        interval = setInterval(function () {
            if (seconds > -31) {
                drawTimer(root, seconds);
            } else {
                clearInterval(interval);
            }
            seconds -= 1;
        }, 1000);
        return {
            stop: () => {
                clearInterval(interval)
            },
            restart: () => {
                clearInterval(interval);
                startTimer(durationMinutes);
            },
            reset: () => {
                clearInterval(interval);
                drawTimer(root, durationMinutes * 60);
            },
            logo: () => {
                clearInterval(interval);
                drawTimer(root, 15 * 60);
            }
        };
    }

    return startTimer;
})();
