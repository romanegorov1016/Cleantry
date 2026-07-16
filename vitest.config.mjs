import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Next.js keeps JSX in `.js` files; Vitest/Vite need an explicit JSX loader for them.
 */
function jsxInJsPlugin() {
  return {
    name: "jsx-in-js",
    enforce: "pre",
    async transform(code, id) {
      const normalizedId = id.replace(/\\/g, "/");

      if (!normalizedId.includes("/src/") || normalizedId.includes("node_modules")) {
        return null;
      }

      if (!normalizedId.endsWith(".js") && !normalizedId.endsWith(".jsx")) {
        return null;
      }

      const result = await esbuild.transform(code, {
        loader: "jsx",
        jsx: "automatic",
        sourcefile: id,
        sourcemap: true,
      });

      return {
        code: result.code,
        map: result.map,
      };
    },
  };
}

const sharedConfig = {
  plugins: [jsxInJsPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "./src"),
    },
  },
};

export default defineConfig({
  test: {
    projects: [
      {
        ...sharedConfig,
        test: {
          name: "unit",
          environment: "node",
          include: ["src/catalog/**/*.test.js", "src/lib/**/*.test.js"],
        },
      },
      {
        ...sharedConfig,
        test: {
          name: "components",
          environment: "jsdom",
          include: ["src/components/**/*.test.jsx"],
        },
      },
    ],
  },
});
