import ProductPreviewCustom from "../products/product-preview-custom";
import useTranslation from "next-translate/useTranslation";
import { Product } from "../../api/interfaces/product";
import { useEffect, useState, useMemo } from "react";
import { FieldGroup } from "../styled/fieldset";
import debounce from "../../api/utils/debounce";
import { Input } from "../styled/input";
import { Paging } from "../paging";

const fetchProducts = async ({
  search,
  page,
}: {
  search: string;
  page: number;
}) => {
  const request = await fetch(
    `/api/products/public/getproducts?page=${page}${search !== "" ? "&search=" + search : ""}`,
  );
  const data = await request.json();
  return data;
};

export const ProductSelector = ({
  onProductSelected,
}: {
  onProductSelected: (product: Product) => void;
}) => {
  const { t } = useTranslation("common");

  const [products, setProducts] = useState<Product[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
        setPage(1);
      }, 500),
    [],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSetSearch(value);
  };

  useEffect(() => {
    fetchProducts({ search, page }).then((ans) => {
      setProducts(ans.sortedData);
      setTotalPages(ans.totalPages);
    });
  }, [search, page]);

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <h3 className="text-lg font-semibold">{t("add-product")}</h3>
      <FieldGroup>
        <Input
          label={t("search")}
          value={inputValue}
          onChange={handleSearchChange}
        />
      </FieldGroup>
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
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};
