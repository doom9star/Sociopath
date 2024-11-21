import { Button, Spin, Tabs, TabsProps } from "antd";
import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import Post from "../components/Post";
import Search from "../components/Search";
import { useGlobalCtx } from "../context";
import { useFeed } from "../hooks/useFeed";
import { IPost, WorldPostType } from "../ts/types";

const items: TabsProps["items"] = [
  {
    key: `${WorldPostType.IMAGE_WRITING}`,
    label: "All",
  },
  {
    key: `${WorldPostType.IMAGE}`,
    label: "Photos",
  },
  {
    key: `${WorldPostType.WRITING}`,
    label: "Texts",
  },
];

function World() {
  const { wpt, setWPT } = useGlobalCtx();
  const [gridView, setGridView] = React.useState(true);
  const [localData, setLocalData] = React.useState<IPost[] | undefined>();

  const { isLoading, isFetching, data } = useFeed("me", "public", wpt);

  React.useEffect(() => {
    setLocalData(data);
  }, [data]);

  return (
    <div className="relative">
      <Search />
      <Tabs
        items={items}
        className="my-4 w-1/4"
        activeKey={`${wpt}`}
        onChange={(k) => setWPT(Number(k))}
      />
      {isLoading || isFetching ? (
        <div className="w-full h-full flex justify-center items-center">
          <Spin />
        </div>
      ) : (wpt === WorldPostType.IMAGE ||
          wpt === WorldPostType.IMAGE_WRITING) &&
        gridView ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-8 place-items-center">
          {data?.map((p) => (
            <div className="relative" key={p.id}>
              <img
                src={p.images.length > 0 ? p.images[0].url : "/noImg.jpg"}
                alt={p.id}
                className="object-contain cursor-pointer hover:opacity-70 transition-all"
                onClick={() => {
                  if (p.id !== data[0].id) {
                    const filtered = localData?.filter((lp) => lp.id !== p.id);
                    filtered?.unshift(p);
                    setLocalData(filtered);
                  }
                  setGridView(false);
                }}
              />
              {p.images.length > 1 && (
                <i className="fas fa-clone text-gray-500 px-1 bg-white text-lg absolute top-2 right-2" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="my-8">
          {wpt !== WorldPostType.WRITING && (
            <div className="w-10 ml-auto">
              <Button
                icon={<FaArrowLeft />}
                onClick={() => {
                  setLocalData(data);
                  setGridView(true);
                }}
              />
            </div>
          )}
          {localData?.map((post) => (
            <Post post={post} key={post.id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default World;
