import { createContext, useState, ReactNode, useEffect } from "react";

type Banner = {
  id: number;
  content: {
    fr: string;
    en: string;
    de: string;
    nl: string;
  };
  order: number;
  url: string;
};

type BannerContextType = { banners: Banner[] };

export const BannerContext = createContext<BannerContextType>({
  banners: [],
});

type BannerProviderProps = {
  children: ReactNode;
};

export const BannerProvider = ({ children }: BannerProviderProps) => {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`/api/banners/getbanners`, {
          headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        setBanners(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBanners();
  }, []);

  return (
    <BannerContext.Provider
      value={{
        banners,
      }}
    >
      {children}
    </BannerContext.Provider>
  );
};
