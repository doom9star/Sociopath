import { useEffect } from "react";

export function useTitle(title: string, prefixAppName: boolean = true) {
  useEffect(() => {
    document.title = prefixAppName ? `Sociopath - ${title}` : title;
  }, [title, prefixAppName]);
}
