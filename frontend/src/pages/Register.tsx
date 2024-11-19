import { Button, Form, Input } from "antd";
import { AxiosResponse } from "axios";
import React from "react";
import { FaUserPlus } from "react-icons/fa6";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import EditForm from "../components/EditForm";
import Logo from "../components/Logo";
import { useTitle } from "../hooks/useTitle";
import { axios } from "../ts/constants";
import { IJsonResponse } from "../ts/types";

interface Attributes {
  email: string;
  password: string;
  confirmPassword: string;
}

function Register() {
  useTitle("Register");

  const [loading, setLoading] = React.useState(false);
  const [slideNo, setSlideNo] = React.useState(1);
  const [autoName, setAutoName] = React.useState("");

  const client = useQueryClient();

  const handleRegister = async (values: Attributes) => {
    setLoading(true);

    const { data }: AxiosResponse<IJsonResponse<{ [k: string]: any }>> =
      await axios.post("/auth/register", {
        email: values.email,
        password: values.password,
      });

    if (data.status === 200) {
      setAutoName(data.body.name);
      client.setQueryData(["me", "profile"], (old: any) => ({
        ...old,
        createdAt: data.body.createdAt,
      }));
      setSlideNo(2);
    }

    setLoading(false);
  };

  return (
    <div
      className="flex items-center justify-center"
      style={{ width: "100vw", height: "100vh" }}
    >
      {slideNo === 1 ? (
        <div className="flex flex-col w-full max-w-md px-4 py-8 bg-white border border-gray-200 sm:px-6 md:px-8 lg:px-10">
          <div className="flex justify-center">
            <Logo />
          </div>
          <div className="mt-8">
            <Form
              labelCol={{ span: 8 }}
              labelAlign="left"
              onFinish={handleRegister}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
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
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: "Please input your password again!",
                  },
                  ({ getFieldValue }) => ({
                    validator: (_, value) => {
                      if (!value || getFieldValue("password") === value)
                        return Promise.resolve();
                      return Promise.reject(new Error("Passwords must match!"));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <div className="flex items-center justify-end mb-3">
                <div className="flex items-center justify-center text-xs">
                  <span className="ml-2 text-gray-500">
                    Already a user? &nbsp;
                  </span>
                  <Link to="/login">
                    <span className="text-purple-700 underline">login</span>
                  </Link>
                </div>
              </div>
              <Form.Item className="flex justify-center">
                <Button
                  type="primary"
                  className="text-xs ml-4"
                  icon={<FaUserPlus size={10} />}
                  htmlType="submit"
                  loading={loading}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
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
