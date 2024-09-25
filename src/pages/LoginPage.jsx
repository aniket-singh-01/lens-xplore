import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Button, ButtonGroup, Input } from "@nextui-org/react";
import { useContext } from "react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { login } = useContext(AuthContext);

  return (
    <div className="min-h-[calc(100vh-7rem)] flex justify-center items-center flex-col gap-3 mx-auto w-[40%]">
      <Input
        width="100%"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        width="100%"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <ButtonGroup className="flex w-full justify-center items-stretch">
        <Button
          className="flex-1 w-full"
          onClick={() => {
            login(email, password);
            navigate("/");
          }}
        >
          Sign in
        </Button>
        <Button
          color="primary"
          className="flex-1 w-full text-black"
          onClick={() => {
            navigate("/sign-up");
          }}
        >
          Sign up
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default LoginPage;
