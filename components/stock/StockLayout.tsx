import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { X } from "react-feather";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const [categories, setCategories] = useState<any>();
  const router = useRouter();
  const { t, lang } = useTranslation("common");
  const [showMenu, setShowMenu] = useState(false);

  const validateSession = async () => {
    const data = await fetch("/api/admin/checkloggedinuser");
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
      <div className="flex flex-row">
        <div
          className={`w-full flex-shrink-0 flex-col items-center gap-2 border-r-2 border-gray-300 bg-gray-200 p-2 shadow-sm md:w-[250px] ${showMenu ? "flex" : "hidden md:flex"}`}
        >
          <button
            onClick={() => setShowMenu(false)}
            className="flex w-full flex-row items-center justify-end px-1 py-2 md:hidden"
          >
            <X />
          </button>
          <Link
            onClick={() => setShowMenu(false)}
            href={`/stock/scanner`}
            className="w-full rounded-md border-2 border-gray-400 bg-yellow-200 px-1 py-1 shadow-md"
          >
            Scanner
          </Link>
          <h2 className="text-xl font-semibold">Categories</h2>
          <div className="flex w-full flex-col gap-1">
            {categories
              ?.sort((a, b) => (a.priority > b.priority ? 1 : -1))
              .map((category) => (
                <Link
                  onClick={() => setShowMenu(false)}
                  key={category.id}
                  href={`/stock/list/${category.id}?page=1`}
                  className="h-full w-full whitespace-nowrap rounded-md border-2 border-gray-400 bg-white p-1 shadow-sm hover:bg-blue-200"
                >
                  {t(category.localized_name[lang])}
                </Link>
              ))}
          </div>
        </div>
        <div
          className={`flex w-full flex-col p-2 md:max-w-[calc(100dvw-280px)] ${!showMenu ? "" : "hidden md:flex"}`}
        >
          <button
            onClick={() => setShowMenu(true)}
            className="sticky left-0 top-0 mr-auto flex items-center justify-center px-2 py-2 md:hidden"
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
          {children}
        </div>
      </div>
    </main>
  );
}
