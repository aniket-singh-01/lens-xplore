import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const RouteGuard = ({ children }) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  if (currentUser == null) {
    navigate("/");
  } else {
    return children;
  }
};

export default RouteGuard;
