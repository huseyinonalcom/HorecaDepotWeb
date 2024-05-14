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

      <h1 className="pt-2 text-center text-4xl font-bold">
        {t("Who are we?")}
      </h1>
      <div className="flex h-[70px] flex-col justify-around">
        <div className="text-md flex flex-row items-center justify-center font-bold text-black">
          <Link href="/" className="duration-700">
            {t("Home")}
          </Link>
          <p className="mx-2 font-bold">/</p>
          <p className="underline decoration-black decoration-solid decoration-4 underline-offset-8">
            {t("Who we are")}
          </p>
        </div>
      </div>
      <div className="flex w-full flex-col items-center pt-4">
        <div className="grid w-full grid-cols-1 pt-4 lg:grid-cols-2">
          <iframe
            className="mx-auto mb-4 lg:mb-0"
            style={{ width: "85%", height: "auto", aspectRatio: "16/9" }}
            src="https://www.youtube-nocookie.com/embed/N1gsXFDIGrM?autoplay=1&controls=0&showinfo=0&loop=1&mute=1&playlist=N1gsXFDIGrM"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>

          <div className="flex w-full flex-col items-center justify-center p-4 lg:items-start">
            <div className="flex max-w-[640px] flex-col gap-4 text-justify font-semibold">
              <h2 className="text-3xl font-bold">À PROPOS DE NOUS</h2>
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
              <p className="border-l-2 border-black pl-4 text-lg">
                Meilleur prix pour hotel, restaurant, cafe et vous.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
