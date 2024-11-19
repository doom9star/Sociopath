import { Button, Form, Input } from "antd";
import { AxiosResponse } from "axios";
import React from "react";
import { FiLogIn } from "react-icons/fi";
import { useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/custom/Alert";
import Logo from "../components/Logo";
import { useGlobalCtx } from "../context";
import { useTitle } from "../hooks/useTitle";
import { axios } from "../ts/constants";
import { IJsonResponse, IProfile } from "../ts/types";

interface LoginAttribs {
  email: string;
  password: string;
}

function Login() {
  useTitle("Login");

  const navigate = useNavigate();
  const client = useQueryClient();
  const { setUserID } = useGlobalCtx();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (values: LoginAttribs) => {
    setLoading(true);

    const { data } = await axios.post<
      LoginAttribs,
      AxiosResponse<IJsonResponse<IProfile>>
    >("/auth/login", values);
    if (data.status === 200) {
      client.setQueryData(["me", "profile"], () => data.body);
      setUserID(data.body.id);
      navigate("/home/feed");
      return;
    } else if (data.status === 401)
      setServerError("Wrong Password! Try again!");
    else if (data.status === 404) setServerError("Email doesn't exist!");

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
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="mt-8">
          <Form labelCol={{ span: 8 }} labelAlign="left" onFinish={handleLogin}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input autoFocus />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <div className="flex items-center justify-end mb-3">
              <div className="flex items-center justify-center text-xs">
                <span className="ml-2 text-gray-500">New here? &nbsp;</span>
                <Link to="/register">
                  <span className="text-purple-700 underline">register</span>
                </Link>
              </div>
            </div>
            <Form.Item className="flex justify-center">
              <Button
                type="primary"
                className="text-xs ml-4"
                icon={<FiLogIn size={10} />}
                htmlType="submit"
                loading={loading}
              >
                login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
