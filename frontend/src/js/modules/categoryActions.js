async function deleteCategory(categoryId, redirect) {
  const shouldDeletePost = confirm(
    "Are you sure you want to delete this post ?"
  );
  if (shouldDeletePost) {
    const formData = new FormData();
    formData.append("postId", categoryId);
    await fetch(`/admin/categories/delete`, {
      method: "POST",
      body: JSON.stringify({
        categoryId: categoryId,
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
  const { action, categoryId, redirect } = settings;
  console.log(action, categoryId);
  element.addEventListener("click", (event) => {
    event.preventDefault();
    switch (action) {
      case "delete":
        return deleteCategory(categoryId, redirect);

      default:
        return false;
    }
  });
}
