import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Root from "./root";

//Import page
import Home from "../pages/home";

export default createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <div>Home Error</div>,
    children: [
      {
        path: "/",
        element: <Home />,
        handle: {
          title: "Home",
        },
      },
      {
        path: "/about",
        element: <div>About</div>,
        handle: {
          title: "About",
        },
      },
      {
        path: "/contact",
        element: <div>Contact</div>,
      },
    ],
  },
]);
