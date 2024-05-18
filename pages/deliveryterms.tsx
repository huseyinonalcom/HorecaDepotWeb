import Layout from "../components/public/layout";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";

export default function Legal() {
  const { t, lang } = useTranslation("common");
  return (
    <>
      <Layout>
        <Head>
          <title>horecadepot</title>
          <meta name="description" content="horecadepot" />
          <meta name="language" content={lang} />
        </Head>

        <div className="mx-auto w-full py-2">
          <div className={`flex flex-col gap-3 bg-gray-100 p-4 shadow-lg`}>
            <h2 className="text-lg font-bold">Conditions de livraison</h2>
            <h3 className="font-semibold">-Livraison de la commande-</h3>
            <p>
              Livré par nos propres moyens : la marchandise arrive jusqu’à
              l’adresse qui nous a été communiquer par le client et déposer au
              rez-de-chaussée à l’entrée du bâtiment, si l’entrée n’est pas
              assez grande, la marchandise sera alors déposée devant l’entrée.
            </p>
            <p>
              Livré par un transporteur externe : la marchandise est toujours
              déposer uniquement devant l’entrée du magasin.
            </p>
            <p>
              Les délais de livraison indiqués par le vendeur ne sont fournis
              qu’à titre indicatif et ne lient pas le vendeur. Un retard dans la
              livraison de la commande de pourra donc en aucun cas donner lieu à
              une quelconque indemnité, résolution du contrat, suspension des
              obligations du client, ni au paiement de dommages et intérêts.
            </p>
            <p>
              La commande n’est livrée au client qu’après son complet paiement.
              Le transfert de la propriété et de la charge des risques s’opère
              au moment où la commande est entièrement payée. Le client est par
              conséquent avisé du fait qu’il supporte seul la charge des risques
              liés à la livraison.
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
}
