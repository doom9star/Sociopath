import React from "react";
import Button from "../components/custom/Button";
import Spinner from "../components/custom/Spinner";
import Post from "../components/Post";
import { useFeed } from "../hooks/useFeed";
import { useQueryData } from "../hooks/useQueryData";
import { IProfile } from "../ts/types";

function Feed() {
  const { data, isLoading, refetch, isRefetching } = useFeed("me", "protected");
  const profile = useQueryData<IProfile>(["me", "profile"]);
  if (isLoading) return <Spinner />;
  return (
    <div
      className="flex flex-col w-full relative"
      style={{ minHeight: "100px" }}
    >
      {isRefetching ? (
        <Spinner />
      ) : (
        <>
          <div className="self-end mr-4">
            <Button
              label="Reload"
              styles="text-purple-700 border mb-2 border-purple-700 hover:opacity-80"
              icon={<i className="fas fa-redo mr-2 text-purple-600" />}
              buttonProps={{
                onClick: refetch,
              }}
            />
          </div>
          <div>
            {data?.map((post) => (
              <Post
                post={post}
                key={post.id}
                postedBy={!post.profile ? profile : undefined}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Feed;
