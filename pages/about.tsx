import useTranslation from "next-translate/useTranslation";
import Layout from "../components/public/layout";
import Link from "next/link";
import Head from "next/head";

export default function About() {
  const { t, lang } = useTranslation("common");
  return (
    <Layout>
      <Head>
        <title>Horeca Depot</title>
        <meta name="description" content="" />
        <meta name="language" content={lang} />
      </Head>

      <h1 className="font-bold text-4xl bg-black text-white text-center pt-2">
        {t("Who are we?")}
      </h1>
      <div className="h-[70px] bg-black shadow-lg flex flex-col justify-around">
        <div className="flex flex-row text-md font-bold items-center justify-center text-gray-300">
          <Link href="/" className="hover:text-white duration-700">
            {t("Home")}
          </Link>
          <p className="font-bold mx-2">/</p>
          <p className="underline decoration-solid decoration-orange-400 decoration-4 underline-offset-8 text-white">
            {t("Who we are")}
          </p>
        </div>
      </div>
      <div className="flex flex-col pt-4 items-center w-full">
        <div className="grid w-full pt-4 grid-cols-1 lg:grid-cols-2">
          <iframe
            className="mx-auto mb-4 lg:mb-0"
            style={{ width: "85%", height: "auto", aspectRatio: "16/9" }}
            src="https://www.youtube-nocookie.com/embed/N1gsXFDIGrM?autoplay=1&controls=0&showinfo=0&loop=1&mute=1&playlist=N1gsXFDIGrM"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>

          <div className="flex flex-col items-center justify-center lg:items-start w-full p-4">
            <div className="flex flex-col font-semibold max-w-[640px] text-justify gap-4">
              <h2 className="font-bold text-3xl">À PROPOS DE NOUS</h2>
              <p className="text-lg">
                Depuis 1980, nous sommes une entreprise qui vend des produits en
                gros ou au détail. Nous hébergeons deux sociétés différentes
                nommées Horeca Depot et TK Architecture.
              </p>
              <p className="text-lg">
                À partir de vos plans, nous fabriquons vos meubles en quelques
                semaines sur mesure et au centimètre près. Nous pouvons
                également vous conseiller sur le choix des chaises ou tables en
                harmonie avec vos banquettes.
              </p>
              <p className="text-lg">
                Nos prix sont les moins chers de Belgique. Regardez-vous notre
                produits et projets. Appelez pour un rendez-vous ou envoyez un
                email.
              </p>
              <p className="text-lg border-l-2 border-orange-500 pl-4">
                Meilleur prix pour hotel, restaurant, cafe et vous.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
