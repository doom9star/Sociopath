import classNames from "classnames";
import React from "react";
import Button from "../components/custom/Button";
import Spinner from "../components/custom/Spinner";
import Post from "../components/Post";
import Search from "../components/Search";
import { useGlobalCtx } from "../context";
import { useFeed } from "../hooks/useFeed";
import { IPost, WorldPostType } from "../ts/types";

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
      {isLoading || isFetching ? (
        <Spinner styles={{ top: "200%" }} />
      ) : (
        <>
          <div className="flex justify-start pt-4 text-gray-600">
            <span
              className={
                "bg-gray-100 px-4 rounded-lg mr-2 py-2 cursor-pointer" +
                classNames({
                  " shadow-lg border-b border-gray-400":
                    wpt === WorldPostType.IMAGE_WRITING,
                })
              }
              onClick={() =>
                wpt !== WorldPostType.IMAGE_WRITING &&
                setWPT(WorldPostType.IMAGE_WRITING)
              }
            >
              <i className="fas fa-image mr-2" />
              <i className="fas fa-signature" />
            </span>
            <span
              className={
                "bg-gray-100 px-4 rounded-lg mr-2 py-2 cursor-pointer" +
                classNames({
                  " shadow-lg border-b border-gray-400":
                    wpt === WorldPostType.IMAGE,
                })
              }
              onClick={() =>
                wpt !== WorldPostType.IMAGE && setWPT(WorldPostType.IMAGE)
              }
            >
              <i className="fas fa-image" />
            </span>
            <span
              className={
                "bg-gray-100 px-4 rounded-lg py-2 cursor-pointer" +
                classNames({
                  " shadow-lg border-b border-gray-400":
                    wpt === WorldPostType.WRITING,
                })
              }
              onClick={() =>
                wpt !== WorldPostType.WRITING && setWPT(WorldPostType.WRITING)
              }
            >
              <i className="fas fa-signature" />
            </span>
          </div>
          {(wpt === WorldPostType.IMAGE ||
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
                        const filtered = localData?.filter(
                          (lp) => lp.id !== p.id
                        );
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
                    label=""
                    styles="text-purple-700 border mb-2 border-purple-700 hover:opacity-80"
                    icon={<i className="fas fa-chevron-left text-purple-600" />}
                    buttonProps={{
                      onClick: () => {
                        setLocalData(data);
                        setGridView(true);
                      },
                    }}
                  />
                </div>
              )}
              {localData?.map((post) => (
                <Post post={post} key={post.id} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default World;
