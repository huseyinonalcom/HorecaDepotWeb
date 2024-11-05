import statusText from "../../../../api/statustexts";
import getAuthCookie from "../../cookies";

export async function putCategories({ req, res }) {
  const authToken = getAuthCookie({ type: "admin", req });

  const categories = JSON.parse(req.body);

  for (let i = 0; i < categories.length; i++) {
    const response = await fetch(
      `${process.env.API_URL}/api/categories/${categories[i].id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          data: {
            Name: categories[i].Name,
            localized_name: categories[i].localized_name,
            headCategory: categories[i].headCategory?.id ?? null,
            priority: categories[i].priority,
            subCategories:
              categories[i].subCategories?.map(
                (subCategory) => subCategory.id,
              ) ?? null,
            image: categories[i].image?.id ?? null,
          },
        }),
      },
    );
    const ans = await response.json();
  }

  try {
    return true;
  } catch (e) {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const response = await putCategories({ req, res });

    if (!response) {
      return res.status(400).json(statusText[400]);
    }
    try {
      res.revalidate("/");
    } catch (_) {}

    return res.status(200).json(statusText[200]);
  } catch (e) {
    console.error(e);
    return res.status(500).json(statusText[500]);
  }
}
