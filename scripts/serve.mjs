import http from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
const root = resolve("dist");
http
  .createServer(async (req, res) => {
    try {
      let path = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      if (path.endsWith("/")) path += "index.html";
      const file = resolve(root, "." + path);
      if (!file.startsWith(root + "/")) throw Error();
      const data = await readFile(file);
      res.setHeader(
        "Content-Type",
        {
          ".html": "text/html",
          ".css": "text/css",
          ".js": "text/javascript",
          ".json": "application/json",
          ".svg": "image/svg+xml",
        }[extname(file)] || "text/plain",
      );
      res.end(data);
    } catch {
      res.statusCode = 404;
      res.end("Not found");
    }
  })
  .listen(Number(process.env.PORT || 4300), "127.0.0.1");
