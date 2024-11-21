import { Button, Dropdown, Form, Input, MenuProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import { AxiosResponse } from "axios";
import React, { useMemo } from "react";
import { FaPen } from "react-icons/fa6";
import { useQueryClient } from "react-query";
import { useQueryData } from "../hooks/useQueryData";
import { axios } from "../ts/constants";
import { IImage, IJsonResponse, IProfile } from "../ts/types";
import { cleanObject } from "../ts/utils";
import Alert from "./custom/Alert";

interface Attributes {
  avatar: string;
}

interface Props {
  autoName?: string;
}

function EditForm({ autoName }: Props) {
  const client = useQueryClient();
  const profile = useQueryData<IProfile>(["me", "profile"]);
  const [info, setInfo] = React.useState<Attributes>({
    avatar: profile?.avatar?.url || "",
  });
  const avatarInputRef = React.useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [updated, setUpdated] = React.useState(false);

  const onAvatarChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInfo((prev) => ({ ...prev, avatar: e.target?.result as string }));
      };
      reader.readAsDataURL(e.target.files![0]);
    },
    []
  );

  const handleSubmit = async (values: any) => {
    setLoading(true);

    const {
      data,
    }: AxiosResponse<IJsonResponse<{ avatar: IImage } | undefined>> =
      await axios.put("/api/profile", cleanObject({ ...values, ...info }));
    if (data.status === 200) {
      setUpdated(true);
      client.setQueryData(["me", "profile"], (old: any) => ({
        ...old,
        ...values,
        avatar: data.body ? data.body.avatar : old?.avatar,
      }));
      setTimeout(() => {
        if (updated) setUpdated(false);
      }, 1000 * 20);
    }

    setLoading(false);
  };

  const items: MenuProps["items"] = useMemo(() => {
    const _ = [
      {
        key: "Upload",
        label: "Upload",
        onClick: () => {
          avatarInputRef.current!.click();
        },
      },
    ];

    if (info.avatar) {
      _.push({
        key: "remove",
        label: "Remove",
        onClick: () => {
          setInfo((prev) => ({ ...prev, avatar: "" }));
        },
      });
    }

    return _;
  }, [info]);

  return (
    <div className="relative">
      {updated && (
        <Alert
          message="Profile updated successfully!"
          styles="text-green-800 bg-green-100 mb-4"
          onClose={() => setUpdated(false)}
        />
      )}
      <input
        type="file"
        hidden
        ref={avatarInputRef}
        onChange={onAvatarChange}
      />
      <div className="border-2 relative mx-auto border-gray-300 w-28 h-28 rounded-full mt-5 p-1">
        <img
          src={info.avatar ? info.avatar : "/noImg.jpg"}
          alt="Avatar"
          className="w-full h-full rounded-full object-cover"
        />
        <Dropdown menu={{ items }}>
          <FaPen className="text-purple-800 absolute top-0 -right-1 cursor-pointer text-xs" />
        </Dropdown>
      </div>
      <Form
        labelCol={{ span: 8 }}
        labelAlign="left"
        onFinish={handleSubmit}
        className="mt-4"
        initialValues={{
          name: autoName || profile?.name,
          location: profile?.location,
          occupation: profile?.occupation,
          weblink: profile?.weblink,
          bio: profile?.bio,
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input autoFocus />
        </Form.Item>
        <Form.Item label="Location" name="location">
          <Input />
        </Form.Item>
        <Form.Item label="Occupation" name="occupation">
          <Input />
        </Form.Item>
        <Form.Item label="Website Link" name="weblink">
          <Input inputMode="url" />
        </Form.Item>
        <Form.Item label="Bio" name="bio">
          <TextArea rows={5} placeholder="Write something about yourself..." />
        </Form.Item>
        <Form.Item className="flex justify-center">
          <Button
            type="primary"
            className="text-xs ml-4"
            htmlType="submit"
            loading={loading}
          >
            {profile ? "update" : "save"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default EditForm;
