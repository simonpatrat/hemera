import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import rootReducer from "./App/reducers";

export default function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware()],
    preloadedState,
    enhancers: [],
  });

  if (process.env.NODE_ENV !== "production" && module.hot) {
    module.hot.accept("./App/reducers", () =>
      store.replaceReducer(rootReducer)
    );
  }

  return store;
}
