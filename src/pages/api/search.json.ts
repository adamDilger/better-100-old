import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url }) => {
  const search = new URL(url).searchParams.get("search");

  if (!search) {
    return new Response(
      JSON.stringify({ message: "No search term provided" }),
      { status: 400 },
    );
  }

  const data = await queryYoutube(search);

  return new Response(JSON.stringify(data));
};

async function queryYoutube(search: string) {
  const up = new URLSearchParams();
  up.append("part", "id,snippet");
  up.append("q", decodeURIComponent(search));
  up.append("type", "video");
  // up.append("key", "YOUR_API_KEY");

  const url = "https://www.googleapis.com/youtube/v3/search?" +
    up.toString();

  console.log(url);
  const res = await fetch(url);
  const data: YoutubeResponse = await res.json();

  if (!data.items || data.items.length === 0) {
    return [];
  }

  return data.items.map((i) => ({
    id: i.id.videoId,
    title: i.snippet.title,
    thumbnail: i.snippet.thumbnails.default.url,
  }));
}

type YoutubeResponse = {
  "kind": string;
  "etag": string;
  "nextPageToken": string;
  "regionCode": string;
  "pageInfo": {
    "totalResults": number;
    "resultsPerPage": number;
  };
  "items": Array<{
    "kind": string;
    "etag": string;
    "id": {
      "kind": string;
      "videoId": string;
    };
    "snippet": {
      "publishedAt": string;
      "channelId": string;
      "title": string;
      "description": string;
      "thumbnails": {
        "default": {
          "url": string;
          "width": 120;
          "height": 90;
        };
        "medium": {
          "url": string;
          "width": 320;
          "height": 180;
        };
        "high": {
          "url": string;
          "width": 480;
          "height": 360;
        };
      };
      "channelTitle": string;
      "liveBroadcastContent": string;
      "publishTime": string;
    };
  }>;
};
