'use strict';

class TimerControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = { manualDurationValue: 5 };
    
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleNewManualTimerClick = this.handleNewManualTimerClick.bind(this);
    this.handleResetTimer = this.handleResetTimer.bind(this);

    this.triggerPusherEvent = this.triggerPusherEvent.bind(this);
    
    this.startNewTimer1 = this.startNewTimer1.bind(this);
    this.startNewTimer5 = this.startNewTimer5.bind(this);
    this.startNewTimer15 = this.startNewTimer15.bind(this);
    this.startNewTimer45 = this.startNewTimer45.bind(this);
  }
  
  handleDurationChange(event) {
    this.setState({manualDurationValue: event.target.value})
  }
  
  handleNewManualTimerClick(event) {
    this.triggerPusherEvent({
      "event": "start-timer",
      "duration": this.state.manualDurationValue
    })
  }
  
  handleResetTimer(event) {
    this.triggerPusherEvent({
      "event": "reset-timer"
    })
    
  }
  
  triggerPusherEvent(config) {
    config.channel = this.props.channelId;
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.letstimebox.com/timer", true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/json");

    xhr.send(JSON.stringify(config));
  }

  startNewTimer1() {
    this.triggerPusherEvent({
      "event": "start-timer",
      "duration": 1
    })
  }

  startNewTimer5() {
    this.triggerPusherEvent({
      "event": "start-timer",
      "duration": 5
    })
  }

  startNewTimer15() {
    this.triggerPusherEvent({
      "event": "start-timer",
      "duration": 15
    })
  }

  startNewTimer45() {
    this.triggerPusherEvent({
      "event": "start-timer",
      "duration": 45
    })
  }

  render() {
    
    if (this.props.timerStatus == "new") {
      return (
        <div>
        	<div class="pure-u-1">
            <input type="button" class="pure-button" value="start 1 min" onClick={this.startNewTimer1}/>
          	<input type="button" class="pure-button" value="start 5 min" onClick={this.startNewTimer5}/>
          	<input type="button" class="pure-button" value="start 15 min" onClick={this.startNewTimer15}/>
          	<input type="button" class="pure-button" value="start 45 min" onClick={this.startNewTimer45}/>
          </div>
        	<div class="pure-u-1">
            <form class="pure-form">
              <fieldset>
                <input type="number" id="manual-duration" value={this.state.manualDurationValue} min="1" max="60" onChange={this.handleDurationChange}/>
                <input type="submit" class="pure-button pure-button-primary" value="start timer" onClick={this.handleNewManualTimerClick}/>
              </fieldset>
            </form>
          </div>
        </div>
      );
      
    } else {
      return (
        <div>
        	<div class="pure-u-1">
            <input type="button" class="pure-button pure-button-primary" value="Reset timer" onClick={this.handleResetTimer}/>
          </div>
        </div>
      );
    }
    
  }
}

