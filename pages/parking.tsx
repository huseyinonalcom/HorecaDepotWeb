import useTranslation from "next-translate/useTranslation";
import Layout from "../components/public/layout";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

import parking from "../public/assets/img/parking.jpg";
import parking2 from "../public/assets/img/parking2.jpg";

export default function Contact() {
  const { t, lang } = useTranslation("common");
  return (
    <>
      <Layout>
        <Head>
          <title>Horeca Depot</title>
          <meta name="description" />
          <meta name="language" content={lang} />
        </Head>
        <h1 className="pt-2 text-center text-4xl font-bold text-black">
          {t("PARKING")}
        </h1>
        <div className="flex h-[70px] flex-col justify-around">
          <div className="text-md flex flex-row items-center justify-center font-bold text-black">
            <Link href="/" className="duration-700 hover:text-white">
              {t("Home")}
            </Link>
            <p className="mx-2 font-bold">/</p>
            <p className="text-black underline decoration-black decoration-solid decoration-4 underline-offset-8">
              {t("Parking")}
            </p>
          </div>
        </div>
        <div className="mx-auto mb-2 flex flex-col items-center justify-center">
          <iframe
            className="-mt-2 mb-4 w-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d882.1783439556756!2d4.342801144335436!3d50.86582509938612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c36b49d67a1f%3A0xf95cd1024157cd44!2sT%26T%20Parklane%20Parking!5e0!3m2!1sen!2str!4v1730747984629!5m2!1sen!2str"
            height="450"
            loading="lazy"
          ></iframe>
          <div className="mb-6 grid w-[95%] grid-cols-1 gap-2 md:grid-cols-2">
            <Image src={parking} alt={"Parking Entrance Image"} />
            <Image src={parking2} alt={"Parking Interior Image"} />
          </div>
        </div>
      </Layout>
    </>
  );
}
