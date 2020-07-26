---
layout: default
---

<div class="content">
  <div class="pure-g">
  	<div id="qrlink" class="pure-u-1">
    </div>

  	<div class="pure-u-1">
    	<input type="button" class="pure-button" value="start 1 min" onclick="letstimebox.startNewTimer(1)"/>
    	<input type="button" class="pure-button" value="start 5 min" onclick="letstimebox.startNewTimer(5)"/>
    	<input type="button" class="pure-button" value="start 15 min" onclick="letstimebox.startNewTimer(15)"/>
    	<input type="button" class="pure-button" value="start 45 min" onclick="letstimebox.startNewTimer(45)"/>
    </div>

  	<div class="pure-u-1">
      <form class="pure-form">
        <fieldset>
          <input type="number" id="manual-duration" value="5" min="1" max="60">
          <input type="submit" class="pure-button pure-button-primary" value="start timer" onclick="letstimebox.startNewTimer(parseInt(document.getElementById('manual-duration').value));"/>
        </fieldset>
      </form>
    </div>

  	<div class="pure-u-1">
      <div class="timer" id="remaining-time-indicator"></div>
    </div>

</div>



<script type="text/babel">

  // Enable pusher logging - don't include this in production
  //Pusher.logToConsole = true;

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
        
        ReactDOM.render(<QrLink channelId={letstimebox.channelId}/>, document.querySelector('#qrlink'));

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

  letstimebox.createChannel();
</script>
