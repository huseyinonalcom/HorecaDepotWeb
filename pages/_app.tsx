import { AppProps } from "next/app";
import "../global.css";
import { CategoryProvider } from "../api/providers/categoryProvider";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CategoryProvider>
      <Component {...pageProps} />
    </CategoryProvider>
  );
}
