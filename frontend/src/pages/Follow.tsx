import { Button, Input, Spin } from "antd";
import { produce } from "immer";
import React from "react";
import { CiSearch } from "react-icons/ci";
import { useQuery, useQueryClient } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGlobalCtx } from "../context";
import { useFollow } from "../hooks/useFollow";
import { axios } from "../ts/constants";
import { IFollow, IJsonResponse } from "../ts/types";
import { FaArrowLeft } from "react-icons/fa6";

function Follow() {
  const params = useParams();
  const navigate = useNavigate();
  const client = useQueryClient();
  const { userID } = useGlobalCtx();
  const [query, setQuery] = React.useState("");
  const [localData, setLocalData] = React.useState<IFollow[] | undefined>();

  const { data, isLoading, isFetching } = useQuery(
    [params.pid || "me", params.type],
    async () => {
      const { data } = await axios.get<IJsonResponse<IFollow[]>>(
        `/api/profile/follow/${params.type}/${params.pid || "me"}`
      );
      return data.body;
    },
    { refetchOnMount: "always" }
  );
  const folResult = useFollow((data) => {
    client.setQueryData<IFollow[]>([params.pid || "me", params.type], (old) =>
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

  if (isLoading || isFetching) return <Spin />;

  return (
    <React.Fragment>
      <Button
        icon={<FaArrowLeft />}
        onClick={() => navigate(-1)}
        className="mb-4"
      />
      <div className="w-full mx-auto md:w-1/2">
        <Input
          autoFocus
          className="mb-4"
          prefix={<CiSearch />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {localData?.map((f) => {
          const user = f.profile ? f.profile : f.following;
          return (
            <div className="flex items-center" key={user.id}>
              <Link
                to={
                  user.id === userID ? "/home/profile" : `/home/user/${user.id}`
                }
                className="no-underline w-3/4 flex items-center p-2 cursor-pointer hover:underline"
              >
                <div className="border border-gray-200 rounded-full p-1">
                  <img
                    src={user.avatar ? user.avatar.url : "/noImg.jpg"}
                    alt="profileImg"
                    className="md:w-12 w-8 h-8 md:h-12 rounded-full"
                  />
                </div>
                <span className="text-gray-500 font-bold ml-2">
                  @{user.name}
                </span>
              </Link>
              {user.id !== userID && (
                <div>
                  {f.isFollowing || f.isFollowing === undefined ? (
                    <Button
                      onClick={() =>
                        folResult.mutate({ pid: user.id, value: -1 })
                      }
                      loading={folResult.isLoading}
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      onClick={() =>
                        folResult.mutate({ pid: user.id, value: 1 })
                      }
                      loading={folResult.isLoading}
                    >
                      Follow
                    </Button>
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
