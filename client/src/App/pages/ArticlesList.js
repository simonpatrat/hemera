import React, { Component } from "react";

class ArticlesList extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      list: [],
    };
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.getList();
  }

  // Retrieves the list of items from the Express app
  getList = () => {
    fetch("/admin/posts")
      .then((res) => res.json())
      .then(({ title, posts }) => this.setState({ title, posts }));
  };

  render() {
    const { title, posts } = this.state;

    return (
      <div className="App">
        <h1>{title && title}</h1>
        {/* Check to see if any items are found*/}
        {posts && posts.length ? (
          <ul className="posts-list detailed-list">
            {/* Render the list of items */}
            {posts.map((post) => {
              return (
                <li
                  className="posts-list__item detailed-list__item"
                  key={post._id}
                >
                  <div className="detailed-list__item__image">
                    {post.featuredImage && (
                      <img
                        src={post.featuredImage.url}
                        alt={post.title}
                        with="60"
                        height="60"
                      />
                    )}
                  </div>
                  <h3 className="detailed-list__item__title">{post.title}</h3>
                  <div className="detailed-list__item__info detailed-list__item__author">
                    by&nbsp;{post.author.name}
                  </div>
                  <div className="detailed-list__item__date-published">
                    Créé le : {post.dateCreated}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div>
            <h2>No articles Found</h2>
          </div>
        )}
      </div>
    );
  }
}

export default ArticlesList;
