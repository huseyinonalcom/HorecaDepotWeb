import { Briefcase, Clock, Mail, Phone } from "react-feather";
import ContactForm from "../components/common/contactform";
import useTranslation from "next-translate/useTranslation";
import Layout from "../components/public/layout";
import Link from "next/link";
import Head from "next/head";

export default function Contact() {
  const { t, lang } = useTranslation("common");
  return (
    <>
      <Layout>
        <Head>
          <title>Horeca Depot</title>
          <meta name="description" content="" />
          <meta name="language" content={lang} />
        </Head>
        <h1 className="bg-black pt-2 text-center text-4xl font-bold text-white">
          {t("CONTACT")}
        </h1>
        <div className="flex h-[70px] flex-col justify-around bg-black shadow-lg">
          <div className="text-md flex flex-row items-center justify-center font-bold text-gray-300">
            <Link href="/" className="duration-700 hover:text-white">
              {t("Home")}
            </Link>
            <p className="mx-2 font-bold">/</p>
            <p className="text-white underline decoration-white decoration-solid decoration-4 underline-offset-8">
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
          <div className="grid w-[95%] grid-cols-1 gap-2 md:grid-cols-2">
            <div className="flex flex-col items-start gap-2 border-b-4 border-black pb-4 md:border-none md:pb-0">
              <h2 className="ml-4 text-5xl font-bold text-[#363332]">
                {t("Contact")}
              </h2>
              <div className="flex flex-col gap-2 pl-2">
                <a href="tel:+32499738373" className="flex flex-row items-center gap-2 text-xl">
                  <Phone
                    className="h-10 w-10 border-2 border-[#6e6b6a] p-1"
                    color="#6e6b6a"
                  />
                  <p>+32 499 73 83 73</p>
                </a>
                <a href="mailto:info@horecadepot.be" className="flex flex-row items-center gap-2 text-xl">
                  <Mail
                    className="h-10 w-10 border-2 border-[#6e6b6a] p-1"
                    color="#6e6b6a"
                  />
                  <p>info@horecadepot.be</p>
                </a>
                <a target="blank" href="https://www.google.com/maps/dir//HorecaDepot+Rue+de+Ribaucourt+154+1080+Bruxelles/@50.8618074,4.3429586,13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x47c3c32a1a2325c3:0x7594491cb3de795a!2m2!1d4.3429586!2d50.8618074?entry=ttu" className="flex flex-row items-center gap-2 text-xl">
                  <Briefcase
                    className="h-10 w-10 border-2 border-[#6e6b6a] p-1"
                    color="#6e6b6a"
                  />
                  <p>
                    Rue de Ribaucourt 154
                    <br />
                    1080 Bruxelles
                  </p>
                </a>
                <div className="flex flex-row items-center gap-2 text-xl">
                  <Clock
                    className="h-10 w-10 border-2 border-[#6e6b6a] p-1"
                    color="#6e6b6a"
                  />
                  <p>
                    Lundi - Samedi: 09:30 - 19:00
                    <br />
                    Dimanche fermé (sur rendez-vous)
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
