import { getConfig } from "../../config/private/getconfig";
import statusText from "../../../../api/statustexts";

let cachedRating = null;

export async function fetchRating() {
  try {
    if (cachedRating && cachedRating.date > Date.now() - 2 * 60 * 60 * 1000) {
      return cachedRating.answer;
    }

    let config;
    try {
      config = await getConfig();
    } catch (e) {
      console.error("Failed to load config:", e);
      return cachedRating ? cachedRating.answer : null;
    }

    if (!config?.google?.GOOGLE_API_KEY) {
      console.error("Google API key is missing in config.");
      return cachedRating ? cachedRating.answer : null;
    }

    const req = await fetch(
      `https://places.googleapis.com/v1/places/ChIJwyUjGirDw0cRWnnesxxJlHU?fields=rating,userRatingCount&key=${config.google.GOOGLE_API_KEY}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    if (!req.ok) {
      const errorText = await req.text();
      console.error("API request failed:", errorText);
      return cachedRating ? cachedRating.answer : null;
    }

    const answer = await req.json();
    cachedRating = { answer, date: Date.now() };
    return answer;
  } catch (e) {
    console.error("Error fetching rating:", e);
    return cachedRating ? cachedRating.answer : null;
  }
}

export default async function handler(req, res) {
  try {
    const response = await fetchRating();

    if (!response) {
      return res.status(500).json(statusText[500]);
    }

    return res.status(200).json(response);
  } catch (e) {
    console.error("Handler error:", e);
    return res.status(500).json(statusText[500]);
  }
}
