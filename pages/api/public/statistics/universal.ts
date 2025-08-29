import { apiUrl } from "../../../../api/api/constants";

const fetchUrlStatistics = `${apiUrl}/api/statistics`;

export async function fetchStatisticsDay({ date }: { date: Date }) {
  try {
    const dateStringAPI = date.toISOString().split("T")[0];

    const request = await fetch(
      `${fetchUrlStatistics}?filters[date][$eq]=${dateStringAPI}&populate=*`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      },
    );

    if (!request.ok) {
      const error = `Failed to fetch statistics for date ${dateStringAPI}`;
      console.error(error);
      throw error;
    } else {
      const answer = await request.json();

      if (answer.data.length == 0) {
        throw `No statistics found for date ${dateStringAPI}`;
      }

      return answer.data[0];
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createStatisticsDay() {
  try {
    const today = new Date();
    const dateStringAPI = today.toISOString().split("T")[0];

    const request = await fetch(`${fetchUrlStatistics}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          date: dateStringAPI,
          statistics: {
            totalvisits: 0,
            devices: {
              mobile: 0,
              tablet: 0,
              computer: 0,
            },
          },
        },
      }),
    });

    if (!request.ok) {
      const error = "Failed to create statistics for today";
      console.error(error);
      throw error;
    } else {
      const answer = await request.json();
      return answer.data;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateStatisticsDay({ statisticsDay, id }) {
  const body = JSON.stringify({
    data: {
      statisticsDay,
    },
  });

  try {
    const request = await fetch(`${fetchUrlStatistics}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          ...statisticsDay,
        },
      }),
    });

    if (!request.ok) {
      const error = "Failed to update statistics for today";
      console.error(error);
      throw error;
    } else {
      const answer = await request.json();
      return answer.data;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
