import { Button, Spin } from "antd";
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGlobalCtx } from "../context";
import { useFeed } from "../hooks/useFeed";
import { useFollow } from "../hooks/useFollow";
import { useProfile } from "../hooks/useProfile";
import { getDate } from "../ts/utils";
import Post from "./Post";

function Profile() {
  const navigate = useNavigate();
  const { pid = "me" } = useParams();
  const { userID } = useGlobalCtx();

  const proResult = useProfile(pid || "me");
  const posResult = useFeed(pid || "", "private");
  const folResult = useFollow();

  const profile = proResult.data;
  const posts = posResult.data;

  if (proResult.isLoading || proResult.isFetching) return <Spin />;

  return (
    <>
      {pid !== "me" && (
        <Button
          icon={<FaArrowLeft />}
          onClick={() => navigate(-1)}
          className="mb-4"
        />
      )}
      <div className="pt-5 w-full">
        <div>
          <div className="flex justify-between">
            <div className="flex items-center flex-col lg:flex-row">
              <div className="rounded-full border-2 border-gray-300 p-1 mb-2 lg:w-40 md:w-32 w-20 h-20 md:h-32 lg:h-40">
                <img
                  src={profile?.avatar ? profile.avatar.url : "/noImg.jpg"}
                  alt="profileImage"
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
              <div className="text-center lg:text-left lg:ml-4">
                <span className="text-gray-600 text-sm md:text-lg font-bold">
                  <i className="text-gray-400">@</i>
                  {profile?.name}
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div
                className="flex items-center pr-2 text-gray-500 text-xs md:text-sm lg:text-lg"
                style={{ fontFamily: "monospace" }}
              >
                <div className="flex flex-col items-center mr-8">
                  <span>Posts</span>
                  <span>{posts?.length}</span>
                </div>
                <Link
                  to={
                    [userID, "me"].includes(pid)
                      ? "/home/profile/followers"
                      : `/home/user/${pid}/followers`
                  }
                  className="no-underline text-gray-500 flex flex-col items-center mr-8 hover:opacity-80 cursor-pointer"
                >
                  <span>Followers</span>
                  <span>{profile?.followers || 0}</span>
                </Link>
                <Link
                  to={
                    pid === userID
                      ? "/home/profile/following"
                      : `/home/user/${pid}/following`
                  }
                  className="no-underline text-gray-500 flex flex-col items-center mr-8 hover:opacity-80 cursor-pointer"
                >
                  <span>Following</span>
                  <span>{profile?.following || 0}</span>
                </Link>
              </div>
              {profile?.isFollowing !== undefined && (
                <div className="mt-4 mr-8">
                  {profile?.isFollowing ? (
                    <Button
                      onClick={() =>
                        folResult.mutate({ pid: profile.id, value: -1 })
                      }
                      loading={folResult.isLoading}
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      onClick={() =>
                        folResult.mutate({ pid: profile.id, value: 1 })
                      }
                      loading={folResult.isLoading}
                    >
                      Follow
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col mt-4 ml-4">
            <div className="flex text-sm text-gray-400">
              <div className="flex items-center">
                <i className="fas fa-calendar mr-2 text-purple-500"></i>
                <span className="whitespace-nowrap">
                  {getDate(profile?.createdAt!)}
                </span>
              </div>
              {profile?.location && (
                <div className="flex ml-6 items-center">
                  <i className="fas fa-map-marker-alt mr-2 text-purple-500"></i>
                  <span className="whitespace-nowrap">{profile.location}</span>
                </div>
              )}
              {profile?.occupation && (
                <div className="flex ml-6 items-center">
                  <i className="fas fa-building mr-2 text-purple-500 "></i>
                  <span className="whitespace-nowrap">
                    {profile.occupation}
                  </span>
                </div>
              )}
              {profile?.weblink && (
                <div className="flex ml-6 items-center">
                  <i className="fas fa-link mr-2 text-purple-500"></i>
                  <a
                    href={profile.weblink}
                    className="hover:underline text-gray-400 whitespace-nowrap"
                  >
                    {profile.weblink}
                  </a>
                </div>
              )}
            </div>
            {profile?.bio && (
              <div
                className="text-gray-500 flex items-center mt-3"
                style={{
                  wordSpacing: "0.2em",
                  whiteSpace: "pre-wrap",
                }}
              >
                <span className="text-sm">{profile.bio}</span>
              </div>
            )}
          </div>
        </div>
        <div className="relative mt-6" style={{ minHeight: "100px" }}>
          {posResult.isLoading || posResult.isFetching ? (
            <div className="w-full flex justify-center items-center">
              <Spin />
            </div>
          ) : (
            posts?.map((post) => (
              <Post post={post} key={post.id} postedBy={profile} />
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
