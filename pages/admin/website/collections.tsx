import { useEffect, useState } from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import AdminLayout from "../../../components/admin/adminLayout";
import componentThemes from "../../../components/componentThemes";
import CollectionPreview from "../../../components/admin/collection-preview";
import Link from "next/link";

export default function Collections() {
  const { t, lang } = useTranslation("common");

  const [collections, setCollections] = useState(null);

  const fetchCollections = async () => {
    const fetchCollectionRequest = await fetch(
      "/api/collections/public/getcollections",
      {
        method: "GET",
      },
    );
    if (fetchCollectionRequest.ok) {
      const fetchCollectionAnswer = await fetchCollectionRequest.json();
      setCollections(fetchCollectionAnswer);
      return fetchCollectionAnswer;
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (!collections) {
      const fetchAndSetCollections = async () => {
        setCollections(await fetchCollections());
      };
      fetchAndSetCollections();
    }
  }, []);

  return (
    <>
      <Head>
        <title>Website</title>
        <meta name="language" content={lang} />
      </Head>
      <div className="mx-auto flex w-[95%] flex-col items-center p-2">
        <div className="flex flex-row">
          <Link
            className={componentThemes.greenSubmitButton}
            href={"/admin/website/collection"}
          >
            {t("New Collection")}
          </Link>
        </div>
        {collections && (
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            {collections.map((collection) => (
              <CollectionPreview key={collection.id} collection={collection} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

Collections.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
