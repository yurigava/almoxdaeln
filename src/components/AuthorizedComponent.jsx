import React from 'react';
import axios from 'axios';

export default class AuthorizedComponent extends React.Component {

  constructor(props)
  {
    super(props);
    this.finishedReq = false;
  }

	componentWillMount() {

    this.finishedReq = false;
    // Check if user can access Route
    axios.get(this.props.route.url + this.props.route.path, {withCredentials:true})
    .then((response) => {
			if (response.data !== 'ok') {
        this.finishedReq = true;
        this.context.router.push('/');
			}
    })
    .catch((error) => {
        this.finishedReq = true;
        this.context.router.push('/');
    });
  }
}


AuthorizedComponent.propTypes = {
  url: React.PropTypes.string.isRequired
};

AuthorizedComponent.contextTypes = {
  router: React.PropTypes.func.isRequired
};
