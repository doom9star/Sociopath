import { Button, Input, Spin } from "antd";
import { produce } from "immer";
import React from "react";
import { CiSearch } from "react-icons/ci";
import { FaArrowLeft, FaHeart } from "react-icons/fa6";
import { useQuery, useQueryClient } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGlobalCtx } from "../context";
import { useFollow } from "../hooks/useFollow";
import { axios } from "../ts/constants";
import { IJsonResponse, ILike } from "../ts/types";

function Like() {
  const params = useParams();
  const navigate = useNavigate();
  const client = useQueryClient();
  const { userID } = useGlobalCtx();
  const [query, setQuery] = React.useState("");
  const [localData, setLocalData] = React.useState<ILike[] | undefined>();

  const { data, isLoading, isFetching } = useQuery(
    [params.postId, "likes"],
    async () => {
      const { data } = await axios.get<IJsonResponse<ILike[]>>(
        `/api/post/likes/${params.postId}`
      );
      return data.body;
    },
    { refetchOnMount: "always" }
  );

  const folResult = useFollow((data) => {
    client.setQueryData<ILike[]>([params.postId, "likes"], (old) =>
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
          prefix={<CiSearch />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-4"
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
                className="no-underline w-full flex items-center p-2 cursor-pointer hover:underline"
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
                <FaHeart className="text-red-500 ml-auto" />
              </Link>
              {l.profile.id !== userID && (
                <div className="ml-8">
                  {l.isFollowing ? (
                    <Button
                      onClick={() =>
                        folResult.mutate({ pid: l.profile.id, value: -1 })
                      }
                      loading={folResult.isLoading}
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      onClick={() =>
                        folResult.mutate({ pid: l.profile.id, value: 1 })
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

export default Like;
