import produce from "immer";
import React from "react";
import { useQuery, useQueryClient } from "react-query";
import { Link, RouteComponentProps } from "react-router-dom";
import BackButton from "../components/BackButton";
import Button from "../components/custom/Button";
import Input from "../components/custom/Input";
import Spinner from "../components/custom/Spinner";
import { useGlobalCtx } from "../context";
import { useFollow } from "../hooks/useFollow";
import { axios } from "../ts/constants";
import { IFollow, IJsonResponse } from "../ts/types";

type Props = RouteComponentProps<
  { 0: "followers" | "following"; pid: string },
  {}
>;

function Follow({
  match: {
    params: { "0": type, pid = "me" },
  },
}: Props) {
  const client = useQueryClient();
  const { userID } = useGlobalCtx();
  const [query, setQuery] = React.useState("");
  const [localData, setLocalData] = React.useState<IFollow[] | undefined>();

  const { data, isLoading, isFetching } = useQuery(
    [pid, type],
    async () => {
      const { data } = await axios.get<IJsonResponse<IFollow[]>>(
        `/api/profile/follow/${type}/${pid}`
      );
      return data.body;
    },
    { refetchOnMount: "always" }
  );
  const folResult = useFollow((data) => {
    client.setQueryData<IFollow[]>([pid, type], (old) =>
      produce(old!, (draft) => {
        const idx = draft.findIndex(
          (f) => f.profile.id === data.pid || f.following.id === data.pid
        );
        draft[idx].isFollowing = data.value === 1 ? true : false;
      })
    );
  });

  React.useEffect(() => {
    setLocalData(data);
  }, [data]);

  React.useEffect(() => {
    if (query) {
      const filteredData = data?.filter(
        (f) =>
          f.profile.name.includes(query) || f.following.name.includes(query)
      );
      setLocalData(filteredData);
    } else setLocalData(data);
  }, [query, data]);

  if (isLoading || isFetching) return <Spinner />;

  return (
    <React.Fragment>
      <BackButton />
      <div className="w-full mx-auto md:w-1/2">
        <Input
          icon="fas fa-search"
          inputProps={{
            type: "text",
            name: "query",
            value: query,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value),
            autoFocus: true,
          }}
        />
        {localData?.map((f) => {
          const user = f.profile ? f.profile : f.following;
          return (
            <div className="flex items-center" key={user.id}>
              <Link
                to={
                  user.id === userID ? "/home/profile" : `/home/user/${user.id}`
                }
                className="w-3/4 flex items-center p-2 cursor-pointer hover:underline"
              >
                <div className="border border-gray-200 rounded-full p-1">
                  <img
                    src={user.avatar ? user.avatar.url : "/noImg.jpg"}
                    alt="profileImg"
                    className="md:w-12 w-8 h-8 md:h-12 rounded-full"
                  />
                </div>
                <span className="text-gray-500 font-bold ml-6">
                  @{user.name}
                </span>
              </Link>
              {user.id !== userID && (
                <div>
                  {f.isFollowing || f.isFollowing === undefined ? (
                    <Button
                      label="Unfollow"
                      styles="border border-purple-700 text-purple-700 hover:opacity-70"
                      buttonProps={{
                        onClick: () =>
                          folResult.mutate({ pid: user.id, value: -1 }),
                      }}
                      loading={folResult.isLoading}
                      spinnerStyle="border-purple-700"
                    />
                  ) : (
                    <Button
                      label="Follow"
                      styles="bg-purple-700 text-gray-100 hover:bg-purple-700 hover:opacity-70"
                      buttonProps={{
                        onClick: () =>
                          folResult.mutate({ pid: user.id, value: 1 }),
                      }}
                      loading={folResult.isLoading}
                      spinnerStyle="border-purple-700"
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
}

export default Follow;
