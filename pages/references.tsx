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

      <h1 className="bg-black pt-2 text-center text-4xl font-bold text-white">
        {t("Our references")}
      </h1>
      <div className="flex h-[70px] flex-col justify-around bg-black shadow-lg">
        <div className="text-md flex flex-row items-center justify-center font-bold text-gray-300">
          <Link href="/" className="duration-700 hover:text-white">
            {t("Home")}
          </Link>
          <p className="mx-2 font-bold">/</p>
          <p className="text-white underline decoration-white decoration-solid decoration-4 underline-offset-8">
            {t("References")}
          </p>
        </div>
      </div>
      <div className="mx-auto mb-2 flex w-[95%] flex-col items-center justify-center bg-white p-3 shadow-md">
        <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {images.map((image, index) => (
            <div key={index} className="relative min-h-[200px] min-w-[200px]">
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
    "references",
  );
  const filenames = fs.readdirSync(directoryPath);

  const images = filenames.map((filename) => `/assets/references/${filename}`);

  return {
    props: {
      images,
    },
  };
}
