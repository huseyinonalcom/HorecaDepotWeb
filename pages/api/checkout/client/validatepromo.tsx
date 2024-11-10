import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";

const parseDate = (dateString: string): Date => new Date(dateString);

const isDateBetween = (startDateString: string, endDateString: string, currentDate: Date): boolean => {
  const startDate = parseDate(startDateString);
  const endDate = parseDate(endDateString);
  return currentDate >= startDate && currentDate <= endDate;
};

export default async function validatePromo(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const cookies = req.cookies;
    const authToken = cookies.cj;
    const usedPromo = req.query.promo;
    if (usedPromo) {
      try {
        const fetchUrl = `${process.env.API_URL}/api/promos?filters[code][$eq]=${usedPromo}&populate[products][fields][0]=id&populate[clients][fields][0]=id&populate[categories][fields][0]=id`;
        const request = await fetch(fetchUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (request.ok) {
          const answer = await request.json();
          answer.data.at(0).clients = null;
          const promo = answer.data.at(0);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (isDateBetween(promo.startDate, promo.endDate, today)) {
            return res.status(200).json(promo);
          } else {
            return res.status(404).json(statusText[404]);
          }
        } else {
          return res.status(500).json(statusText[500]);
        }
      } catch {
        return res.status(500).json(statusText[500]);
      }
    } else {
      return res.status(404).json(statusText[404]);
    }
  } else {
    return res.status(405).json(statusText[405]);
  }
}
