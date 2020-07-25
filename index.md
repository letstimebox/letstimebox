---
layout: default
---

<input type="button" value="create channel" onclick="letstimebox.createChannel()"/>

<input type="button" value="start 5min timer" onclick="letstimebox.startNewTimer(5)"/>


<p id="link">
</p>

<p id="timer"></p>
<svg width="400px" height="400px" xmlns="http://www.w3.org/2000/svg" id="remaining-time-indicator">
	<g fill="none" transform="translate(50, 50)">
	  <circle stroke-width="20" cx="150" cy="150" r="140"></circle>
	  <path stroke-width="80" d="M 150,10 A 140,140 1,0,0 10,150 "/>
	  <circle cx="150" cy="150" r="40"></circle>

	  <circle cx="150" cy="150" fill="none" r="20" stroke-width="0" display="none">
		<animate attributeName="r" from="20" to="155" dur="2s" begin="0s" repeatCount="15"/>
		<animate attributeName="opacity" from="1" to="0" dur="2s" begin="0s" repeatCount="15"/>
	  </circle>
	</g>
</svg>
<div id="remaining-time-display"></div>
<script>

  // Enable pusher logging - don't include this in production
  Pusher.logToConsole = true;

  (function() {
    function makeid(length) {
       var result           = '';
       var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
       var charactersLength = characters.length;
       for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }
    
	const pink = "#ff2cb4";
	const turqoise = "#40E0D0";
	const grey = "#979797";

	function getArcPath(minutes) {
		const margin = 10;
		const r = 140;

		const degree = minutes * 6; // 60 min is 360 degree
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
	function showTime(minutes, seconds) {
		console.log(minutes, seconds);
		const svgGroup = document.getElementById("remaining-time-indicator").getElementsByTagName("g")[0];
		const timeDisplay = document.getElementById("remaining-time-display");
		const arc = svgGroup.getElementsByTagName("path")[0];
		const circles = svgGroup.getElementsByTagName("circle");
		if (minutes >=1) {
			circles[0].setAttribute("stroke", grey)
			circles[1].setAttribute("fill", grey)
			circles[2].setAttribute("fill", grey)
			circles[2].setAttribute("display", "none")
			arc.setAttribute("stroke", turqoise)
			arc.setAttribute("d", getArcPath(minutes))
			timeDisplay.innerHTML = minutes;
		} else if (seconds > 0) {
			circles[0].setAttribute("stroke", grey)
			circles[1].setAttribute("fill", grey)
			circles[2].setAttribute("fill", grey)
			circles[2].setAttribute("display", "none")
			arc.setAttribute("stroke", pink)
			arc.setAttribute("d", getArcPath(1))
			timeDisplay.innerHTML = seconds;
		} else {
			circles[0].setAttribute("stroke", pink)
			circles[1].setAttribute("fill", pink)
			circles[2].setAttribute("fill", pink)
			circles[2].setAttribute("display", "show")
			arc.setAttribute("stroke", pink)
			arc.setAttribute("d", getArcPath(0))
			timeDisplay.innerHTML = "0";
			setTimeout(function(){
				circles[0].setAttribute("stroke", grey)
				circles[1].setAttribute("fill", grey)
				circles[2].setAttribute("fill", grey)
				arc.setAttribute("stroke", turqoise)
				arc.setAttribute("d", getArcPath(15))
			}, 30000)
		}
	}

	function startTimerDisplay(durationMinutes) {
		var seconds = durationMinutes * 60;
		const interval = setInterval(function(){
			console.log(seconds);
			if(seconds > -1) {
				showTime(Math.floor(seconds / 60), seconds % 60);
			}
			else {
				clearInterval(interval);
			}
			seconds -= 1;
		}, 1000)
	}

    window.letstimebox = {
      pusher: new Pusher('ef8c49c842e4f97adbd5', {
        cluster: 'eu'
      }),
      createChannel: function() {
        letstimebox.channelId = makeid(8);
        const qrcode = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&format=svg&data=' + encodeURI('https://letstimebox.com/watch/' + letstimebox.channelId);
        document.getElementById("link").innerHTML = 'Watch this timer on <a target="_blank" href="watch/' + letstimebox.channelId + '">watch/' + letstimebox.channelId + '</a>. <br><img src="' + qrcode + '">';

        letstimebox.channel = letstimebox.pusher.subscribe(letstimebox.channelId);
        
        letstimebox.channel.bind('start-timer', letstimebox.timerStarted);
        
        window.location = "#" + letstimebox.channelId;
      },
      startNewTimer: function() {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://api.letstimebox.com/timer", true);

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-type", "application/json");

        xhr.send(JSON.stringify({
          "channel": letstimebox.channelId,
          "duration": "5"
        }));
      },
      timerStarted: function(data) {
        document.getElementById("timer").innerHTML = data.duration;
		startTimerDisplay(parseInt(data.duration));
      }
    };
    
  
  })();

  
</script>
