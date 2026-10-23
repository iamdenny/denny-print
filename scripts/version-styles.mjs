import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
export function versionStyles(root) {
  const names = ["style.css", "promotions.css", "workspace.css"].filter(name => fs.existsSync(path.join(root, name)));
  const versions = names.map(name => {
    const bytes = fs.readFileSync(path.join(root, name));
    const version = name.replace(".css", `.${createHash("sha256").update(bytes).digest("hex").slice(0, 12)}.css`);
    fs.writeFileSync(path.join(root, version), bytes);
    return [name, version];
  });
  const visit = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (entry.name.endsWith(".html")) {
        let html = fs.readFileSync(file, "utf8");
        for (const [name, version] of versions) html = html.replaceAll(`href="/${name}"`, `href="/${version}"`);
        fs.writeFileSync(file, html);
      }
    }
  };
  visit(root);
}
