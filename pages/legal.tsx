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

        <div className="w-[90vw] mx-auto py-2">
        <div className={` overflow-hidden shadow-lg bg-gray-100 p-4`}>
            <p>Privacy Policy</p>
            <p>Your security is important to us. For this reason, the personal data you share with us is carefully protected.</p>
            <p>
              We, horecadepot, as the data controller, aim to inform you about which personal data will be processed for what purpose, with whom and why the
              processed data may be shared, our data processing methods and legal grounds, and what your rights regarding your processed data are, with this
              privacy and personal data protection policy.
            </p>
            <p>Collected Personal Data, Collection Method and Legal Basis</p>
            <p>
              Your IP address and user agent information will be collected, recorded, stored, and updated through automatic or non-automatic methods, and
              sometimes obtained from third parties such as analytical providers, advertising networks, search information providers, technology providers,
              through cookies and similar technologies, solely for the purpose of conducting analyses and based on the legitimate interest processing condition
              within the framework of our service and contractual relationship, and throughout its duration.
            </p>
            <p>Purpose of Processing Your Personal Data</p>
            <p>
              The personal data you share with us will be processed for the sole purpose of conducting analyses, to perform the requirements of the services we
              provide in the best way possible, to ensure that these services can be accessed by you and used to the fullest extent, to improve our services in
              accordance with your needs, to bring you together with more comprehensive service providers within legal frameworks, and to fulfill obligations
              arising from the law (sharing personal data with judicial and administrative authorities upon request), and it will be processed and updated in a
              manner that is appropriate and proportional to its purpose during the service and contractual period.
            </p>
            <p>To Whom and For What Purposes the Collected Personal Data Can be Transferred</p>
            <p>
              The personal data you share with us may be transferred, upon the condition that necessary technical and administrative measures are taken, to
              third parties and institutions and organizations both inside and outside the country with whom we have contractual relationships, with whom we
              collaborate, and from whom we receive services and/or provide services, and to judicial and administrative authorities upon request.
            </p>
            <p>Your Rights as a Data Subject Whose Personal Data is Processed</p>
            <p>
              In accordance with Product 11 of the Personal Data Protection Law, anyone can exercise the following rights by applying to the data controller:
            </p>
            <p>You have the right to:</p>
            <ul>
              <li>Know whether your personal data is being processed or not,</li>
              <li>Request information if your personal data has been processed,</li>
              <li>Learn about the purpose of processing your personal data and whether they are being used for their intended purpose,</li>
              <li>Know the third parties to whom your personal data are transferred, whether domestically or abroad,</li>
              <li>Request the correction of your personal data if they are incomplete or inaccurate,</li>
              <li>Request the deletion or destruction of your personal data,</li>
              <li>
                Request that the third parties notified of the operations performed in accordance with paragraphs (e) and (f) be informed of the personal data
                transfer,
              </li>
              <li>Object to the occurrence of a result against yourself by means of analyzing the processed data exclusively through automatic systems,</li>
              <li>Request compensation if you have suffered damage due to the processing of personal data in violation of the law.</li>
            </ul>
            <p>
              To exercise your rights mentioned above, you can contact us via{" "}
              <a data-fr-linked="true" href="mailto:info@horecadepot.be">
                info@horecadepot.be
              </a>
              .
            </p>
            <p>Contact</p>
            <p>
              In order to be able to provide you with services and perform analyses, only your necessary personal data will be processed in accordance with this
              privacy and personal data processing policy, and you are completely free to accept or reject this. If you continue to use the site, it will be
              assumed that you have accepted it by us, and please do not hesitate to contact us via the email address
              <a data-fr-linked="true" href="mailto:info@horecadepot.be">
                info@horecadepot.be
              </a>
              for more detailed information.
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
}
