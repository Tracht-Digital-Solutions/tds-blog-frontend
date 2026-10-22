/** `client:when` from tds-shared's `tdsClientDirectives()` (astro.config.mjs). */
declare module "astro" {
  interface AstroClientDirectives {
    "client:when"?: string;
  }
}

export {};
