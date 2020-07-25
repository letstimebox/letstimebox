---
layout: default
---

<input type="button" value="create channel" onclick="letstimebox.createChannel()"/>
 
<input type="button" value="start 5min timer" onclick="letstimebox.startNewTimer(5)"/>


<p id="link">
</p>

<p id="timer"></p>

<svg width="400px" height="400px" xmlns="http://www.w3.org/2000/svg" id="remaining-time-indicator"></svg>
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

    window.letstimebox = {
      pusher: new Pusher('ef8c49c842e4f97adbd5', {
        cluster: 'eu'
      }),
      createChannel: function() {
        letstimebox.channelId = makeid(8);
        const qrcode = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&format=svg&data=' + encodeURI('https://letstimebox.com/watch/' + letstimebox.channelId);
        document.getElementById("link").innerHTML = 'Watch this timer on <a target="_blank" href="watch/' + letstimebox.channelId + '">watch/' + letstimebox.channelId + '</a>. <br><img src="' + qrcode + '"> <br><a href="' + qrcode + '">Download QR Code</a>';

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
		startTimer(parseInt(data.duration));
      }
    };
    
  
  })();

  
</script>
