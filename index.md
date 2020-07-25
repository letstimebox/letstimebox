---
layout: default
---

<div class="centered">
	<p id="link">
	</p>

	<input type="button" value="start 1 min timer" onclick="letstimebox.startNewTimer(1)"/>
	<input type="button" value="start 5 min timer" onclick="letstimebox.startNewTimer(5)"/>
	<input type="button" value="start 15 min timer" onclick="letstimebox.startNewTimer(15)"/>
	<input type="button" value="start 45 min timer" onclick="letstimebox.startNewTimer(45)"/>
	<br>
	<input type="number" id="manual-duration" min="1" max="60">
	<input type="button" value="start timer" onclick="letstimebox.startNewTimer(parseInt(document.getElementById('manual-duration').value));"/>

	<div class="timer" id="remaining-time-indicator"></div>
</div>
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

	var timer; 
    window.letstimebox = {
      pusher: new Pusher('ef8c49c842e4f97adbd5', {
        cluster: 'eu'
      }),
      createChannel: function() {
        letstimebox.channelId = makeid(8);
        const qrcode = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&format=svg&data=' + encodeURI('https://letstimebox.com/watch/' + letstimebox.channelId);
        document.getElementById("link").innerHTML = 'Watch this timer on <a target="_blank" href="watch/' + letstimebox.channelId + '">watch/' + letstimebox.channelId + '</a>. <br><br><img src="' + qrcode + '"> <br><br><a href="' + qrcode + '">Download QR Code</a>';

        letstimebox.channel = letstimebox.pusher.subscribe(letstimebox.channelId);
        letstimebox.channel.bind('start-timer', letstimebox.timerStarted);

        window.location = "#" + letstimebox.channelId;
      },
      startNewTimer: function(duration) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://api.letstimebox.com/timer", true);

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-type", "application/json");

        xhr.send(JSON.stringify({
          "channel": letstimebox.channelId,
          "duration": duration
        }));
      },
      timerStarted: function(data) {
		if (timer && timer.stop) {
			timer.stop();
		}
		timer = startTimer(document.getElementById("remaining-time-indicator"), parseInt(data.duration));
      }
    };
  })();

  window.onload = function(e) {letstimebox.createChannel();};
</script>
