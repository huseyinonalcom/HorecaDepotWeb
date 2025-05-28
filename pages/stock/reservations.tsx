import StockLayout from "../../components/stock/StockLayout";
import Reservations from "../admin/reservations";

export default function ReservationsStock() {
  return (
    <div className="p-4">
      <Reservations href="/stock/reservation/" />
    </div>
  );
}

ReservationsStock.getLayout = function getLayout(page: React.ReactNode) {
  return <StockLayout>{page}</StockLayout>;
};
