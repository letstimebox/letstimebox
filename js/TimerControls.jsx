'use strict';

class TimerControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = { manualDurationValue: 15 };
    
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleNewManualTimerClick = this.handleNewManualTimerClick.bind(this);
    this.handleResetTimer = this.handleResetTimer.bind(this);

    this.startNewTimer1 = this.startNewTimer1.bind(this);
    this.startNewTimer5 = this.startNewTimer5.bind(this);
    this.startNewTimer15 = this.startNewTimer15.bind(this);
    this.startNewTimer45 = this.startNewTimer45.bind(this);
  }
  
  handleDurationChange(event) {
    this.setState({manualDurationValue: parseInt(event.target.value) })
  }
  
  handleNewManualTimerClick(event) {
    this.props.triggerPusherEvent({
      "event": "start-timer",
      "duration": this.state.manualDurationValue
    })

    event.preventDefault();
  }
  
  handleResetTimer(event) {
    this.props.triggerPusherEvent({
      "event": "reset-timer"
    })
    
  }
  
  startNewTimer1() {
    this.props.triggerPusherEvent({
      "event": "start-timer",
      "duration": 1
    })
  }

  startNewTimer5() {
    this.props.triggerPusherEvent({
      "event": "start-timer",
      "duration": 5
    })
  }

  startNewTimer15() {
    this.props.triggerPusherEvent({
      "event": "start-timer",
      "duration": 15
    })
  }

  startNewTimer45() {
    this.props.triggerPusherEvent({
      "event": "start-timer",
      "duration": 45
    })
  }

  render() {
    
    if (this.props.timerStatus == "new") {
      return (
        <div>
        	<div className="pure-u-1">
            <input type="button" className="pure-button" value="start 1 min" onClick={this.startNewTimer1}/>
          	<input type="button" className="pure-button" value="start 5 min" onClick={this.startNewTimer5}/>
          	<input type="button" className="pure-button" value="start 15 min" onClick={this.startNewTimer15}/>
          	<input type="button" className="pure-button" value="start 45 min" onClick={this.startNewTimer45}/>
          </div>
        	<div className="pure-u-1">
            <form className="pure-form">
              <fieldset>
                <input type="number" id="manual-duration" value={this.state.manualDurationValue} min="1" max="60" onChange={this.handleDurationChange}/>
                <input type="submit" className="pure-button pure-button-primary" value="start timer" onClick={this.handleNewManualTimerClick}/>
              </fieldset>
            </form>
          </div>
        </div>
      );
      
    } else {
      return (
        <div>
        	<div className="pure-u-1">
            <input type="button" className="pure-button pure-button-primary" value="Reset timer" onClick={this.handleResetTimer}/>
          </div>
        </div>
      );
    }
    
  }
}

