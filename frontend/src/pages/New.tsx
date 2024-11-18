import { AxiosResponse } from "axios";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import Button from "../components/custom/Button";
import { axios } from "../ts/constants";
import { IJsonResponse, IPost } from "../ts/types";

function New() {
  const inputFileRef = React.useRef<HTMLInputElement | null>(null);
  const [body, setBody] = React.useState("");
  const [images, setImages] = React.useState<{
    [id: string]: { file: File; uri: string };
  }>({});
  const [uploading, setUploading] = React.useState(false);
  const client = useQueryClient();
  const navigate = useNavigate();

  const newResult = useMutation(
    "newPost",
    async () => {
      const reqData = {
        body,
        images: Object.values(images).map(({ uri }) => uri),
      };
      const { data }: AxiosResponse<IJsonResponse<IPost>> = await axios.post(
        "/api/post",
        reqData
      );
      return data;
    },
    {
      onSuccess: ({ body }) => {
        const privateData = client.getQueryData(["me", "private"]);
        const protectedData = client.getQueryData(["me", "protected"]);
        const profile = client.getQueryData(["me", "profile"]);

        if (privateData)
          client.setQueryData(["me", "private"], (old: any) => [
            { ...body, profile },
            ...old,
          ]);
        if (protectedData)
          client.setQueryData(["me", "protected"], (old: any) => [
            { ...body, profile },
            ...old,
          ]);
        navigate("/home/feed");
      },
    }
  );

  const handleSelect = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files as FileList;
      Array.from(files).forEach(async (file) => {
        const reader = new FileReader();
        try {
          await new Promise<void>((res, rej) => {
            reader.onloadstart = () => setUploading(true);
            reader.onload = (e) => {
              setImages((prev) => ({
                ...prev,
                [v4()]: { file, uri: e.target?.result as string },
              }));
              res();
            };
            reader.onloadend = () => setUploading(false);
            reader.readAsDataURL(file);
          });
        } catch (error) {
          console.error(error);
          return;
        }
      });
    },
    []
  );

  const removeImage = React.useCallback(
    (id: string) => {
      setImages(
        Object.fromEntries(Object.entries(images).filter(([_id]) => _id !== id))
      );
    },
    [images]
  );

  return (
    <div
      className="flex flex-col items-center justify-center w-full lg:w-1/2 mx-auto"
      style={{ height: "80vh" }}
    >
      <span className="text-gray-500 font-bold text-center">
        “Happiness quite unshared can scarcely be called happiness; it has no
        taste.”
      </span>
      <input
        type="file"
        hidden
        multiple
        ref={inputFileRef}
        onChange={handleSelect}
      />
      <textarea
        autoFocus
        placeholder="Write some body..."
        className="border border-gray-200 w-full h-1/4 p-4 focus:outline-none text-gray-600 mt-10"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      ></textarea>
      <div className="mt-5 self-start flex">
        <div className="w-40">
          <Button
            label="Upload"
            styles="border border-purple-600 text-purple-500 hover:opacity-70"
            icon={<i className="fas fa-image mr-2"></i>}
            loading={uploading}
            buttonProps={{ onClick: () => inputFileRef.current!.click() }}
            spinnerStyle="border-purple-500"
          />
        </div>
        <div className="ml-4 flex flex-wrap">
          {Object.entries(images).map(([id, { uri }]) => (
            <div className="w-24 relative mr-2 mb-2" key={id}>
              <div className="absolute bg-white rounded-full px-1 -right-1 -top-1 cursor-pointer">
                <i
                  className="fas fa-times text-purple-700 text-xs"
                  onClick={() => removeImage(id)}
                ></i>
              </div>
              <img
                src={uri}
                className="rounded-md h-20 object-cover"
                alt="preview"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="self-end mt-10">
        <Button
          label="Post"
          styles="bg-purple-700 text-gray-100"
          icon={<i className="fas fa-cloud mr-2"></i>}
          buttonProps={{ onClick: () => newResult.mutate() }}
          loading={newResult.isLoading}
        />
      </div>
    </div>
  );
}

export default New;
