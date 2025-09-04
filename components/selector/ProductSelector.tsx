import { ProductPreviewCustom } from "../products/product-preview-custom";
import useTranslation from "next-translate/useTranslation";
import { Product } from "../../api/interfaces/product";
import { useEffect, useState, useMemo } from "react";
import { Field, FieldGroup, Label } from "../styled/fieldset";
import debounce from "../../api/utils/debounce";
import { Input } from "../styled/input";
import { Paging } from "../paging";
import { Select } from "../styled/select";

const fetchProducts = async ({
  search,
  page,
  category,
}: {
  search: string;
  page: number;
  category: number | null;
}) => {
  const request = await fetch(
    `/api/products/public/getproducts?page=${page}${search !== "" ? "&search=" + search : ""}${category ? "&category=" + category : ""}`,
  );
  const data = await request.json();
  return data;
};

export const ProductSelector = ({
  onProductSelected,
}: {
  onProductSelected: (product: Product) => void;
}) => {
  const { t, lang } = useTranslation("common");

  const [products, setProducts] = useState<Product[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [searchParams, setSearchParam] = useState({
    search: "",
    page: 1,
    category: null,
    totalPages: 1,
  });

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchParam({
          search: value,
          page: 1,
          category: null,
          totalPages: 1,
        });
      }, 500),
    [],
  );

  const [allCategories, setAllCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/categories/public/getallcategoriesflattened`).then((res) => {
      res.json().then((data) => {
        console.dir(data);
        setAllCategories(data);
      });
    });
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSetSearch(value);
  };

  useEffect(() => {
    fetchProducts({
      search: searchParams.search,
      page: searchParams.page,
      category: searchParams.category,
    }).then((ans) => {
      setProducts(ans.sortedData);
      setSearchParam({
        ...searchParams,
        totalPages: ans.totalPages,
      });
    });
  }, [searchParams.search, searchParams.page, searchParams.category]);

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <h3 className="text-lg font-semibold">{t("add-product")}</h3>
      <div className="flex flex-row items-center gap-2">
        <FieldGroup className="flex flex-row items-start gap-3">
          <Input
            label={t("search")}
            value={inputValue}
            onChange={handleSearchChange}
          />
          <Field>
            <Label>{t("Select Category")}</Label>
            <Select
              name="categories"
              onChange={(e) => {
                if (e.target.value === "all") {
                  setSearchParam({
                    ...searchParams,
                    category: null,
                    page: 1,
                  });
                } else {
                  setSearchParam({
                    ...searchParams,
                    category: e.target.value,
                    page: 1,
                  });
                }
              }}
            >
              <option>{t("all")}</option>
              {allCategories
                .filter((cat) => cat.id !== searchParams.category)
                .map((cat) => {
                  const isSubcategory = !!cat.headCategory;
                  const hasHeadParent =
                    isSubcategory &&
                    !!allCategories.find(
                      (parent) => parent.id === cat.headCategory?.id,
                    )?.headCategory;

                  const prefix = isSubcategory
                    ? hasHeadParent
                      ? "--"
                      : "-"
                    : "";

                  return (
                    <option key={`${cat.id}-cat`} value={cat.id}>
                      {prefix}
                      {cat.localized_name[lang]}
                    </option>
                  );
                })}
            </Select>
          </Field>
        </FieldGroup>
      </div>
      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        {products.map((product) => (
          <div key={product.id} className="w-[50vw] md:w-[33vw] lg:w-[250px]">
            <ProductPreviewCustom
              onClick={() => onProductSelected(product)}
              product={product}
            />
          </div>
        ))}
      </div>
      <Paging
        currentPage={searchParams.page}
        totalPages={searchParams.totalPages}
        onPageChange={(page) => {
          setSearchParam({
            ...searchParams,
            page: page,
          });
        }}
      />
    </div>
  );
};
