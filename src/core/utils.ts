import * as path from 'path';
import { URL } from "url";

export function getFileNameFromURL(urlStr: string) {
  const url = new URL(urlStr);

  return path.basename(url.pathname);
}