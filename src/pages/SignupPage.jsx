import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Button, ButtonGroup, Input } from "@nextui-org/react";
import { useContext } from "react";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);

  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <div className="min-h-[calc(100vh-7rem)] flex justify-center items-center flex-col gap-3 mx-auto w-[40%]">
      <Input
        width="100%"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        width="100%"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        width="100%"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        width="100%"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <ButtonGroup className="w-full">
        <Button
          onClick={() => signup(name, username, email, password)}
          className="flex-1"
        >
          Sign up
        </Button>
        <Button
          color="primary"
          onClick={() => navigate("/log-in")}
          className="flex-1 text-black"
        >
          Sign in
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default SignupPage;
