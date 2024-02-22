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
        <h1 className="font-bold text-4xl bg-black text-white text-center pt-2">
          {t("CONTACT")}
        </h1>
        <div className="h-[70px] bg-black shadow-lg flex flex-col justify-around">
          <div className="flex flex-row text-md font-bold items-center justify-center text-gray-300">
            <Link href="/" className="hover:text-white duration-700">
              {t("Home")}
            </Link>
            <p className="font-bold mx-2">/</p>
            <p className="underline decoration-solid decoration-orange-400 decoration-4 underline-offset-8 text-white">
              {t("Contact")}
            </p>
          </div>
        </div>
        <div className="flex flex-col mx-auto justify-center items-center mb-2">
          <iframe
            className="w-full mb-4 -mt-2"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16941.42168282978!2d4.334596753851341!3d50.86158286527999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c32a1a2325c3%3A0x7594491cb3de795a!2sHorecaDepot!5e0!3m2!1sen!2sbe!4v1708102395825!5m2!1sen!2sbe"
            height="450"
            loading="lazy"
          ></iframe>
          <div className="w-[95%] grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="items-start border-b-4 pb-4 md:pb-0 border-black md:border-none flex flex-col gap-2">
              <h2 className="text-5xl ml-4 font-bold text-[#363332]">
                {t("Contact")}
              </h2>
              <div className="flex flex-col pl-2 gap-2">
                <div className="flex text-xl flex-row items-center gap-2">
                  <Phone
                    className="h-10 w-10 border-2 p-1 border-[#6e6b6a]"
                    color="#6e6b6a"
                  />
                  <p>+32 499 73 83 73</p>
                </div>
                <div className="flex text-xl flex-row items-center gap-2">
                  <Mail
                    className="h-10 w-10 border-2 p-1 border-[#6e6b6a]"
                    color="#6e6b6a"
                  />
                  <p>info@horecadepot.be</p>
                </div>
                <div className="flex text-xl flex-row items-center gap-2">
                  <Briefcase
                    className="h-10 w-10 border-2 p-1 border-[#6e6b6a]"
                    color="#6e6b6a"
                  />
                  <p>
                    Rue de Ribaucourt 154
                    <br />
                    1080 Bruxelles
                  </p>
                </div>
                <div className="flex text-xl flex-row items-center gap-2">
                  <Clock
                    className="h-10 w-10 border-2 p-1 border-[#6e6b6a]"
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
