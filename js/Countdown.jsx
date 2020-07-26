'use strict';

class Countdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      phase: "running"
    };
    
    this.toggleSharing = this.toggleSharing.bind(this);
  }
  
  toggleSharing() {
    this.setState(state => ({
      sharingEnabled: !state.sharingEnabled
    }));
  }

  getArcPath(seconds) {
    const margin = 10;
    const r = 140;

    const degree = seconds / 10; // 60 min is 360 degree
    const rad = degree * Math.PI / 180;

    const y = -Math.cos(rad) * r;
    const x = -Math.sin(rad) * r;

    const svgTargetX = (Math.round( (x + r + margin) * 10) / 10).toString();
    const svgTargetY = (Math.round( (y + r + margin) * 10) / 10).toString();
    const biggerThanHalf = degree % 360 > 180 ? "1" : "0";

    const dirtyFullTimeHack = degree === 360 ? ".0001" : "";
    const dirtyBiggerThanHalf = degree === 360 ? "1" : biggerThanHalf;

    const pathString = `M 150,10 A 140,140 1,${dirtyBiggerThanHalf},0 ${svgTargetX}${dirtyFullTimeHack},${svgTargetY}`;
    return pathString;
  }

  render() {
    const pink = "#ff2cb4";
    const turquoise = "#40E0D0";
    const grey = "#979797";
    
    let phase;
    if (this.props.seconds >= 60) {
        phase = "running";
    } else if (this.props.seconds > 0) {
        phase = "critical";
    } else if (this.props.seconds > -30) {
        phase = "alarm";
    } else {
        phase = "over";
    }
    
    let path = this.getArcPath(this.props.seconds);
    
    return (
      <div className="countdown">
        <svg className="countdownAnimation" width="400" height="400" viewBox="0 0 400 400">
          <g fill="none" transform="translate(50, 50)">
            <circle cx="150" cy="150" r="140" strokeWidth="20" stroke={phase === "alarm" ? pink : grey}/>
            <path d={path} strokeWidth="80" stroke={phase === "critical" ? pink : turquoise} display={phase === "alarm" ? "none" : "inherit"}/>
            <circle cx="150" cy="150" r="40" fill={phase === "alarm" ? pink : grey}/>
            { phase === "alarm" ?
              <circle cx="150" cy="150" r="20" className="alarm" fill={pink}/>
              : ""
            }
          </g>
        </svg>
      </div>
    );
  }
}

