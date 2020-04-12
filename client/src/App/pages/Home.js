import React, { Component } from "react";
import { Link } from "react-router-dom";

class Home extends Component {
  render() {
    return (
      <div className="App">
        <h1>Project Home</h1>
        <Link to={"./admin/articles"}>
          <button variant="raised">Articles</button>
        </Link>
        <Link to={"./admin/auth/login"}>
          <button variant="raised">Login</button>
        </Link>
      </div>
    );
  }
}
export default Home;
