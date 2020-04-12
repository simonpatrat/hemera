const initialState = {
  loggedIn: false,
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case "USER_LOGIN":
      return {
        ...state,
        loggedIn: true,
      };
    default:
      return state;
  }
}
