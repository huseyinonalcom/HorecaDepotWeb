import TextareaOutlined from "../../../../components/inputs/textarea_outlined";
import AdminPanelLayout from "../../../../components/admin/AdminPanelLayout";
import { uploadFileToAPI } from "../../../api/private/files/uploadfile";
import InputOutlined from "../../../../components/inputs/outlined";
import ImageWithURL from "../../../../components/common/image";
import { Button } from "../../../../components/styled/button";
import useTranslation from "next-translate/useTranslation";
import { getBanners } from "../../../api/private/banners";
import { TrashIcon } from "@heroicons/react/24/outline";
import { FiCheck } from "react-icons/fi";
import { useRouter } from "next/router";
import { useState } from "react";
import Head from "next/head";

export default function BannerEdit(props) {
  const { t, lang } = useTranslation("common");
  const { banner } = props;
  const [editedBanner, setEditedBanner] = useState(banner);
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{t("banner")}</title>
      </Head>
      <div className="flex w-full flex-row justify-end">
        <Button
          onClick={() => {
            confirm(t("delte-banner-confirm")) &&
              fetch(`/api/private/banners?id=${banner.id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              }).then((res) => {
                router.push("/admin/website/banners");
              });
          }}
        >
          <TrashIcon style={{ color: "red" }} />
        </Button>
      </div>
      <div className={`flex items-center justify-center bg-white`}>
        <div className="flex flex-wrap items-center justify-center gap-12 p-4">
          {["en", "nl", "fr", "de"].map((lang) => (
            <div className="flex flex-col gap-2" key={lang}>
              <InputOutlined
                label={t("image") + " " + lang}
                type="file"
                name="image"
                onChange={async (e) => {
                  if (!e.target.files.item(0)) {
                    return;
                  } else {
                    uploadFileToAPI({
                      file: e.target.files.item(0),
                    }).then((res) => {
                      let tBanner = { ...editedBanner };
                      tBanner.images.find((img) => img.locale == lang).image =
                        res;
                      setEditedBanner(tBanner);
                    });
                  }
                }}
              />
              {editedBanner.images.find((img) => img.locale == lang)?.image
                ?.url && (
                <ImageWithURL
                  width={350}
                  height={350}
                  style={{ objectFit: "contain" }}
                  src={
                    editedBanner.images.find((img) => img.locale == lang).image
                      .url
                  }
                  alt={editedBanner.localized_title[lang]}
                />
              )}
              <InputOutlined
                key={`title-${lang}`}
                label={t("title") + " " + lang}
                type="text"
                name="title"
                value={editedBanner.localized_title[lang]}
                onChange={(e) => {
                  let tBanner = { ...editedBanner };
                  tBanner.localized_title[lang] = e.target.value;
                  tBanner.images.find((img) => img.locale == lang).name =
                    e.target.value;
                  setEditedBanner(tBanner);
                }}
              />
              <TextareaOutlined
                label={t("description") + " " + lang}
                type="text"
                name="description"
                value={editedBanner.localized_description[lang]}
                onChange={(e) => {
                  let tBanner = { ...editedBanner };
                  tBanner.localized_description[lang] = e.target.value;
                  tBanner.images.find((img) => img.locale == lang).description =
                    e.target.value;
                  setEditedBanner(tBanner);
                }}
              />
              <InputOutlined
                label={t("url") + " " + lang}
                type="text"
                name="url"
                value={
                  editedBanner.images.find((img) => img.locale == lang)
                    ?.linked_url ?? ""
                }
                onChange={(e) => {
                  let tBanner = { ...editedBanner };
                  tBanner.images.find((img) => img.locale == lang).linked_url =
                    e.target.value;
                  setEditedBanner(tBanner);
                }}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="absolute right-4 bottom-4"
          onClick={() => {
            if (!editedBanner.images.find((img) => img?.image)) {
              alert("Please add an image");
              return;
            }
            if (editedBanner.images.find((img) => !img?.image)) {
              const firstImageWithImage = editedBanner.images.find(
                (img) => img.image,
              );

              editedBanner.images = editedBanner.images.map((img) =>
                img.image ? img : { ...img, image: firstImageWithImage.image },
              );
            }
            if (editedBanner.images.find((img) => !img.name)) {
              editedBanner.images.forEach((img) => {
                if (!img.name) {
                  img.name =
                    editedBanner.images.find((img) => img.name)?.name ?? "";
                }
              });
            }
            if (editedBanner.images.find((img) => !img.alt)) {
              editedBanner.images.forEach((img) => {
                if (!img.alt) {
                  img.alt =
                    editedBanner.images.find((img) => img.alt)?.alt ?? "";
                }
              });
            }
            if (editedBanner.images.find((img) => !img.description)) {
              editedBanner.images.forEach((img) => {
                if (!img.description) {
                  img.description =
                    editedBanner.images.find((img) => img.description)
                      ?.description ?? "";
                }
              });
            }

            const fillEmptyFields = (field) => {
              let firstFilledValue = null;
              for (const locale in field) {
                if (field[locale]) {
                  firstFilledValue = field[locale];
                  break;
                }
              }

              if (firstFilledValue) {
                for (const locale in field) {
                  if (!field[locale]) {
                    field[locale] = firstFilledValue;
                  }
                }
              }
            };

            fillEmptyFields(editedBanner.localized_title);

            fillEmptyFields(editedBanner.localized_description);

            if (editedBanner.id == "new") {
              delete editedBanner.id;
              fetch(`/api/private/banners`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(editedBanner),
              }).then(async (res) => {
                const ans = await res.json();
                router.push(`/${lang}/admin/website/banner-edit/${ans.id}`);
              });
            } else {
              let idtoput = `${editedBanner.id}`;
              delete editedBanner.id;
              fetch(`/api/private/banners?id=${idtoput}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(editedBanner),
              }).then((res) => {
                window.location.reload();
              });
            }
          }}
        >
          <FiCheck color="green" size={64} />
        </button>
      </div>
    </>
  );
}

BannerEdit.getLayout = function getLayout(children) {
  const { t } = useTranslation("common");
  return <AdminPanelLayout title={t("banners")}>{children}</AdminPanelLayout>;
};

export async function getServerSideProps(context) {
  let banner = await getBanners({ id: context.params.id });
  if (!banner) {
    banner = {
      id: "new",
      localized_title: {
        en: "",
        nl: "",
        fr: "",
        de: "",
      },
      localized_description: {
        en: "",
        nl: "",
        fr: "",
        de: "",
      },
      images: [
        {
          locale: "en",
          linked_url: "",
          name: "",
          description: "",
          image: null,
        },
        {
          locale: "nl",
          linked_url: "",
          name: "",
          description: "",
          image: null,
        },
        {
          locale: "fr",
          linked_url: "",
          name: "",
          description: "",
          image: null,
        },
        {
          locale: "de",
          linked_url: "",
          name: "",
          description: "",
          image: null,
        },
      ],
    };
  }
  return {
    props: {
      banner,
    },
  };
}
