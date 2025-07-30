import CollectionPreview from "../../../components/admin/collection-preview";
import AdminPanelLayout from "../../../components/admin/AdminPanelLayout";
import useTranslation from "next-translate/useTranslation";
import { PlusIcon } from "@heroicons/react/24/outline";
import Card from "../../../components/universal/Card";
import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";

export default function Collections() {
  const { t, lang } = useTranslation("common");

  const [collections, setCollections] = useState(null);

  const fetchCollections = async () => {
    const fetchCollectionRequest = await fetch("/api/private/collections", {
      method: "GET",
    });
    if (fetchCollectionRequest.ok) {
      const fetchCollectionAnswer = await fetchCollectionRequest.json();
      setCollections(fetchCollectionAnswer.data);
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
        <title>{t("collections")}</title>
      </Head>
      <Card>
        <h1 className="text-3xl font-bold">{t("collections")}</h1>
        <div className="mx-auto flex w-[95%] flex-col items-center gap-3 p-2">
          <div className="flex flex-row">
            <Link
              className="mt-2 flex w-full flex-row gap-2 border-1 border-black px-2 py-2 font-bold text-black duration-300 hover:bg-neutral-200"
              href="/admin/website/collection"
            >
              {t("New Collection")} <PlusIcon height={24} width={24} />
            </Link>
          </div>
          {collections && (
            <div className="grid w-full grid-cols-1 flex-col gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="rounded-md border-2 border-gray-500 bg-white"
                >
                  <CollectionPreview collection={collection} />
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </>
  );
}

Collections.getLayout = function getLayout(children) {
  const { t } = useTranslation("common");
  return (
    <AdminPanelLayout title={t("collections")}>{children}</AdminPanelLayout>
  );
};
