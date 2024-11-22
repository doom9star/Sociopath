import { Button, Spin } from "antd";
import { IoReloadOutline } from "react-icons/io5";
import Post from "../components/Post";
import { useFeed } from "../hooks/useFeed";
import { useQueryData } from "../hooks/useQueryData";
import { IProfile } from "../ts/types";

function Feed() {
  const { data, isLoading, refetch, isRefetching } = useFeed("me", "protected");
  const profile = useQueryData<IProfile>(["me", "profile"]);

  if (isLoading) return <Spin />;

  return (
    <div
      className="flex flex-col w-full relative"
      style={{ minHeight: "100px" }}
    >
      <div className="self-end mb-4">
        <Button
          icon={<IoReloadOutline />}
          onClick={() => refetch()}
          loading={isRefetching}
        >
          Reload
        </Button>
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
    </div>
  );
}

export default Feed;
