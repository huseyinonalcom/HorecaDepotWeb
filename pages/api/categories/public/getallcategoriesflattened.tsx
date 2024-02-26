import statusText from "../../../../api/statustexts";

const fetchUrl = `${process.env.API_URL}/api/categories?populate[headCategory][fields][0]=name&populate[subCategories][fields][0]=name&fields[0]=name&populate[image][fields][0]=url&sort=priority&pagination[pageSize]=100`;

// export async function getAllCategoriesFlattened() {

//   const response = await fetch(fetchUrl, {
//     headers: {
//       Authorization: `Bearer ${API_KEY}`,
//     },
//   });

//   const data = await response.json();

//   const allCategories = data["data"].map(CategoryConversion.fromJson);

//   return allCategories;
// }

export default async function handler(req, res) {
  try {
    const response = await fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });

    if (!response.ok) {
      res.status(400).json(statusText[400]);
    }

    const data = await response.json();
    res.status(200).json(data.data);
  } catch (error) {
    res.status(500).json(statusText[500]);
  }
}
