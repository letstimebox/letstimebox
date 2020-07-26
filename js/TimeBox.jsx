'use strict';

class TimeBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      channelId: this.assignChannelId(),
      timerStatus: "new",
      remainingSeconds: 15 * 60
    };
    this.pusher = new Pusher('ef8c49c842e4f97adbd5', {
      cluster: 'eu'
    });
    this.connectToChannel();
  }
  
  assignChannelId() {
    if (location.hash && location.hash.length > 1)
      return location.hash.substring(1);
    else
      return this.makeid(8);
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
    this.setState(state => ({
      timerStatus: "running"
    }));
    
    if(this.props.role == "Timekeeper") {
      this.setState({
        remainingSeconds: parseInt(data.duration) * 5 // 60
      })
      this.interval = setInterval(this.tick.bind(this), 1000);
    }
  }
  
  tick() {
    if (this.state.remainingSeconds > -10) {
      this.setState({
        remainingSeconds: this.state.remainingSeconds - 1
      })
    } else {
      clearInterval(this.interval);
      this.setState(state => ({
        timerStatus: "new",
        remainingSeconds: 15 * 60
      }));
    }
  }
  
  timerResetted(data) {
    if (this.state.timerStatus == "running") {
      clearInterval(this.interval);
      this.timer.reset();
    }
    this.setState(state => ({
      timerStatus: "new",
      remainingSeconds: 15 * 60
    }));
  }
  
  render() {
    return (
      <div className="pure-g">
        <div className="pure-u-1">
          { (this.props.role === "Timekeeper") ?
            <div>
              <QrLink 
                channelId={this.state.channelId}/>
              <TimerControls 
                channelId={this.state.channelId}
                timerStatus={this.state.timerStatus}/>
            </div>
            : ""
          }
          <Countdown
            seconds={this.state.remainingSeconds}/>
        </div>
      </div>
    );
  }
}

