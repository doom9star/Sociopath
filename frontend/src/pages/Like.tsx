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
import { IJsonResponse, ILike } from "../ts/types";

type Props = RouteComponentProps<{ postId: string }, {}>;

function Like({
  match: {
    params: { postId },
  },
}: Props) {
  const { userID } = useGlobalCtx();
  const client = useQueryClient();
  const [query, setQuery] = React.useState("");
  const [localData, setLocalData] = React.useState<ILike[] | undefined>();

  const { data, isLoading, isFetching } = useQuery(
    [postId, "likes"],
    async () => {
      const { data } = await axios.get<IJsonResponse<ILike[]>>(
        `/api/post/likes/${postId}`
      );
      return data.body;
    },
    { refetchOnMount: "always" }
  );

  const folResult = useFollow((data) => {
    client.setQueryData<ILike[]>([postId, "likes"], (old) =>
      produce(old!, (draft) => {
        const idx = draft.findIndex((f) => f.profile.id === data.pid);
        draft[idx].isFollowing = data.value === 1 ? true : false;
      })
    );
  });

  React.useEffect(() => {
    setLocalData(data);
  }, [data]);

  React.useEffect(() => {
    if (query) {
      const filteredData = data?.filter((l) => l.profile?.name.includes(query));
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
        {localData?.map((l) => {
          return (
            <div className="flex items-center" key={l.profile.id}>
              <Link
                to={
                  l.profile.id === userID
                    ? "/home/profile"
                    : `/home/user/${l.profile.id}`
                }
                className="w-3/4 flex items-center p-2 cursor-pointer hover:underline"
              >
                <div className="border border-gray-200 rounded-full p-1">
                  <img
                    src={l.profile.avatar ? l.profile.avatar.url : "/noImg.jpg"}
                    alt="profileImg"
                    className="md:w-12 w-8 h-8 md:h-12 rounded-full"
                  />
                </div>
                <span className="text-gray-500 font-bold ml-6">
                  @{l.profile.name}
                </span>
              </Link>
              {l.profile.id !== userID && (
                <div>
                  {l.isFollowing ? (
                    <Button
                      label="Unfollow"
                      styles="border border-purple-700 text-purple-700 hover:opacity-70"
                      buttonProps={{
                        onClick: () =>
                          folResult.mutate({ pid: l.profile.id, value: -1 }),
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
                          folResult.mutate({ pid: l.profile.id, value: 1 }),
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

export default Like;
