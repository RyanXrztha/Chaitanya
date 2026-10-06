import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Clean Architecture dependency rule: dependencies point inwards only.
//   domain  ←  application  ←  infrastructure / presentation  ←  app (routes)
const layer = (patterns, message) => ({
  "no-restricted-imports": ["error", { patterns: [{ group: patterns, message }] }],
});

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/domain/**"],
    rules: layer(
      ["@/application/*", "@/infrastructure/*", "@/presentation/*", "@/app/*", "react", "next", "next/*"],
      "domain is the innermost layer — it must not depend on outer layers or frameworks.",
    ),
  },
  {
    files: ["src/application/**"],
    rules: layer(
      ["@/infrastructure/*", "@/presentation/*", "@/app/*", "react", "next", "next/*"],
      "application may depend on domain only — receive repositories through constructor injection.",
    ),
  },
  {
    files: ["src/infrastructure/**"],
    rules: layer(["@/presentation/*", "@/app/*"], "infrastructure must not depend on the UI."),
  },
  {
    files: ["src/presentation/**"],
    rules: layer(
      ["@/infrastructure/*", "!@/infrastructure/container", "@/app/*"],
      "presentation reaches infrastructure only via the composition root (@/infrastructure/container).",
    ),
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Design reference prototypes — not part of the app.
    "design_handoff_chaitanya_website/**",
  ]),
]);

export default eslintConfig;
