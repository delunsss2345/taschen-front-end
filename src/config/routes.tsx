import AuthLayout from "@/layouts/AuthLayout";
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
];
