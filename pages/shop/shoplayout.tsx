import componentThemes from "../../components/componentThemes";
import RangeSlider from "../../components/common/rangeSlider";
import useTranslation from "next-translate/useTranslation";
import { ChevronLeft, X } from "react-feather";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Category } from "../../api/interfaces/category";

type Props = {
  children: React.ReactNode;
};

export default function ShopLayout({ children }: Props) {
  const router = useRouter();
  const { t, lang } = useTranslation("common");
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  const props = router.query;
  const context = router;

  useEffect(() => {
    fetch("/api/categories/getallcategories").then((res) => {
      res.json().then((cats) => {
        setAllCategories(cats);
      });
    });
  }, []);

  useEffect(() => {
    const currentSort =
      (context.query?.sort as string)?.split(":").at(0) ?? "value";
    const currentSortDirection =
      (context.query?.sort as string)?.split(":").at(1) ?? "asc";

    context.query.sort = currentSort + ":" + currentSortDirection;

    const queryParams = new URLSearchParams();

    Object.entries(context.query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        queryParams.set(key, value.join(","));
      } else if (value !== undefined) {
        queryParams.set(key, value);
      }
    });

    fetch(
      `/api/products/public/getproducts?${queryParams.toString()}&getlimits=true`,
    )
      .then((res) => res.json())
      .then((res) => {
        setMinValueFromAPI(res.minValueFromAPI);
        setMaxValueFromAPI(res.maxValueFromAPI);
      });
  }, [context.query]);

  const [minValueFromAPI, setMinValueFromAPI] = useState(1);
  const [maxValueFromAPI, setMaxValueFromAPI] = useState(9999);

  let minPriceToSet;
  let maxPriceToSet;

  if (props.minprice && minValueFromAPI) {
    if (Number(props.minprice) < minValueFromAPI) {
      minPriceToSet = minValueFromAPI;
    } else {
      minPriceToSet = Number(props.minprice) ?? 1;
    }
  }

  if (props.maxprice && maxValueFromAPI) {
    if (Number(props.maxprice) > maxValueFromAPI) {
      maxPriceToSet = maxValueFromAPI;
    } else {
      maxPriceToSet = Number(props.maxprice) ?? 9999;
    }
  }

  const [sliderMin, setSliderMin] = useState<number | null>(maxPriceToSet);
  const [sliderMax, setSliderMax] = useState<number | null>(maxPriceToSet);

  const handleSliderChange = (minValue: number, maxValue: number) => {
    setSliderMin(minValue);
    setSliderMax(maxValue);
  };

  const [currentSearch, setCurrentSearch] = useState<string>("");

  const toggleCategory = (id: number) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id],
    );
  };

  const isCategoryExpanded = (id: number) => expandedCategories.includes(id);

  const CategoryItem = ({ category }: { category: Category }) => {
    const hasSubCategories =
      category.subCategories && category.subCategories.length > 0;

    return (
      <div className="relative cursor-pointer">
        <div className="flex w-full items-center justify-between text-left hover:bg-gray-200">
          <Link
            href={`/${router.locale}/shop/${encodeURIComponent(t(category.localized_name[lang]))}?page=1`}
            className="h-full whitespace-nowrap px-4 py-2"
          >
            {t(category.localized_name[lang])}
          </Link>
          {hasSubCategories && (
            <div
              className="w-full py-3 pr-4"
              onClick={() => toggleCategory(category.id)}
            >
              <ChevronLeft
                className={
                  "ml-auto h-4 w-4 duration-300 " +
                  (isCategoryExpanded(category.id) ? "rotate-270" : "rotate-90")
                }
              />
            </div>
          )}
        </div>
        {hasSubCategories && isCategoryExpanded(category.id) && (
          <div className="pl-4">
            {category.subCategories.map((subCategory) => (
              <CategoryItem key={subCategory.id} category={subCategory} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  return (
    <div
      id={t("Shop")}
      className="flex w-full flex-col items-start text-black lg:flex-row"
    >
      <div className="relative flex w-full flex-col gap-2 px-1 lg:w-[350px]">
        <div
          className={`fixed bottom-0 z-50 flex w-full flex-col duration-700 lg:hidden ${isFilterDrawerOpen ? "left-0" : "left-[-100%]"}`}
        >
          <div className="flex h-[100dvh] w-full flex-row">
            <div className="flex h-full w-fit flex-col justify-between">
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex w-full flex-shrink-0 flex-row justify-end bg-slate-300 px-3 py-2"
              >
                <X />
              </button>
              <div className="flex h-full w-full flex-col justify-end bg-white ">
                <div>
                  {currentSearch ? (
                    <div
                      className={`overflow-hidden bg-gray-100 p-4 shadow-lg`}
                    >
                      {currentSearch ? (
                        <div
                          style={{ cursor: "pointer" }}
                          className="mb-1 pr-3"
                          onClick={() => setCurrentSearch("")}
                        >
                          x {currentSearch}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <p className="mt-4 border-b pb-1 pl-3 text-lg font-semibold">
                  {t("Categories")}
                </p>
                <div className="mb-4 flex w-full flex-col border-b bg-white py-2 text-gray-500 duration-300">
                  {allCategories.map((category) => (
                    <CategoryItem key={category.id} category={category} />
                  ))}
                </div>
                <p className="mt-4 border-b pb-1 pl-3 text-lg font-semibold">
                  {t("Price")}
                </p>
                <div className={`mb-4 overflow-hidden px-4 pt-2`}>
                  <RangeSlider
                    minGap={20}
                    initialMin={sliderMin}
                    initialMax={sliderMax}
                    min={minValueFromAPI}
                    max={maxValueFromAPI}
                    onChange={handleSliderChange}
                    prefix="€"
                    label="Price"
                  />
                </div>
                <div className="flex flex-row justify-between">
                  <button
                    className={componentThemes.greenSubmitButton}
                    onClick={() => {
                      setIsFilterDrawerOpen(false);
                    }}
                  >
                    {t("Filter")}
                  </button>
                </div>
              </div>
            </div>
            <div
              onClick={() => setIsFilterDrawerOpen(false)}
              className={`h-full w-full`}
            ></div>
          </div>
        </div>
        <div className="hidden w-full flex-col duration-700 lg:flex">
          {currentSearch ? (
            <div className="bg-gray-100 p-4">
              {currentSearch ? (
                <div
                  style={{ cursor: "pointer" }}
                  className="mb-1 pr-3"
                  onClick={() => setCurrentSearch("")}
                >
                  x {currentSearch}
                </div>
              ) : null}
            </div>
          ) : null}
          <p className="mt-4 border-b pb-1 pl-3 text-lg font-semibold text-black">
            {t("Categories")}
          </p>
          <div className="flex w-full flex-col bg-white py-2 text-gray-700 duration-300">
            {allCategories.map((category) => (
              <CategoryItem key={category.id} category={category} />
            ))}
          </div>
          <p className="mt-4 border-b pb-1 pl-3 text-lg font-semibold">
            {t("Price")}
          </p>
          <div className={`overflow-hidden px-4 pt-2`}>
            <RangeSlider
              minGap={20}
              initialMin={sliderMin}
              initialMax={sliderMax}
              min={minValueFromAPI}
              max={maxValueFromAPI}
              onChange={handleSliderChange}
              prefix="€"
              label="Price"
            />
          </div>
          <div className="flex flex-row justify-between">
            <button
              className={componentThemes.outlinedButton}
              onClick={() => {
                setIsFilterDrawerOpen(false);
                const currentUrl = new URL(window.location.href);

                currentUrl.searchParams.set("minprice", sliderMin.toString());
                currentUrl.searchParams.set("maxprice", sliderMax.toString());

                router.push(currentUrl);
              }}
            >
              {t("Filter")}
            </button>
          </div>
        </div>
        <button
          onClick={() => {
            setIsFilterDrawerOpen(!isFilterDrawerOpen);
          }}
          className="mt-2 border-2 px-2 py-1 font-semibold lg:hidden"
        >
          {t("Filters")}
        </button>
      </div>
      {children}
    </div>
  );
}
