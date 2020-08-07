'use strict';

class TimeBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      channelId: this.assignChannelId(),
      timerStatus: "new",
      remainingSeconds: 15 * 60
    };

    if (this.state.channelId) {
      try {
        this.pusher = new Pusher('ef8c49c842e4f97adbd5', {
          cluster: 'eu'
        });
        this.connectToChannel();

        if (this.props.role == "Timekeeper") {
          this.controlsRef = React.createRef();
        }
      } catch (e) {
        this.state.timerStatus = "no connection"
      }
    } else {
      this.state.timerStatus = "no connection"
    }

  }

  assignChannelId() {
    if (location.hash && location.hash.length > 1)
      return location.hash.substring(1);
    else if (this.props.role == "Timekeeper")
      return this.makeid(8);
    else
      return false;
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
    this.channel.bind('tick', this.tock.bind(this));
    this.channel.bind('reset-timer', this.timerResetted.bind(this));

    window.location = "#" + this.state.channelId;
  }

  timerStarted(data) {
    this.setState(state => ({
      timerStatus: "running",
      remainingSeconds: parseInt(data.duration) * 60
    }));

    if (this.props.role == "Timekeeper") {
      this.interval = setInterval(this.tick.bind(this), 1000);
    }
  }

  tick() {
    if (this.state.remainingSeconds > -10) {
      this.triggerPusherEvent({
        "event": "tick",
        "seconds": this.state.remainingSeconds - 1
      });
    } else {
      clearInterval(this.interval);
      this.triggerPusherEvent({
        "event": "reset-timer"
      })
    }
  }

  tock(data) {
    if (this.state.timerStatus == "running") {
      this.setState({
        remainingSeconds: parseInt(data.seconds)
      })
      if (parseInt(data.seconds) == 0) {
        document.querySelector("audio").play();
      }
    } else {
      this.setState({
        timerStatus: "running",
        remainingSeconds: parseInt(data.seconds)
      });
    }
  }

  timerResetted(data) {
    if (this.props.role == "Timekeeper" && this.state.timerStatus == "running") {
      clearInterval(this.interval);
    }

    this.setState(state => ({
      timerStatus: "new",
      remainingSeconds: 15 * 60
    }));
  }

  triggerPusherEvent(config) {
    config.channel = this.state.channelId;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.letstimebox.com/timer", true);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/json");

    xhr.send(JSON.stringify(config));
  }

  render() {
    if ( this.state.timerStatus == "no connection") {
      return (
        <h1>We could not connect to a Timebox</h1>
      )
    } else {
      return (
        <div className="pure-g">
          <div className="pure-u-1">
            { (this.props.role === "Timekeeper") ?
              <div>
                <QrLink 
                  channelId={this.state.channelId}/>
                <TimerControls triggerPusherEvent={this.triggerPusherEvent.bind(this)}
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
}

