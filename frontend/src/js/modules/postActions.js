async function deletePost(postId, redirect) {
  const shouldDeletePost = confirm(
    "Are you sure you want to delete this post ?"
  );
  if (shouldDeletePost) {
    const formData = new FormData();
    formData.append("postId", postId);
    await fetch(`/admin/articles/delete`, {
      method: "POST",
      body: JSON.stringify({
        postId: postId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!!redirect) {
      window.location.href = redirect;
    } else {
      window.location.reload();
    }
  } else {
    return;
  }
}

export default function postActions(element, options) {
  const settings = JSON.parse(options);
  const { action, postId, redirect } = settings;
  console.log(action, postId);
  element.addEventListener("click", (event) => {
    event.preventDefault();
    switch (action) {
      case "delete":
        return deletePost(postId, redirect);

      default:
        return false;
    }
  });
}
