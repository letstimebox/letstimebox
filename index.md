---
layout: default
---

<h1>Let's Timebox</h1>
<p>
  Watch this timer on <a href="/watch/my-channel">/watch/my-channel</a>. 
</p>
<script>

  // Enable pusher logging - don't include this in production
  Pusher.logToConsole = true;

  var pusher = new Pusher('ef8c49c842e4f97adbd5', {
    cluster: 'eu'
  });

  var channel = pusher.subscribe('my-channel');
  channel.bind('start-timer', function(data) {
    alert(JSON.stringify(data));
  });
  
  
</script>
