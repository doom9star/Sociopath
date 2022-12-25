import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/custom/Button";
import Logo from "../components/Logo";
import { useGlobalCtx } from "../context";
import { useTitle } from "../hooks/useTitle";

function Landing() {
  useTitle("Sociopath", false);
  const { userID } = useGlobalCtx();
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ height: "100vh" }}
    >
      <Logo styles="w-96" />
      {userID ? (
        <Link to="/home/feed">
          <Button
            label="Home"
            styles="text-purple-700 border border-purple-700 hover:opacity-80"
            icon={<i className="fas fa-home mr-2 text-purple-600" />}
          />
        </Link>
      ) : (
        <div className="flex">
          <Link to="/login" className="mr-4">
            <Button
              label="Login"
              styles="text-purple-700 border border-purple-700 hover:opacity-80"
            />
          </Link>
          <Link to="/register">
            <Button
              label="Register"
              styles="text-purple-700 border border-purple-700 hover:opacity-80"
            />
          </Link>
        </div>
      )}
    </div>
  );
}

export default Landing;
