import { useQueryClient } from "react-query";

export function useQueryData<TData = null>(key: any) {
  const client = useQueryClient();
  const data = client.getQueryData<TData | undefined>(key);
  return data;
}
