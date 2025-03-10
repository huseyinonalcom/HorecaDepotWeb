import ContactForm from "../components/common/contactform";
import useTranslation from "next-translate/useTranslation";
import Layout from "../components/public/layout";
import Link from "next/link";
import Head from "next/head";
import { LuClock2, LuMail, LuMapPin, LuPhone } from "react-icons/lu";
import { FiCompass } from "react-icons/fi";
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
          {t("CONTACT")}
        </h1>
        <div className="flex h-[70px] flex-col justify-around">
          <div className="text-md flex flex-row items-center justify-center font-bold text-black">
            <Link href="/" className="duration-700 hover:text-white">
              {t("Home")}
            </Link>
            <p className="mx-2 font-bold">/</p>
            <p className="text-black underline decoration-black decoration-solid decoration-4 underline-offset-8">
              {t("Contact")}
            </p>
          </div>
        </div>
        <div className="mx-auto mb-2 flex flex-col items-center justify-center">
          <iframe
            className="-mt-2 mb-4 w-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16941.42168282978!2d4.334596753851341!3d50.86158286527999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c32a1a2325c3%3A0x7594491cb3de795a!2sHorecaDepot!5e0!3m2!1sen!2sbe!4v1708102395825!5m2!1sen!2sbe"
            height="450"
            loading="lazy"
          ></iframe>
          <div className="mb-6 grid w-[95%] grid-cols-1 gap-2 md:grid-cols-2">
            <div className="flex flex-col items-start gap-2 pb-4">
              <h2 className="ml-4 text-4xl font-bold text-[#363332]">
                {t("Contact")}
              </h2>
              <div className="flex flex-col gap-2 pl-2">
                <div className="flex flex-row">
                  <a
                    href="tel:+32499738373"
                    className="flex flex-row items-center gap-2"
                  >
                    <LuPhone className="h-9 w-9 p-1" color="black" />
                    <p>+32 499 73 83 73</p>
                  </a>
                </div>
                <div className="flex flex-row">
                  <a
                    href="mailto:info@horecadepot.be"
                    className="flex flex-row items-center gap-2"
                  >
                    <LuMail className="h-9 w-9 p-1" color="black" />
                    <p>info@horecadepot.be</p>
                  </a>
                </div>
                <div className="flex flex-row">
                  <a
                    target="blank"
                    href="https://www.google.com/maps/dir//HorecaDepot+Rue+de+Ribaucourt+154+1080+Bruxelles/@50.8618074,4.3429586,13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x47c3c32a1a2325c3:0x7594491cb3de795a!2m2!1d4.3429586!2d50.8618074?entry=ttu"
                    className="flex flex-row items-center gap-2"
                  >
                    <LuMapPin className="h-9 w-9 p-1" color="black" />
                    <p>
                      Rue de Ribaucourtstraat 154
                      <br />
                      1080 Bruxelles - Brussel
                    </p>
                  </a>
                </div>

                <Link
                  href="/parking"
                  className="flex flex-row  items-center gap-2"
                >
                  <FiCompass className="h-9 w-9 p-1" color="black" />
                  <p>{t("parking")}</p>
                </Link>

                <div className="flex flex-row items-center gap-2">
                  <LuClock2 className="h-9 w-9 p-1" color="black" />
                  <p>
                    {t("opening_hours_a")}
                    <br />
                    {t("opening_hours_b")}
                  </p>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </Layout>
    </>
  );
}
