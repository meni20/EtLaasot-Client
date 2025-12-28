import { Route, Routes } from "react-router-dom";
import { ALL_ROUTES } from "../constants/route.constants";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {ALL_ROUTES.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Routes>
  );
};

export default AppRouter;
