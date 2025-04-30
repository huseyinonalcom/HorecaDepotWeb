import StockLayout from "../../../components/stock/StockLayout";
import { useRouter } from "next/router";
import Order from "../../admin/order";

export default function ReservationStock() {
  const router = useRouter();

  return (
    <>
      <Order id={Number(router.query.id)} />
    </>
  );
}

ReservationStock.getLayout = function getLayout(page: React.ReactNode) {
  return <StockLayout>{page}</StockLayout>;
};
