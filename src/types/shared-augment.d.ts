/**
 * Local augmentation: the installed `@tracht-digital-solutions/tds-shared`
 * (0.1.0) `BlogPost` type doesn't include the `tags` field yet, but the
 * content-api already returns it as a comma-separated string and the
 * journal renders it via TagList. Remove this file once tds-shared ships
 * with `tags` and tds-blog upgrades to that version.
 *
 * Tracking issue: https://github.com/Tracht-Digital-Solutions/tds-shared-pkg/issues
 */
import "@tracht-digital-solutions/tds-shared";

declare module "@tracht-digital-solutions/tds-shared" {
  interface BlogPost {
    tags: string | null;
  }
}
