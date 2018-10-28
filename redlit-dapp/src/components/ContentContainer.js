import React, {Component} from 'react';
import Login from './Login';
import CreatingId from './CreatingId';
import ApproveConnection from './ApproveConnection';
import Greeting from './Greeting';
import Account from './Account';
import MainScreen from './MainScreen';
import PendingAuthorizations from './PendingAuthorizations';
import Backup from './Backup';
import Trusted from './Trusted';
import RecoverAccount from './RecoverAccount';
import EditProfile from './EditProfile';
import Relations from './Relations';
import Relation from './Relation';
import Swap from './Swap';
import PropTypes from 'prop-types';

class ContentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'Login',
      viewParameters: {}
    };
    this.loadIdentity();
  }

  async loadIdentity() {
    const {identityService} = this.props.services;
    identityService.loadIdentity();
  }

  componentDidMount() {
    const {emitter} = this.props.services;
    this.subscription = emitter.addListener('setView', this.setView.bind(this));
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  setView(view, viewParameters = {}) {
    this.setState({view, viewParameters});
    window.scrollTo(0, 0);
  }

  render() {
    const {services} = this.props;
    if (this.state.view === 'Login') {
      return <Login services={services} />;
    } else if (this.state.view === 'CreatingID') {
      return <CreatingId identityService={this.props.services.identityService}/>;
    } else if (this.state.view === 'Greeting') {
      return <Greeting
        identityService={services.identityService}
        greetingService={services.greetingService}
        viewParameters={this.state.viewParameters} />;
    } else if (this.state.view === 'MainScreen') {
      return <MainScreen services={services}/>;
    } else if (this.state.view === 'Account') {
      return (<Account services={services} identityService={services.identityService}/>);
    } else if (this.state.view === 'ApproveConnection') {
      return <ApproveConnection services={services}/>;
    } else if (this.state.view === 'PendingAuthorizations') {
      return <PendingAuthorizations services={services} setView={this.setView.bind(this)}/>;
    } else if (this.state.view === 'Backup') {
      return <Backup services={services} setView={this.setView.bind(this)}/>;
    } else if (this.state.view === 'Trusted') {
      return <Trusted setView={this.setView.bind(this)}/>;
    } else if (this.state.view === 'RecoverAccount') {
      return <RecoverAccount services={services} setView={this.setView.bind(this)}/>;
    } else if (this.state.view === 'EditProfile') {
      return <EditProfile services={services} setView={this.setView.bind(this)}/>;
    } else if (this.state.view === 'Profile') {
      return <Profile services={services} setView={this.setView.bind(this)}/>;
    } else if (this.state.view === 'Relations') {
      return <Relations services={services} setView={this.setView.bind(this)}/>;
    } else if (this.state.view === 'Relation') {
     return <Relation services={services} setView={this.setView.bind(this)}/>;
    } else if (this.state.view === 'Swap') {
      return <Swap services={services} setView={this.setView.bind(this)}/>;
    }
  }
}

ContentContainer.propTypes = {
  services: PropTypes.object
};

export default ContentContainer;
