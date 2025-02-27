import useTranslation from "next-translate/useTranslation";
import LocaleSwitcher from "../LocaleSwitcher";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { X } from "react-feather";
import Image from "next/image";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

export default function StockLayout({ children }: Props) {
  const [categories, setCategories] = useState<any>();
  const router = useRouter();
  const { t, lang } = useTranslation("common");
  const [showMenu, setShowMenu] = useState(false);

  const validateSession = async () => {
    const data = await fetch("/api/private/auth/checkloggedinuser");
    if (data.status != 200) {
      router.push(
        `/admin?destination=${encodeURIComponent("/stock/list/all")}`,
      );
    }
  };

  useEffect(() => {
    validateSession();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await fetch(
        "/api/categories/public/getallcategoriesflattened",
      );
      setCategories(await data.json());
    };
    fetchCategories();
  }, []);

  return (
    <main>
      <style jsx global>{`
        .font-lato {
          visibility: hidden !important;
        }

        .tawk-min-container {
          visibility: hidden !important;
        }
      `}</style>
      <div className="flex flex-row">
        <div
          className={`sticky top-0 max-h-[100dvh] w-full flex-shrink-0 flex-col items-center gap-2 border-gray-300 bg-black shadow-sm lg:w-[270px] ${showMenu ? "flex" : "hidden lg:flex"} lg:border-r-0`}
        >
          <div className="flex w-full flex-row items-center justify-between px-2 py-2 text-white">
            <Image
              width={200}
              height={42.19}
              priority
              className="flex"
              src="/assets/header/logo.svg"
              alt="Horeca Depot Logo"
            />
            <div className="flex flex-row gap-2">
              <LocaleSwitcher />
              <button
                onClick={() => {
                  setShowMenu(false);
                  scrollTo({
                    top: 0,
                  });
                }}
                className="lg:hidden"
              >
                <X size={26} />
              </button>
            </div>
          </div>
          <div className="no-scrollbar flex h-full w-full flex-col gap-2 overflow-auto p-2">
            <Link
              onClick={() => setShowMenu(false)}
              href={`/stock/scanner`}
              className="w-full rounded-md border-2 border-gray-400 bg-yellow-200 px-1 py-1 shadow-md"
            >
              Scanner
            </Link>
            <h2 className="mr-auto text-xl font-semibold text-white">
              {t("Categories")}
            </h2>
            <div className="flex w-full flex-col gap-1">
              <Link
                onClick={() => setShowMenu(false)}
                href={`/stock/list/all?page=1`}
                className={`h-full w-full whitespace-nowrap rounded-md border-2 border-gray-400 ${router.query.category == "all" ? "bg-blue-200" : "bg-white"} p-1 shadow-sm hover:bg-blue-200`}
              >
                {t("All")}
              </Link>
              {categories
                ?.sort((a, b) => (a.priority > b.priority ? 1 : -1))
                .map((category) => (
                  <Link
                    onClick={() => setShowMenu(false)}
                    key={category.id}
                    href={`/stock/list/${category.id}?page=1`}
                    className={`h-full w-full whitespace-nowrap rounded-md border-2 border-gray-400 ${router.query.category == category.id ? "bg-blue-200" : "bg-white"} p-1 shadow-sm hover:bg-blue-200`}
                  >
                    {t(category.localized_name[lang])}
                  </Link>
                ))}
            </div>
          </div>
        </div>
        <div
          className={`flex w-full flex-col lg:max-w-[calc(100dvw-290px)] ${!showMenu ? "" : "hidden lg:flex"}`}
        >
          <div className="sticky left-0 top-0 flex w-full items-center justify-between bg-black px-2 py-2 text-white lg:hidden">
            <Image
              width={200}
              height={42.19}
              priority
              className="flex"
              src="/assets/header/logo.svg"
              alt="Horeca Depot Logo"
            />
            <button
              onClick={() => {
                setShowMenu(true);
                scrollTo({
                  top: 0,
                });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1={3} y1={12} x2={21} y2={12} />
                <line x1={3} y1={6} x2={21} y2={6} />
                <line x1={3} y1={18} x2={21} y2={18} />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
