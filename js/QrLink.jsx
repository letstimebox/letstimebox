'use strict';

class QrLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sharingEnabled: false };
    
    this.toggleSharing = this.toggleSharing.bind(this);
  }
  
  toggleSharing() {
    this.setState(state => ({
      sharingEnabled: !state.sharingEnabled
    }));
  }

  render() {
    const qrserver = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&format=svg&data=';
	  const watchURIBase = this.props.watchUrl && window.location.hostname != "localhost" ?
      this.props.watchUrl :
      window.location.origin + "/watch#";
    const watchURI = watchURIBase + this.props.channelId;
    const qrcode = qrserver + encodeURIComponent(watchURI);

    let sharingLinks = "";
    if (this.state.sharingEnabled) {
      sharingLinks = <p>
        Watch this timer on <a target="_blank" href={watchURI}>{watchURI}</a>.
        <br/><br/>
        <img src={qrcode} />
      </p>;
    }

    return (
      <div>
        <label htmlFor="enable-sharing" className="pure-checkbox">
        <input type="checkbox" id="enable-sharing" onChange={this.toggleSharing} checked={this.state.sharingEnabled}/> Enable Sharing</label>
        {sharingLinks}
      </div>
    );
  }
}

