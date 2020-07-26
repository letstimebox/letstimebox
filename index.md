---
layout: default
---

<div class="content">
    <div class="pure-g">
        <div id="timeBox" class="pure-u-1"></div>
        <div class="pure-u-1">
            <div class="timer" id="remaining-time-indicator"></div>
        </div>
    </div>
</div>



<script type="text/babel">
    // Enable pusher logging - don't include this in production
    //Pusher.logToConsole = true;

    var timer; 
    ReactDOM.render(<TimeBox/>, document.querySelector('#timeBox'));
</script>
