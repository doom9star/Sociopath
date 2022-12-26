import { AxiosResponse } from "axios";
import React from "react";
import { useQueryClient } from "react-query";
import { useQueryData } from "../hooks/useQueryData";
import { axios } from "../ts/constants";
import { IImage, IJsonResponse, IProfile } from "../ts/types";
import { cleanObject } from "../ts/utils";
import Alert from "./custom/Alert";
import Button from "./custom/Button";
import Input from "./custom/Input";

interface Attributes {
  name: string;
  location: string;
  occupation: string;
  weblink: string;
  bio: string;
  avatar: string;
}

interface Props {
  autoName?: string;
}

function EditForm({ autoName }: Props) {
  const client = useQueryClient();
  const profile = useQueryData<IProfile>(["me", "profile"]);
  const [info, setInfo] = React.useState<Attributes>({
    name: profile?.name || autoName || "",
    location: profile?.location || "",
    occupation: profile?.occupation || "",
    weblink: profile?.weblink || "",
    bio: profile?.bio || "",
    avatar: profile?.avatar?.url || "",
  });
  const avatarInputRef = React.useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Attributes>({} as Attributes);
  const [updated, setUpdated] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);

  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

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

  const handleSubmit = async () => {
    setLoading(true);
    const errors = {} as Attributes;
    if (info.name.trim().length === 0) errors.name = "Must not be empty!";
    setErrors(errors);
    if (JSON.stringify(errors) === "{}") {
      const {
        data,
      }: AxiosResponse<IJsonResponse<{ avatar: IImage } | undefined>> =
        await axios.put("/api/profile", cleanObject(info));
      if (data.status === 200) {
        setUpdated(true);
        client.setQueryData(["me", "profile"], (old: any) => ({
          ...old,
          ...info,
          avatar: data.body ? data.body.avatar : old?.avatar,
        }));
        setTimeout(() => {
          if (updated) setUpdated(false);
        }, 1000 * 20);
      }
    }
    setLoading(false);
  };

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
        <i
          className="fas fa-pen text-purple-800 absolute top-0 -right-1 cursor-pointer text-xs"
          onClick={() => setShowDropdown(!showDropdown)}
        ></i>
      </div>
      {showDropdown && (
        <div className="border border-gray-300 w-28 text-xs text-gray-600 absolute left-80 top-5 z-40">
          <div
            className="p-4 flex items-center hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setShowDropdown(false);
              avatarInputRef.current!.click();
            }}
          >
            <i className="far fa-image mr-3"></i>
            <span className="text-gray-500">Upload</span>
          </div>
          {info.avatar && (
            <div
              className="p-4 flex items-center hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setShowDropdown(false);
                setInfo((prev) => ({ ...prev, avatar: "" }));
              }}
            >
              <i className="fas fa-trash-alt mr-3"></i>
              <span className="text-gray-500">Remove</span>
            </div>
          )}
        </div>
      )}
      <div className="mt-4">
        <Input
          icon="fas fa-user"
          inputProps={{
            placeholder: "Name",
            name: "name",
            autoFocus: true,
            value: info.name,
            onChange,
          }}
          error={errors.name}
        />
        <Input
          icon="fas fa-map-marker-alt"
          inputProps={{
            placeholder: "Location",
            name: "location",
            value: info.location,
            onChange,
          }}
          error={errors.location}
        />
        <Input
          icon="fas fa-building"
          inputProps={{
            placeholder: "Occupation",
            name: "occupation",
            value: info.occupation,
            onChange,
          }}
          error={errors.occupation}
        />
        <Input
          icon="fas fa-link"
          inputProps={{
            placeholder: "Website link",
            name: "weblink",
            value: info.weblink,
            onChange,
          }}
          error={errors.weblink}
        />
      </div>
      <textarea
        className="w-full text-gray-700 border border-gray-300 p-4 h-40 focus:outline-none"
        placeholder="Write something about yourself..."
        value={info.bio}
        name="bio"
        onChange={onChange}
        spellCheck={false}
      ></textarea>
      <div className="w-1/3 ml-auto mt-4">
        <Button
          icon={<i className="fas fa-save mr-2"></i>}
          label={profile ? "Update" : "Save"}
          styles="border border-purple-600 text-purple-600"
          buttonProps={{ onClick: handleSubmit }}
          loading={loading}
          spinnerStyle="border-purple-700"
        />
      </div>
    </div>
  );
}

export default EditForm;
