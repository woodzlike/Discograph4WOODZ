import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // mcp-shrimp-task-manager는 별도로 설치된 MCP 서버 도구 코드라 앱 lint/typecheck 대상이 아니다.
    "mcp-shrimp-task-manager/**",
  ]),
]);

export default eslintConfig;
