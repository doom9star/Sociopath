import { AxiosResponse } from "axios";
import produce from "immer";
import { useMutation, UseMutationResult, useQueryClient } from "react-query";
import { axios } from "../ts/constants";
import { IComment, IJsonResponse, IPost } from "../ts/types";

interface IVariables {
  postId: string;
  body: string;
  pcid?: string;
}

type TFn = (
  onSuccess?: (data: {
    comment: IComment;
    updater: (post: IPost) => IPost;
  }) => void
) => UseMutationResult<IComment, unknown, IVariables, unknown>;

export const useComment: TFn = (onSuccess) => {
  const client = useQueryClient();
  const options = useMutation(
    "comment",
    async ({ body, postId, pcid }: IVariables) => {
      const post = client.getQueryData<IPost>([postId, "detail"]);
      const { data }: AxiosResponse<IJsonResponse<IComment>> = await axios.post(
        `/api/post/comment/${postId}`,
        {
          body,
          pcid,
          poster: post?.profile.id,
        }
      );
      return data.body;
    },
    {
      onSuccess: (comment) => {
        const updater = (post: IPost) =>
          produce(post, (draft) => {
            draft.comments = (post.comments as number) + 1;
          });
        if (!comment.parent && client.getQueryData(["me", "protected"])) {
          client.setQueryData<IPost[]>(["me", "protected"], (old) =>
            produce(old!, (draft) => {
              const idx = draft.findIndex((p) => p.id === comment.post.id);
              draft[idx] = updater(draft[idx]);
            })
          );
        }
        client.setQueryData<IPost>([comment.post.id, "detail"], (old) =>
          produce(old!, (draft) => {
            if (comment.parent) {
              const pcidx = (draft.comments as IComment[]).findIndex(
                (c) => c.id === comment.parent.id
              );
              (draft.comments as IComment[])[pcidx].children.unshift(comment);
            } else (draft.comments as IComment[]).unshift(comment);
          })
        );
        onSuccess && onSuccess({ comment, updater });
      },
    }
  );
  return options;
};
