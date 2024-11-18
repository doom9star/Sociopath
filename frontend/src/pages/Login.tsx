import { AxiosResponse } from "axios";
import React from "react";
import { useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/custom/Alert";
import Button from "../components/custom/Button";
import Input from "../components/custom/Input";
import Logo from "../components/Logo";
import { useGlobalCtx } from "../context";
import { useTitle } from "../hooks/useTitle";
import { axios } from "../ts/constants";
import { IJsonResponse, IProfile } from "../ts/types";
import { isEmail } from "../ts/utils";

interface LoginAttribs {
  email: string;
  password: string;
}

function Login() {
  useTitle("Login");

  const navigate = useNavigate();
  const client = useQueryClient();
  const { setUserID } = useGlobalCtx();
  const [attribs, setAttribs] = React.useState<LoginAttribs>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = React.useState<LoginAttribs>({} as LoginAttribs);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAttribs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const errors = {} as LoginAttribs;
    if (!isEmail(attribs.email)) errors.email = "Must be an actual email!";
    setErrors(errors);
    if (JSON.stringify(errors) === "{}") {
      const { data } = await axios.post<
        LoginAttribs,
        AxiosResponse<IJsonResponse<IProfile>>
      >("/auth/login", attribs);
      if (data.status === 200) {
        client.setQueryData(["me", "profile"], () => data.body);
        setUserID(data.body.id);
        navigate("/home/feed");
        return;
      } else if (data.status === 401)
        setServerError("Wrong Password! Try again!");
      else if (data.status === 404) setServerError("Email doesn't exist!");
    }
    setLoading(false);
  };

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: "100vw", height: "100vh" }}
    >
      <div className="flex flex-col w-full max-w-md px-4 py-8 bg-white border border-gray-200 sm:px-6 md:px-8 lg:px-10">
        {serverError && (
          <Alert
            message={serverError}
            styles="text-red-800 bg-red-100 mb-4"
            onClose={() => setServerError(null)}
          />
        )}
        <Logo />
        <div className="mt-8">
          <form autoComplete="off">
            <Input
              icon="fas fa-envelope"
              inputProps={{
                placeholder: "Email",
                autoFocus: true,
                name: "email",
                value: attribs.email,
                onChange,
              }}
              error={errors.email}
            />
            <Input
              icon="fas fa-lock"
              error={errors.password}
              inputProps={{
                placeholder: "Password",
                type: "password",
                name: "password",
                value: attribs.password,
                onChange,
              }}
            />
            <div className="flex items-center mb-6 pt-2">
              <div className="flex items-center justify-center text-xs">
                <span className="ml-2 text-gray-500">New here? &nbsp;</span>
                <Link
                  to="/register"
                  className="text-purple-800 font-bold underline cursor-pointer"
                >
                  Register
                </Link>
              </div>
              <div className="flex ml-auto items-center text-xs">
                <span className="text-gray-500">Forgot Your Password?</span>
                &nbsp;&nbsp;
                <span className="text-purple-800 font-bold underline cursor-pointer">
                  Reset
                </span>
              </div>
            </div>
            <div className="flex w-1/3 mx-auto">
              <Button
                label="Login"
                styles="bg-purple-700 text-gray-100 hover:bg-purple-700"
                loading={loading}
                buttonProps={{ onClick: handleLogin }}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
