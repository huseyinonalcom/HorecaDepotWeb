import { AppProps } from "next/app";
import "../global.css";
import { CategoryProvider } from "../api/providers/categoryProvider";
import { AdminDrawerProvider } from "../api/providers/adminDrawerProvider";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CategoryProvider>
      <AdminDrawerProvider>
        <Component {...pageProps} />
      </AdminDrawerProvider>
    </CategoryProvider>
  );
}
