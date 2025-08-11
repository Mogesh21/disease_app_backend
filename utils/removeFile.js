import path from "path";
import fs from "fs";

const removeFile = (name, folder = "") => {
  const file = path.join(process.cwd(), "public", folder, name);
  if (fs.existsSync(file)) {
    fs.rmSync(file);
  }
};

export default removeFile;
