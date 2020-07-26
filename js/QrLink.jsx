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
		const watchURI = window.location.origin + "/watch/" + this.props.channelId;
	 	const qrcode = qrserver + encodeURI(watchURI);
    
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
        <label for="enable-sharing" class="pure-checkbox">
        <input type="checkbox" id="enable-sharing" onClick={this.toggleSharing} checked={this.state.sharingEnabled}/> Enable Sharing</label>
        {sharingLinks}
      </div>
    );
  }
}

