import ProductPreviewCustom from "../products/product-preview-custom";
import useTranslation from "next-translate/useTranslation";
import { Product } from "../../api/interfaces/product";
import { useEffect, useState } from "react";
import { Paging } from "../paging";
import { Input } from "../styled/input";
import { FieldGroup } from "../styled/fieldset";

const fetchProducts = async ({
  search,
  page,
}: {
  search: string;
  page: number;
}) => {
  const request = await fetch(
    `/api/products/public/getproducts?page=${page}${search != "" ? "&search=" + search : ""}`,
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
  const [where, setWhere] = useState({
    search: "",
    page: 1,
    totalPages: 1,
  });

  useEffect(() => {
    fetchProducts({
      search: where.search,
      page: where.page,
    }).then((ans) => {
      setProducts(ans.sortedData);
      setWhere({
        ...where,
        totalPages: ans.totalPages,
      });
    });
  }, [where.page, where.search]);

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <h3 className="text-lg font-semibold">{t("add-product")}</h3>
      ssssssss
      <FieldGroup>
        <Input
          value={where.search}
          onChange={(e) => setWhere({ ...where, search: e.target.value })}
        />
      </FieldGroup>
      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        {products.length > 0 &&
          products.map((product) => (
            <div key={product.id} className="w-[50vw] md:w-[33vw] lg:w-[250px]">
              <ProductPreviewCustom
                onClick={() => onProductSelected(product)}
                product={product}
              />
            </div>
          ))}
      </div>
      <Paging
        currentPage={where.page}
        totalPages={where.totalPages}
        onPageChange={(page) => setWhere({ ...where, page })}
      />
    </div>
  );
};
