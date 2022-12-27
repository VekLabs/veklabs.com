import type {
  LinksFunction,
  LoaderArgs,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import groq from "groq";

import Layout from "~/components/Layout";
import { getClient } from "~/sanity/client";

import { VideoCard } from "~/components/VideoCard";
import styles from "~/styles/app.css";
import type { HomeDocument } from "~/types/home";
import { VideoFragment, videoFragmentsZ } from "~/types/video";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const meta: MetaFunction = (data) => {
  const home = data.parentsData.root.home as HomeDocument;

  return {
    title: [home.title, home.siteTitle].filter(Boolean).join(" | "),
  };
};

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const query = groq`*[_type == "video"][0...12]{
    _id,
    title,
    "slug": slug.current,
    "artist": artist->title,
    image
  }`;

  const videos = await getClient()
    .fetch(query)
    .then((res) => (res ? videoFragmentsZ.parse(res) : null));

  if (!videos) {
    throw new Response("Not found", { status: 404 });
  }

  return json({ videos });
};

export default function Index() {
  const { videos = [] } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className="grid grid-cols-1 gap-6 md:gap-12">
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-12 lg:grid-cols-4">
          {videos.map((video: VideoFragment) => (
            <VideoCard key={video._id} withHref {...video} />
          ))}
        </ul>
      </div>
    </Layout>
  );
}
