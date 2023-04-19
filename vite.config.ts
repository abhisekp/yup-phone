/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import packageJson from "./package.json";

const getPackageName = () => {
  return packageJson.name;
};

const getPackageNameCamelCase = () => {
  try {
    return getPackageName().replace(/-./g, (char) => char[1].toUpperCase());
  } catch (err) {
    throw new Error("Name property in package.json is missing.");
  }
};

const fileName = {
  es: `${getPackageName()}.esm.js`,
  cjs: `${getPackageName()}.cjs.js`,
  umd: `${getPackageName()}.umd.js`,
};
type format = keyof typeof fileName;

const formats = Object.keys(fileName) as Array<keyof typeof fileName>;

module.exports = defineConfig({
  base: "./",
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: getPackageNameCamelCase(),
      formats,
      fileName: (format) => fileName[format as format],
    },
    rollupOptions: {
      external: ["yup"],
      output: {
        globals: {
          yup: "yup",
        }
      }
    }
  },
  test: {
    root: "test",
    environment: 'node',
  }
});
