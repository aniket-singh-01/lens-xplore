import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Button, ButtonGroup } from "@nextui-org/react";
import { useContext } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <nav className="h-28 flex justify-between items-center">
      <h1
        onClick={() => navigate("/")}
        className="text-4xl cursor-pointer"
      >
        haKDit
      </h1>

      <div className="flex gap-5">
        {currentUser == null ? (
          <ButtonGroup>
            <Button
              onClick={() => {
                navigate("/log-in");
              }}
              className="z-[10] px-5 py-2"
            >
              Login
            </Button>
            <Button
              className="z-[10] text-black"
              color="primary"
              onClick={() => {
                navigate("/sign-up");
              }}
            >
              Sign up
            </Button>
          </ButtonGroup>
        ) : (
          <ButtonGroup>
            <Button
              className="z-[10]"
              type="success"
              onClick={logout}
            >
              Logout
            </Button>
            <Button
              type="success"
              onClick={() => navigate("/profile")}
            >
              Profile
            </Button>
          </ButtonGroup>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
