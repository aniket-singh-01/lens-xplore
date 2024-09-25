import React from "react";
import { useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { useContext } from "react";

const HomePage = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser != null) {
      navigate("/demo-page");
    }
  }, [currentUser]);

  return (
    <>
      <img
        src="/wave.svg"
        className="z-0 absolute w-[auto] h-full right-0 top-0 bottom-0"
      />
      <div className="z-[10] min-h-[calc(100vh-7rem)] flex justify-between items-start gap-5 w-full">
        <div className="z-[10] min-h-[calc(100vh-7rem)] flex flex-col justify-center gap-5 w-full md:w-1/2">
          <h1 className="z-[10] text-7xl">
            We're here to <br />
            Increase your <br />
            Productivity
          </h1>
          <p className="z-[10] text-[22px]">
            Picture an AI sleuth for invoices—swift, accurate, and tireless. It
            sifts through paperwork like a pro, freeing us from the paper trail!
            🚀 And hey, do you think AI will eventually handle all our
            paperwork, or do you believe there’ll always be a place for human
            oversight? 🤔
          </p>
          <div className="z-[10] flex gap-5">
            <Button
              color="primary"
              onClick={() => navigate("/sign-up")}
              className="z-[20] px-7 py-3 text-black"
            >
              Sign up now
            </Button>
            <Button
              color="default"
              className="z-[20] px-7 py-3"
              onClick={() => navigate("/demo-page")}
            >
              Try demo!
            </Button>
          </div>
        </div>
        <div className="z-[10] min-h-[calc(100vh-10rem)] justify-end items-center hidden md:flex">
          <img
            src="/eye.webp"
            alt="placeholder"
            className="z-[10] max-h-[calc(100vh-10rem)] rounded-3xl"
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;
