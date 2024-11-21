import { Button } from "antd";
import { CiHome } from "react-icons/ci";
import { Link } from "react-router-dom";
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
          <Button type="primary" icon={<CiHome />}>
            Home
          </Button>
        </Link>
      ) : (
        <div className="flex">
          <Link to="/login" className="mr-4">
            <Button>Login</Button>
          </Link>
          <Link to="/register">
            <Button type="primary">Register</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Landing;
