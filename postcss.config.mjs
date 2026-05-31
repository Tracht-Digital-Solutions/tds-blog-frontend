// Astro 6 ships Vite 7 with rolldown, which is incompatible with the
// @tailwindcss/vite plugin's expected resolver shape (withastro/astro#16542).
// The @tailwindcss/postcss variant runs Tailwind through PostCSS instead and
// sidesteps the rolldown plugin contract entirely.
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
