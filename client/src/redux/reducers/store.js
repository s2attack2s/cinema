import { configureStore } from "@reduxjs/toolkit";
import ajaxCallMiddleware from "../../libs/ajax-middleware";
import app from "./app";

export default configureStore({
  reducer: {
    app,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // bỏ qua các thuộc tính này trong của action khi tuần tự hóa
        ignoredActionPaths: ["onStart", "onSuccess", "onError", "abortController", "body"],
      },
    }).concat([ajaxCallMiddleware]),
});
