import apiRoute from "../../../api/api/apiRoute";
import {
  createStatisticsDay,
  fetchStatisticsDay,
  updateStatisticsDay,
} from "./statistics/universal";

export async function getWeeklyVisits() {
  const statisticsDays = [];
  try {
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const statisticsDay = await fetchStatisticsDay({
        date: date,
      });

      if (statisticsDay) {
        statisticsDays.push(statisticsDay);
      }
    }

    return { result: statisticsDays };
  } catch (error) {
    console.error(error);
    return { result: null, error };
  }
}

export async function logVisit({ device }: { device: string }) {
  try {
    let statisticsDay = await fetchStatisticsDay({
      date: new Date(),
    });

    if (!statisticsDay) {
      statisticsDay = await createStatisticsDay();
    }

    if (!statisticsDay.statistics) {
      statisticsDay.statistics = {
        totalvisits: 0,
        devices: {
          mobile: 0,
          tablet: 0,
          computer: 0,
        },
      };
    }

    switch (device) {
      case "mobile":
        statisticsDay.statistics.devices.mobile++;
        break;
      case "tablet":
        statisticsDay.statistics.devices.tablet++;
        break;
      case "computer":
        statisticsDay.statistics.devices.computer++;
        break;
    }

    statisticsDay.statistics.totalvisits =
      Number(statisticsDay.statistics.totalvisits) + 1;

    await updateStatisticsDay({
      id: statisticsDay.id,
      statisticsDay: {
        statistics: {
          ...statisticsDay.statistics,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return { result: "error" };
  }
  return { result: "ok" };
}

export default apiRoute({
  endpoints: {
    GET: {
      func: async (req, res) => {
        return await getWeeklyVisits();
      },
    },
    POST: {
      func: async (req, res) => {
        return await logVisit({
          device: req.query.device as string,
        });
      },
    },
  },
});
