'use strict';

class TimeBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      channelId: this.makeid(8),
      timerStatus: "new"
    };
    this.pusher = new Pusher('ef8c49c842e4f97adbd5', {
      cluster: 'eu'
    });
    this.connectToChannel();
  }
  
  makeid(length) {
     var result           = '';
     var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
     var charactersLength = characters.length;
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
  }
  
  connectToChannel() {
    this.channel = this.pusher.subscribe(this.state.channelId);
    this.channel.bind('start-timer', this.timerStarted.bind(this));
    this.channel.bind('reset-timer', this.timerResetted.bind(this));

    window.location = "#" + this.state.channelId;
  }
  
  timerStarted(data) {
    if (this.state.timerStatus == "running") {
      this.timer.stop();
    }
    this.timer = startTimer(document.getElementById("remaining-time-indicator"), parseInt(data.duration));
    this.setState(state => ({
      timerStatus: "running"
    }));
  }
  
  timerResetted(data) {
    if (this.state.timerStatus == "running") {
      this.timer.reset();
    }
    this.setState(state => ({
      timerStatus: "new"
    }));
  }
  
  render() {
    return (
      <div>
        <QrLink 
          channelId={this.state.channelId}/>
        <TimerControls 
          channelId={this.state.channelId}
          timerStatus={this.state.timerStatus}/>
      </div>
    );
  }
}

