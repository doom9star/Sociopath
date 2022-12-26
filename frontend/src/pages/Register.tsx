import { AxiosResponse } from "axios";
import React from "react";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import Button from "../components/custom/Button";
import Input from "../components/custom/Input";
import EditForm from "../components/EditForm";
import Logo from "../components/Logo";
import { useTitle } from "../hooks/useTitle";
import { axios } from "../ts/constants";
import { IJsonResponse } from "../ts/types";
import { isEmail } from "../ts/utils";

interface Attributes {
  email: string;
  password: string;
  confirmPassword: string;
}

function Register() {
  useTitle("Register");

  const [info, setInfo] = React.useState<Attributes>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = React.useState<Attributes>({} as Attributes);

  const [loading, setLoading] = React.useState(false);
  const [slideNo, setSlideNo] = React.useState(1);
  const [autoName, setAutoName] = React.useState("");

  const client = useQueryClient();

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const handleRegister = React.useCallback(async () => {
    setLoading(true);
    const errors = {} as Attributes;
    const name = isEmail(info.email);

    if (!name) errors.email = "Must be an actual Email!";
    if (info.password.trim().length < 8)
      errors.password = "Password length must be >= 8!";
    else if (info.password !== info.confirmPassword)
      errors.confirmPassword = "Password doesn't match!";
    setErrors(errors);
    if (JSON.stringify(errors) === "{}") {
      const { data }: AxiosResponse<IJsonResponse<{ [k: string]: any }>> =
        await axios.post("/auth/register", {
          email: info.email,
          password: info.password,
        });
      if (data.status === 200) {
        setAutoName(data.body.name);
        client.setQueryData(["me", "profile"], (old: any) => ({
          ...old,
          createdAt: data.body.createdAt,
        }));
        setSlideNo(2);
      }
    }
    setLoading(false);
  }, [info, client]);

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: "100vw", height: "100vh" }}
    >
      {slideNo === 1 ? (
        <div className="flex flex-col w-full max-w-md px-4 py-8 bg-white border border-gray-200 sm:px-6 md:px-8 lg:px-10">
          <Logo />
          <div className="mt-8">
            <Input
              icon="fas fa-envelope"
              inputProps={{
                "data-id": "slide1",
                autoFocus: true,
                placeholder: "Email",
                name: "email",
                value: info.email,
                onChange,
              }}
              error={errors.email}
            />
            <Input
              icon="fas fa-lock"
              inputProps={{
                type: "password",
                placeholder: "Password",
                name: "password",
                value: info.password,
                onChange,
              }}
              error={errors.password}
            />
            <Input
              icon="fas fa-lock"
              inputProps={{
                type: "password",
                placeholder: "Confirm Password",
                name: "confirmPassword",
                value: info.confirmPassword,
                onChange,
              }}
              error={errors.confirmPassword}
            />

            <div className="flex items-center justify-end mt-2 text-xs">
              <span className="ml-2 text-gray-500">
                Already a sociopath? &nbsp;
              </span>
              <Link
                to="/login"
                className="text-purple-800 font-bold underline cursor-pointer"
              >
                Login
              </Link>
            </div>
            <div className="flex w-1/3 mx-auto pt-4">
              <Button
                label="Register"
                styles="bg-purple-700 text-gray-100 hover:bg-purple-700"
                loading={loading}
                buttonProps={{ onClick: handleRegister }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col px-4 w-full mx-auto sm:w-3/4 relative">
          <div className="w-full md:w-5/6 lg:w-1/2 mx-auto">
            <EditForm autoName={autoName} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
