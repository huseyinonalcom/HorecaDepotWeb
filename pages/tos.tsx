import Layout from "../components/public/layout";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";

export default function Legal() {
  const { lang } = useTranslation("common");
  return (
    <>
      <Layout>
        <Head>
          <title>horecadepot</title>
          <meta name="description" content="horecadepot" />
          <meta name="language" content={lang} />
        </Head>

        <div className="mx-auto w-full py-2">
          <div
            className={`flex flex-col gap-3 overflow-hidden bg-gray-100 p-4 shadow-lg`}
          >
            <p>Article 1 : Identité de l’entrepreneur</p>
            <p>ATK BVBA agissant sous la dénomination: Horeca Depot</p>
            <p>L’adresse: Rue de Ribaucourt 154, 1080, Bruxelles</p>
            <p>Tél: +32 499 73 83 73 (du lundi au vendredi entre 10h et 18h)</p>
            <p>Adresse e-mail : info@horecadepot.be</p>
            <p>N° identification à la TVA-BTW BE 0696.624.603</p>
            <p>Article 2 : Généralités et définitions</p>
            <p>Dans les présentes conditions générales, on entend par:</p>
            <p>
              1. Entrepreneur : la personne morale mentionnée à l’article 1;
            </p>
            <p>
              2. Consommateur : la personne physique qui n’agit pas à des fins
              qui entre dans le cadre de son activité professionnelle ou de son
              entreprise et qui conclut un contrat à distance avec
              l’entrepreneur;
            </p>
            <p>
              3. Contrat à distance: un contrat à l’occasion duquel, dans le
              cadre d’un système de vente à distance de biens et/ou de services
              organisé par l’entrepreneur, il est fait exclusivement usage d’une
              ou de plusieurs techniques de communication à distance jusqu’à la
              conclusion du contrat, y compris ladite conclusion;
            </p>
            <p>
              4. Technique de communication à distance : moyen qui peut être
              utilisé pour la conclusion d’un contrat, sans que le consommateur
              et l’entrepreneur ne soient réunis en même temps en un même
              endroit.
            </p>
            <p>
              5. Délai de réflexion : le délai endéans lequel le consommateur
              peut faire usage de son droit de rétractation;
            </p>
            <p>
              6. Droit de rétractation : la possibilité pour le consommateur de
              renoncer, durant le délai de réflexion, au contrat à distance;
            </p>
            <p>7. Jour : jour de calendrier;</p>
            <p>
              8. Support de données durable: tout moyen permettant au
              consommateur ou à l’entrepreneur de sauvegarder des informations
              qui lui sont adressées personnellement d’une manière permettant la
              consultation à l’avenir ainsi que la reproduction à l’identique
              des informations stockées.
            </p>
            <p>Article 3 : Applicabilité</p>
            <p>
              Ces conditions générales sont applicables à toute offre de
              l’entrepreneur et à tout contrat à distance intervenus entre
              l’entrepreneur et le consommateur.
            </p>
            <p>
              Avant que le contrat à distance ne soit conclu, le texte de ces
              conditions générales est mis à la disposition du consommateur. Si
              ceci n’est pas possible raisonnablement, avant que le contrat à
              distance soit conclu, on indiquera que les conditions générales
              sont à consulter chez l’entrepreneur et que, sur demande du
              consommateur, elles sont envoyées sans frais aussi vite que
              possible.
            </p>
            <p>Article 4 : L’offre</p>
            <p>
              Si une offre a une durée de validité limitée ou se fait sous
              conditions, cela est expressément mentionné dans l’offre.
            </p>
            <p>
              1. L’offre contient une description complète et précise des biens
              et/ou des services offerts. La description est suffisamment
              détaillée pour permettre une bonne appréciation de l’offre par le
              consommateur. Si l’entrepreneur fait usage d’illustrations,
              celles-ci constituent une reproduction fidèle des biens et/ou des
              services offerts. Des erreurs ou fautes manifestes dans l’offre
              n’engagent pas l’entrepreneur.
            </p>
            <p>
              2. Chaque offre contient les informations nécessaires afin que le
              consommateur soit parfaitement au courant des droits et des
              obligations qui sont liés à l’acceptation de l’offre. Il s’agit en
              particulier:
            </p>
            <p>• du prix, toutes taxes comprises;</p>
            <p>
              • de la manière dont le contrat se conclura et quelles sont les
              actes qui sont nécessaires à cet effet;
            </p>
            <p>• de l’application ou non du droit de rétractation;</p>
            <p>• des modalités de paiement, de livraison du contrat;</p>
            <p>
              • du délai de validité de l’offre, ainsi que du délai pendant
              lequel le prix est maintenu;
            </p>
            <p>
              • le tarif de la communication à distance, lorsque les coûts liés
              à l’utilisation de la technique de la communication à distance
              sont calculés sur une base autre que le tarif de base;
            </p>
            <p>
              • si le contrat est archivé après avoir été conclu, de quelle
              manière celui-ci peut être consulté par le consommateur;
            </p>
            <p>
              • de la manière dont le consommateur peut être informé, avant la
              conclusion du contrat, des opérations qu’il ne souhaite pas, de
              même que la manière dont il peut y remédier avant que le contrat
              ne soit conclu;
            </p>
            <p>
              • du fait que le contrat peut être conclu en néerlandais ou en
              français, au choix du consommateur. L’échange de données après se
              passera aussi dans une de ces deux langues. Le consommateur ne
              pourra pas invoquer le fait qu’il ne maîtrise pas assez la langue
              choisie pour solliciter la non-applicabilité d’une ou de plusieurs
              conditions;
            </p>
            <p>Article 5 : Le contrat</p>
            <p>
              Le contrat est conclu, sous réserve qui est précisé à l’alinéa 4,
              au moment de l’acceptation de l’offre par le consommateur et de la
              satisfaction des conditions qui y sont reprises.
            </p>
            <p>
              1. Si le consommateur a accepté l’offre par voie électronique,
              l’entrepreneur confirme sans délai par voie électronique la
              réception de l’acceptation de l’offre. Tant que la réception de
              cette acceptation n’est pas confirmée, le consommateur peut
              résilier le contrat.
            </p>
            <p>
              2. Si le contrat est conclu par voie électronique, l’entrepreneur
              prend les mesures techniques et organisationnelles qui s’imposent
              pour sécuriser le transfert électronique des données et il veille
              à assurer un environnement web sécurisé. Si le consommateur peut
              payer par voie électronique, l’entrepreneur prendra les mesures de
              sécurité adaptées à cet effet.
            </p>
            <p>
              3. L’entrepreneur peut se mettre au courant – dans les cadres
              légales – du fait si le consommateur peut répondre à ses
              obligations de paiement, ainsi de tous ces faits et facteurs qui
              sont importants pour conclure de manière responsable un contrat à
              distance. Si, sur base de cet examen, l’entrepreneur a de bonnes
              causes pour ne pas entamer le contrat, il a le droit de, avec
              motivation, refuser une commande ou demande ou de lier des
              conditions extraordinaires à son exécution.
            </p>
            <p>
              4. L’entrepreneur enverra le bien ou service au consommateur la
              confirmation des informations suivantes, par écrit ou d’une
              manière telle que celle-ci puisse être sauvegardée de manière
              accessible par le consommateur, sur un support de données durable:
            </p>
            <p>
              a. l’adresse géographique de l’établissement de l’entrepreneur où
              le consommateur peut présenter ses réclamations;
            </p>
            <p>
              b. les conditions sous lesquelles et la façon dont le consommateur
              peut faire usage de son droit de rétractation, ainsi qu’une
              mention claire de ce qui est exclu de son droit de rétractation;
            </p>
            <p>
              c. les informations relatives aux services après-vente et aux
              garanties;
            </p>
            <p>Article 6 : Le prix</p>
            <p>
              Sous réserve de modification de prix suite à des changements des
              tarifs de la TVA, les prix des biens et/ou des services mentionnés
              dans l’offre ne sont pas augmentés pendant la durée de validité.
            </p>
            <p>
              1. Par dérogation à l’alinéa précédent, l’entrepreneur peut offrir
              des biens ou services dont les prix sont liés aux variations sur
              le marché financier et sur lesquels l’entrepreneur n’a pas
              d’influence à des prix variables. Ce lien aux variations du marché
              et le fait que les prix mentionnés sont éventuellement des prix
              indicatifs sont mentionnés dans l’offre.
            </p>
            <p>
              2. Des augmentations de prix dans les trois mois après la
              formation du contrat ne sont autorisées que si elles sont la
              conséquence de réglementations ou de dispositions légales.
            </p>
            <p>
              3. Des augmentations de prix à partir de trois mois après la
              conclusion du contrat ne sont autorisées que si l’entrepreneur l’a
              stipulé et:
            </p>
            <p>
              a. qu’elles sont la conséquence de réglementation ou de
              dispositions légales ; ou
            </p>
            <p>
              b. que le consommateur a le pouvoir de résilier le contrat au jour
              où l’augmentation du prix prend effet.
            </p>
            <p>
              4. Les prix indiqués dans l’offre de biens ou de services sont TVA
              comprise, frais de livraison à domicile exclues.
            </p>
            <p>Article 7 : Conformité et Garantie</p>
            <p>
              L’entrepreneur garantit que les biens et/ou les services satisfont
              au contrat, aux spécifications mentionnées dans l’offre, aux
              exigences raisonnables de qualité et/ou d’utilité, ainsi qu’aux
              dispositions légales et/ou aux prescriptions des autorités qui
              existent à la date de la conclusion du contrat.
            </p>
            <p>
              Un régime de garantie offert par l’entrepreneur, le fabriquant ou
              l’importateur ne porte pas préjudice aux droits et créances que le
              consommateur peut faire valoir à l’égard de l’entrepreneur en
              raison d’un manquement dans l’exécution des obligations de
              l’entrepreneur, sur base de la loi et/ou du contrat à distance.
            </p>
            <p>Article 8 : Livraison et exécution</p>
            <p>
              L’entrepreneur prendra et réalisera les commandes de biens et
              appréciera les demandes de service à effectuer avec la plus grande
              minutie.
            </p>
            <p>
              1. Le lieu de livraison sera l’adresse que le consommateur a
              communiquée à l’entreprise.
            </p>
            <p>
              2. En tenant compte de ce qui est mentionné ci-avant à l’article 4
              des présentes conditions générales, l’entreprise exécutera les
              commandes acceptées dans les plus brefs délais et au plus tard
              dans les trente jours, sauf si un délai de livraison plus long a
              été convenu. Au cas où la livraison prendrait du retard ou au cas
              où une livraison ne pourrait pas, ou seulement partiellement, être
              effectuée, le consommateur en recevra communication au plus tard
              un mois après avoir placé sa commande. Dans ce cas, le
              consommateur a le droit de résilier le contrat sans frais et il a
              droit à d’éventuels dommages et intérêts.
            </p>
            <p>
              3. En cas de résiliation conformément à l’alinéa précédent,
              l’entrepreneur remboursera les montants que le consommateur a payé
              le plus vite possible, mais au plus tard dans les quatorze jours
              après la résiliation.
            </p>
            <p>
              4. Au cas où la livraison d’un bien commandé s’avérerait
              impossible, l’entrepreneur fera tout ce qui est en son pouvoir
              afin de mettre un article de substitution à disposition du
              consommateur. Au plus tard au moment de la livraison, il sera
              indiqué clairement et intelligiblement que c’est un article de
              substitution qui est livré. Le droit de rétractation ne peut pas
              être exclu pour les articles de substitution. Les frais de renvoi
              sont à charge de l’entrepreneur.
            </p>
            <p>
              5. Sauf s’il en a expressément été convenu autrement, les risques
              de dommages et/ou de pertes de marchandises sont, jusqu’au moment
              de la livraison au consommateur, à la charge de l’entrepreneur.
            </p>
            <p>
              6. L’entrepreneur prendra contact avec le consommateur concernant
              la suite du traitement de son contrat à distance.
            </p>
            <p>Article 9 : Paiement</p>
            <p>
              Pour autant qu’une date plus tardive n’ait pas été convenue, les
              montants dus par le consommateur doivent être acquittés lors de la
              livraison du bien. Le consommateur peut payer par Virement
              Bancaire.
            </p>
            <p>
              Le consommateur est tenu de communiquer sans délai à
              l’entrepreneur toutes les erreurs dans les données de paiement
              communiquées ou indiquées. En cas de défaut de paiement du
              consommateur sous réserve des restrictions légales, l’entrepreneur
              a le droit de requérir au consommateur le paiement de frais
              raisonnables, formulés au consommateur d’avance.
            </p>
            <p>Article 10 : Transfert de propriété</p>
            <p>
              Les marchandises restent la propriété de l’entrepreneur jusqu’à
              leur paiement complet. Le risque de perte ou de dommage passe sur
              le client à partir de la réception des biens.
            </p>
            <p>Article 11 : Régime des réclamations</p>
            <p>
              1. Des plaintes sur l’exécution du contrat doivent être soumises
              auprès de l’entrepreneur dans les délais légaux, par écrit,
              complètement et clairement décrit.
            </p>
            <p>
              2. Des plaintes éventuelles sur le transport doivent être soumises
              par écrit dans les sept jours calendriers après réception des
              biens.
            </p>
            <p>
              3. Les réclamations introduites auprès de l’entrepreneur reçoivent
              une réponse dans un délai de quinze jours à compter de la date de
              réception. Si une réclamation demande un temps de traitement
              prévisible plus long, l’entrepreneur répond dans un délai de
              quatorze jours par un avis de réception et une indication du
              moment où le consommateur peut attendre une réponse plus
              détaillée.
            </p>
            <p>
              4. Si la plainte ne peut pas être résolue en concertation
              réciproque, un litige nait qui est susceptible au règlement des
              litiges.
            </p>
            <p>Article 12 – Vie privée</p>
            <p>
              L’enregistrement de données se passe conformément à la législation
              en vigueur. Le client peut retrouver plus d’information sous la
              rubrique Vie privée.
            </p>
            <p>Article 13 – Preuve</p>
            <p>
              Toutes les parties concernées acceptent l’administration de la
              preuve électronique (e-mail et backup).
            </p>
            <p>Article 14 : Litiges</p>
            <p>
              Seulement le droit belge est applicable sur les conditions
              générales présentes et les conséquences juridiques qui en
              résultent. Tous les litiges pouvant donner lieu aux conditions
              générales actuelles, ressortent sous la compétence exclusive de
              l’arrondissement judiciaire d’Anvers, n’importe quelle façon de
              paiement ou de livraison. Les parties acceptent toutefois
              qu’Anvers est l’endroit où les obligations en raison de la
              livraison par l’entrepreneur au consommateur naissent, ceci dans
              le sens de l’article 624, 2° Code Judiciaire.
            </p>
            <p>Article 15 : Modification des conditions générales</p>
            <p>
              Les conditions de vente peuvent à tout temps et sans communication
              au préalable être modifiées. La nullité de n’importe quelle
              disposition de ces conditions n’aura aucune influence sur la
              validité des autres dispositions de ces conditions et ne mènera
              pas à la nullité de ces dispositions. Le consommateur reconnait
              qu’il a lu ces conditions générales en ligne et déclare d’accepter
              toutes les stipulations, conditions et prix.
            </p>
            <p>
              Ces conditions générales sont valables à partir du 30/04/2020.
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
}
