import { downloadFile } from "ipull";
import path from "path";
import fs from "fs";
import { config } from "../config";

export async function download(
  url: string,
  dir: string,
  options: {
    referer?: string;
  },
): Promise<string> {
  // 解析文件名
  const instance = new URL(url);
  const filename = decodeURIComponent(instance.pathname.split("/").pop() ?? "");
  if (!filename) {
    throw new Error(`Error:Failed to resolve url filename : ${url}`);
  }
  const finalPath = path.join(dir, filename);
  if (fs.existsSync(finalPath)) {
    fs.rmSync(finalPath);
  }

  // 下载
  const downloader = await downloadFile({
    url,
    savePath: finalPath,
    cliProgress: true,
    headers: options.referer
      ? {
          Referer: options.referer,
        }
      : undefined,
    parallelStreams: config.DOWNLOAD_THREAD ?? 3,
  });

  await downloader.download();
  return filename;
}
