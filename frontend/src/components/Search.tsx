import { Input, Spin } from "antd";
import classNames from "classnames";
import React from "react";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useGlobalCtx } from "../context";
import { axios } from "../ts/constants";
import { IJsonResponse, IProfile } from "../ts/types";

function Search() {
  const { userID } = useGlobalCtx();
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [profiles, setProfiles] = React.useState<IProfile[]>([]);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (query) {
      setLoading(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        axios
          .post<IJsonResponse<IProfile[]>>(`/api/search/${query}`)
          .then(({ data }) => {
            if (data.status === 200) setProfiles(data.body);
            setLoading(false);
          });
      }, 2000);
    }
  }, [query]);

  return (
    <React.Fragment>
      <Input
        autoFocus
        prefix={<CiSearch />}
        placeholder="Search for users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <div
          className="bg-gray-50 py-4 absolute w-full z-50 top-8 md:w-3/4 text-sm"
          style={{ fontFamily: "monospace", minHeight: "100px" }}
        >
          {loading ? (
            <div className="w-full flex justify-center items-center">
              <Spin />
            </div>
          ) : profiles.length > 0 ? (
            profiles.map((profile, idx) => (
              <Link
                to={
                  profile.id === userID
                    ? "/home/profile"
                    : `/home/user/${profile.id}`
                }
                className={
                  "no-underline flex items-center p-2 cursor-pointer hover:bg-gray-50" +
                  classNames({
                    " border-b": idx !== profiles.length - 1,
                  })
                }
                key={profile.id}
              >
                <div className="border border-gray-200 rounded-full p-1">
                  <img
                    src={profile.avatar ? profile.avatar.url : "/noImg.jpg"}
                    alt="profileImg"
                    className="md:w-12 w-8 h-8 md:h-12 rounded-full"
                  />
                </div>
                <div className="flex flex-col ml-3">
                  <span className="text-gray-500 font-bold">
                    {profile.name}
                  </span>
                  <div className="text-xs my-1">
                    {profile.location && (
                      <span>
                        <i className="fas fa-map-marker-alt mr-2 text-purple-500"></i>
                        {profile.location}
                      </span>
                    )}
                    {profile.occupation && (
                      <span className="ml-8">
                        <i className="fas fa-building mr-2 text-purple-500 "></i>
                        {profile.occupation}
                      </span>
                    )}
                    {profile.weblink && (
                      <span className="ml-8">
                        <i className="fas fa-link mr-2 text-purple-500"></i>
                        {profile.weblink}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="flex flex-col mt-5 items-center text-gray-400">
              <i className="fas fa-frown text-lg"></i>
              <span>Couldn't find "{query}"...</span>
            </div>
          )}
        </div>
      )}
    </React.Fragment>
  );
}

export default Search;
