// Initialize Userfront Core JS

import { Button } from '@mui/material'
import { useContext } from 'react';
import { UserContext } from '../contexts/user.context';

// Define the logout button component
class LogoutButton extends Component {
  constructor(props) {
    const { logOutUser } = useContext(UserContext);
    const { fetchUser } = useContext(UserContext);

    const isUserLoggedIn = fetchUser();

    super(props);
    this.state = {
      disabled: !isUserLoggedIn,
    };

    this.handleClick = this.handleClick.bind(this);
  }
  

  handleClick(event) {
    event.preventDefault();
    Userfront.logout();
  }

  render() {
    return (
      <button
        id="logout-button"
        onClick={this.handleClick}
        disabled={this.state.disabled}
      >
        Log out
      </button>
    );
  }
}