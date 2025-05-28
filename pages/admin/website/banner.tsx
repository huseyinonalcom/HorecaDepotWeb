import AdminPanelLayout from "../../../components/admin/AdminPanelLayout";
import componentThemes from "../../../components/componentThemes";
import InputOutlined from "../../../components/inputs/outlined";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import Head from "next/head";

const fetchBanners = async () => {
  const fetchWebsiteRequest = await fetch(`/api/private/top-banners`, {
    method: "GET",
  });
  if (fetchWebsiteRequest.ok) {
    const fetchWebsiteRequestAnswer = await fetchWebsiteRequest.json();
    return fetchWebsiteRequestAnswer;
  } else {
    return null;
  }
};

const putBanners = async ({ banner }) => {
  const putWebsiteRequest = await fetch("/api/private/top-banners", {
    method: "PUT",
    body: JSON.stringify({
      url: banner.url,
      content: banner.content,
    }),
  });
  if (putWebsiteRequest.ok) {
    return true;
  } else {
    return false;
  }
};

export default function BannerAdmin() {
  const [banner, setBanner] = useState(null);
  const { t } = useTranslation("common");

  const fetchData = async () => {
    const response = await fetchBanners();
    if (response) {
      setBanner(response[0]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>{t("banner")}</title>
      </Head>
      <div className="mx-auto flex w-[95%] flex-col items-center p-2">
        {banner && (
          <div className="grid w-full grid-cols-1 gap-2">
            <div className="flex flex-col gap-2">
              <InputOutlined
                label={t("url")}
                value={banner.url}
                onChange={(e) => {
                  setBanner({ ...banner, url: e.target.value });
                }}
              />
              <InputOutlined
                label="English"
                value={banner.content.en}
                onChange={(e) => {
                  setBanner({
                    ...banner,
                    content: {
                      ...banner.content,
                      en: e.target.value,
                    },
                  });
                }}
              />
              <InputOutlined
                label="Nederlands"
                value={banner.content.nl}
                onChange={(e) => {
                  setBanner({
                    ...banner,
                    content: {
                      ...banner.content,
                      nl: e.target.value,
                    },
                  });
                }}
              />
              <InputOutlined
                label="Français"
                value={banner.content.fr}
                onChange={(e) => {
                  setBanner({
                    ...banner,
                    content: {
                      ...banner.content,
                      fr: e.target.value,
                    },
                  });
                }}
              />
              <InputOutlined
                label="Deutsch"
                value={banner.content.de}
                onChange={(e) => {
                  setBanner({
                    ...banner,
                    content: {
                      ...banner.content,
                      de: e.target.value,
                    },
                  });
                }}
              />

              <button
                onClick={() => {
                  putBanners({ banner }).then((res) => {
                    if (res) {
                      alert(t("banner-updated"));
                    }
                  });
                }}
                className={componentThemes.outlinedButton}
              >
                {t("save")}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

BannerAdmin.getLayout = function getLayout(children) {
  const { t } = useTranslation("common");
  return <AdminPanelLayout title={t("banner")}>{children}</AdminPanelLayout>;
};
