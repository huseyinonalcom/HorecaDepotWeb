import useTranslation from "next-translate/useTranslation";
import Layout from "../components/public/layout";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import path from "path";
import fs from "fs";

type Props = {
  images: string[];
};

export default function References({ images }: Props) {
  const { t, lang } = useTranslation("common");
  return (
    <Layout>
      <Head>
        <title>Horeca Depot</title>
        <meta name="description" content="" />
        <meta name="language" content={lang} />
      </Head>

      <h1 className="font-bold text-4xl bg-black text-white text-center pt-2">
        {t("Nos références")}
      </h1>
      <div className="h-[70px] bg-black shadow-lg flex flex-col justify-around">
        <div className="flex flex-row text-md font-bold items-center justify-center text-gray-300">
          <Link href="/" className="hover:text-white duration-700">
            {t("Home")}
          </Link>
          <p className="font-bold mx-2">/</p>
          <p className="underline decoration-solid decoration-orange-400 decoration-4 underline-offset-8 text-white">
            {t("Références")}
          </p>
        </div>
      </div>
      <div className="flex flex-col mx-auto w-[95%] justify-center items-center mb-2 bg-white shadow-md p-3">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {images.map((image, index) => (
            <div key={index} className="relative min-w-[200px] min-h-[200px]">
              <Image
                sizes="(max-width: 768px) 95vw, (max-width: 1024px) 48vw, 20vw"
                src={image}
                fill
                style={{ objectFit: "contain" }}
                alt={`${image.split(".")[0]}`}
              />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const directoryPath = path.join(
    process.cwd(),
    "public",
    "assets",
    "references"
  );
  const filenames = fs.readdirSync(directoryPath);

  const images = filenames.map((filename) => `/assets/references/${filename}`);

  return {
    props: {
      images,
    },
  };
}
