import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { ClientOnly } from "remix-utils";
import { Studio } from "sanity";

import styles from "~/styles/studio.css";
import { config } from "~/sanity/sanity.config";

export const meta: MetaFunction = () => ({
  title: "Vek Labs Content",
  robots: "noindex",
});

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function StudioPage() {
  return <ClientOnly>{() => <Studio config={config} />}</ClientOnly>;
}
