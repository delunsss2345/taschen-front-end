import AuthLayout from "@/layouts/AuthLayout";
import DefaultLayout from "@/layouts/DefaultLayout";
import ProfileLayout from "@/layouts/ProfileLayout";
import BookDetail from "@/pages/BookDetail";
import ForgotPassword from "@/pages/ForgotPassword";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import ProfilePage from "@/pages/ProfilePage";
import Register from "@/pages/Register";
import ResetPassword from "@/pages/ResetPassword";
import type { RouteObject } from "react-router-dom";

export const config: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/verify/:id",
        element: <ResetPassword />,
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
  {
    element: <ProfileLayout />,
    path: "/profile",
    children: [
      {
        index: true,
        element: <ProfilePage />,
      },
    ],
  },
];
