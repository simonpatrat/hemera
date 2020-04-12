import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import ArticlesList from "./pages/ArticlesList";
import Login from "./pages/Login";
import Page404 from "./pages/Page404";

class App extends Component {
  render() {
    const App = () => (
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/admin/auth/login" component={Login} />
          <Route path="/admin/articles" component={ArticlesList} />
          <Route path="/admin/images" component={ArticlesList} />
          <Route path="/admin/articles" component={ArticlesList} />
          <Route path="/admin/articles" component={ArticlesList} />
          <Route path="*" component={Page404} />
        </Switch>
      </div>
    );
    return (
      <Switch>
        <App />
      </Switch>
    );
  }
}

export default App;
