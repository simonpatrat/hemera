import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { userLogin } from "../actions/user";

class Login extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps) {
    const { loggedIn: prevLoggedIn } = prevProps;
    const { loggedIn } = this.props;
    if (!prevLoggedIn && !!loggedIn) {
      this.setState({
        redirect: "/",
      });
    }
  }

  getData = () => {
    fetch("/admin/auth/login")
      .then((res) => res.json())
      .then((data) => this.setState({ data }));
  };

  // Retrieves the list of items from the Express app
  handleLoginSubmit = (event) => {
    event.preventDefault();
    const { userLogin } = this.props;
    const { target } = event;
    const { username, password } = target;
    const { value: usernameValue } = username;
    const { value: passwordValue } = password;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    /*     const formData = new FormData(target);
    formData.append("username", usernameValue);
    formData.append("password", passwordValue); */
    userLogin(usernameValue, passwordValue);
  };

  render() {
    const { data, redirect } = this.state;
    if (!data) return null;
    const { title } = data;

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    return (
      <div className="login-page-content form-page-content">
        <div className="login login--boxed form-wrapper form-wrapper--boxed">
          <div className="login__header form-wrapper__header">
            <h1>{title}</h1>
            <p>Please enter your credentials</p>{" "}
          </div>

          <form
            action=""
            id="login-form"
            className="form form--login"
            onSubmit={this.handleLoginSubmit}
          >
            <div className="form__part">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                className="form__input form__input--text"
              />
            </div>

            <div className="form__part"></div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form__input form__input--text"
            />
            <button type="submit" className="btn btn--submit">
              Login
            </button>
            <div className="form__part form__footer text-center">
              <p>
                Not registered ?{" "}
                <a href="/admin/auth/register">Create an account</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state /*, ownProps*/) => {
  return {
    loggedIn: state.user.loggedIn,
  };
};

const mapDispatchToProps = { userLogin };

export default connect(mapStateToProps, mapDispatchToProps)(Login);
