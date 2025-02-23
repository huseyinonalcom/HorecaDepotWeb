import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<any>();
  const { t, lang } = useTranslation("common");

  const validateSession = async () => {
    const data = await fetch("/api/admin/checkloggedinuser");
    if (data.status != 200) {
      router.push("/admin");
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
        <div className="min-w-[250px] flex-shrink-0 p-2">
          <div className="flex w-full flex-col gap-1">
            {categories?.sort((a,b) => a.order > b.order ? -1 : 1).map((category) => (
              <Link
                key={category.id}
                href={`/stock/list/${category.id}?page=1`}
                className="h-full w-full whitespace-nowrap rounded-md border-2 border-gray-400 bg-white p-1 shadow-sm hover:bg-blue-200"
              >
                {t(category.localized_name[lang])}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex-shrink-1 w-full p-2">{children}</div>
      </div>
    </main>
  );
}
