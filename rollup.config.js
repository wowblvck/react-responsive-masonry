import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import typescript from "rollup-plugin-typescript2"
import dts from "rollup-plugin-dts"

export default [
  {
    input: {
      index: "src/index.ts",
      Masonry: "src/Masonry/index.ts",
      ResponsiveMasonry: "src/ResponsiveMasonry/index.ts",
    },
    output: [
      {
        dir: "dist/esm",
        format: "esm",
        sourcemap: true,
        entryFileNames: "[name].js",
      },
      {
        dir: "dist/cjs",
        format: "cjs",
        sourcemap: true,
        entryFileNames: "[name].js",
        exports: "auto",
      },
    ],
    external: ["react", "react-dom"],
    plugins: [
      resolve({
        extensions: [".js", ".ts"],
      }),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        useTsconfigDeclarationDir: true,
        clean: true,
      }),
    ],
  },
  {
    input: "./dist/types/index.d.ts",
    output: [{file: "dist/index.d.ts", format: "es"}],
    plugins: [dts()],
  },
]
