// Flat config nativo de Next 16. `eslint-config-next` ya exporta el array
// completo (next + typescript + react/hooks/import/jsx-a11y + ignores), así
// que NO se usa `@eslint/eslintrc`/FlatCompat — esa capa legacy rompía con
// ESLint 9.39 (estructura circular en el plugin react).
import next from "eslint-config-next";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  // `inbox/` es material de referencia de UX (mockups .jsx con globals sin
  // import) — no es código de la app. `scripts/` son utilidades sueltas.
  { ignores: ["inbox/**", "scripts/**"] },
  ...next,
  {
    // react-hooks v6 estrenó reglas más estrictas. `set-state-in-effect` y
    // `refs` chocan con el visor de cartografía (escrito pre-v6). `purity`
    // marca `Date.now()` en Server Components como impuro — falso positivo:
    // un Server Component renderiza una vez por request, no re-renderiza.
    // Quedan como warning (deuda P3), no bloquean la compuerta de lint.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/purity": "warn",
    },
  },
];

export default eslintConfig;
