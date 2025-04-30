import StockLayout from "../../components/stock/StockLayout";
import Orders from "../admin/orders";

export default function OrdersStock() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Orders href="/stock/order/" />
    </div>
  );
}

OrdersStock.getLayout = function getLayout(page: React.ReactNode) {
  return <StockLayout>{page}</StockLayout>;
};
