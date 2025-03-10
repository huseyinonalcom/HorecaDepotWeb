import TextareaOutlined from "../../../../components/inputs/textarea_outlined";
import { getBanners } from "../../../api/website/public/getbanners";
import InputOutlined from "../../../../components/inputs/outlined";
import { uploadFileToAPI } from "../../../api/files/uploadfile";
import ImageWithURL from "../../../../components/common/image";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router"; 
import { useState } from "react";
import Head from "next/head";
import AdminPanelLayout from "../../../../components/admin/AdminPanelLayout";
import { FiCheck } from "react-icons/fi";

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
              fetch(`/api/universal/admin/posttoapi?collection=banners`, {
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
              fetch(
                `/api/universal/admin/puttoapi?collectiontoput=banners&idtoput=${idtoput}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(editedBanner),
                },
              ).then((res) => {
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
  return <AdminPanelLayout title={t("orders")}>{children}</AdminPanelLayout>;
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
