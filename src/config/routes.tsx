import AuthLayout from "@/layouts/AuthLayout";
import DefaultLayout from "@/layouts/DefaultLayout";
import BookDetail from "@/pages/BookDetail";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import type { RouteObject } from "react-router-dom";

export const config: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/detail",
        element: <BookDetail />,
      },
    ],
  },
];
