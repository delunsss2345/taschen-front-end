import { config } from "@/config/routes";
import { useRoutes } from "react-router-dom";

function AppRoutes() {
  return useRoutes(config);
}

export default AppRoutes;
