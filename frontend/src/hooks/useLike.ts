import { AxiosResponse } from "axios";
import { produce } from "immer";
import { useMutation, UseMutationResult, useQueryClient } from "react-query";
import { axios } from "../ts/constants";
import { IJsonResponse, IPost, WorldPostType } from "../ts/types";

interface IVariables {
  value: 1 | -1;
  postId: string;
  poster: string;
}

type IVariablesWithoutPoster = Omit<IVariables, "poster">;

type TFn = (
  onSuccess?: (
    data: IVariablesWithoutPoster & { updater: (post: IPost) => IPost }
  ) => void
) => UseMutationResult<IVariablesWithoutPoster, unknown, IVariables, unknown>;

export const useLike: TFn = (onSuccess) => {
  const client = useQueryClient();
  const options = useMutation(
    "like",
    async ({ postId, value, poster }: IVariables) => {
      const { data }: AxiosResponse<IJsonResponse<IVariablesWithoutPoster>> =
        await axios.post(`/api/post/like/${postId}/${value}`, { poster });
      return data.body;
    },
    {
      onSuccess: (body) => {
        const updater = (post: IPost) =>
          produce(post, (draft) => {
            draft.isLiked = !draft.isLiked;
            draft.likes = (draft.likes as number) + body.value;
          });
        if (client.getQueryData(["me", "protected"]))
          client.setQueryData<IPost[]>(["me", "protected"], (old) =>
            produce(old!, (draft) => {
              const idx = draft.findIndex((p) => p.id === body.postId);
              draft[idx] = updater(draft[idx]);
            })
          );
        if (client.getQueryData([body.postId, "detail"]))
          client.setQueryData<IPost>([body.postId, "detail"], (old) =>
            updater(old!)
          );
        for (const wpt of Object.values(WorldPostType)) {
          if (client.getQueryData(["me", "public", wpt])) {
            client.setQueryData<IPost[]>(["me", "public", wpt], (old) =>
              produce(old!, (draft) => {
                const idx = draft.findIndex((p) => p.id === body.postId);
                draft[idx] = updater(draft[idx]);
              })
            );
          }
        }
        onSuccess && onSuccess({ ...body, updater });
      },
    }
  );
  return options;
};
