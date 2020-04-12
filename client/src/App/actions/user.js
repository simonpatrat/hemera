const USER_LOGIN = "USER_LOGIN";

export function userLoginAction(redirect) {
  return {
    type: USER_LOGIN,
    data: {
      redirect,
    },
  };
}

export function userLogin(username, password) {
  return (dispatch) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    fetch("/admin/auth/login", {
      method: "post",
      body: JSON.stringify({
        username,
        password,
      }),
      headers,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const { redirect } = data;

        dispatch(userLoginAction(redirect));
      });
  };
}
