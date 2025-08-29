import AdminPanelLayout from "../../components/admin/AdminPanelLayout";
import SingleLineChart from "../../components/charts/singlelinechart";
import TopViewedChart from "../../components/charts/topviewedtoday";
import useTranslation from "next-translate/useTranslation";
import {
  getTopProductsWeek,
  getTopProductsDay,
} from "../api/private/products/stats";
import { getWeeklyVisits } from "../api/public/visit";
import SinglePieChart from "../../components/charts/singlepiechart";

export default function Dashboard({
  topProductsDay,
  topProductsWeek,
  totalViewsPerDay,
  weeklyViewsPerDevice,
}) {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col gap-4">
      <TopViewedChart data={topProductsDay} />
      <TopViewedChart data={topProductsWeek} title={t("most-viewed-week")} />
      <div className="grid grid-cols-2 gap-4">
        <SinglePieChart
          data={weeklyViewsPerDevice}
          title={t("total-weekly-views-per-device")}
          lineDataKey="views"
          legendDataKey="device"
        />
        <SingleLineChart
          data={totalViewsPerDay}
          title={t("total-views-per-day")}
          lineDataKey="views"
          legendDataKey="date"
        />
      </div>
    </div>
  );
}

Dashboard.getLayout = function getLayout(page) {
  const { t } = useTranslation("common");
  return <AdminPanelLayout title={t("dashboard")}>{page}</AdminPanelLayout>;
};

export async function getServerSideProps() {
  const topProductsDay = await getTopProductsDay({});
  const topProductsWeek = await getTopProductsWeek({});

  const visitData = (await getWeeklyVisits()).result;

  const totalViewsPerDay = visitData
    .map((day) => {
      return {
        date: day.date.split("-").reverse().join("-"),
        views: day.statistics?.totalvisits ?? 0,
      };
    })
    .reverse();

  const weeklyViewsPerDeviceDate = visitData.map((day) => {
    return {
      date: day.date.split("-").reverse().join("-"),
      devices: {
        mobile: day.statistics?.devices?.mobile ?? 0,
        tablet: day.statistics?.devices?.tablet ?? 0,
        computer: day.statistics?.devices?.computer ?? 0,
      },
    };
  });

  const weeklyViewsPerDevice = [
    {
      device: "mobile",
      views: weeklyViewsPerDeviceDate.reduce((acc, day) => {
        return acc + day.devices.mobile;
      }, 0),
    },
    {
      device: "tablet",
      views: weeklyViewsPerDeviceDate.reduce((acc, day) => {
        return acc + day.devices.tablet;
      }, 0),
    },
    {
      device: "computer",
      views: weeklyViewsPerDeviceDate.reduce((acc, day) => {
        return acc + day.devices.computer;
      }, 0),
    },
  ];

  return {
    props: {
      topProductsDay,
      topProductsWeek,
      totalViewsPerDay,
      weeklyViewsPerDevice,
    },
  };
}
