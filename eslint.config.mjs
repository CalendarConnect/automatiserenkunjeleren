import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Production build optimizations - disable problematic rules during build
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_" 
      }],
      "react-hooks/exhaustive-deps": "warn",
      "@next/next/no-img-element": "off", // Allow img elements when needed
      "prefer-const": "warn",
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "react/no-unescaped-entities": "off", // Allow unescaped entities for Dutch content
      "jsx-a11y/alt-text": "warn", // Make alt text warnings instead of errors
    },
  },
];

export default eslintConfig;
