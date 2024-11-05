import { getAllCategoriesFlattened } from "../../../api/categories/public/getallcategoriesflattened";
import {
  getAllProductIDs,
  getProductByID,
  getProducts,
} from "../../../../api/calls/productCalls";
import ProductPreview from "../../../../components/products/product-preview";
import ProductButtons from "../../../../components/products/product-buttons";
import { Fragment, useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { Product } from "../../../../api/interfaces/product";
import Layout from "../../../../components/public/layout";
import { Facebook } from "react-feather";
import Meta from "../../../../components/public/meta";
import Head from "next/head";
import Link from "next/link";
import { useDragScroll } from "../../../../components/common/use-drag-scroll";
import { AutoTextSize } from "auto-text-size";
import ProductImages from "../../../../components/products/product-images";
import { TiTick } from "react-icons/ti";
import { MdHeight, MdOutlineChair, MdWhatsapp } from "react-icons/md";
import { GoCircleSlash } from "react-icons/go";
import { getCoverImageUrl } from "../../../../api/utils/getprodcoverimage";

type Props = {
  relatedProducts: Product[];
  product: Product;
  breadCrumbs;
  categories;
};

const ProductPage = ({
  product,
  relatedProducts,
  categories,
  breadCrumbs,
}: Props) => {
  const { t, lang } = useTranslation("common");

  const [ref] = useDragScroll();
  const [cartAmount, setCartAmount] = useState(1);

  useEffect(() => {
    handleCartAmountChange(1);
  }, [product]);

  let tagsArray: string[];
  let tags = "";
  if (product.product_extra.tags) {
    tagsArray = product.product_extra.tags.split("\n");
    tagsArray.forEach((tag) => {
      tags += t(tag) + ", ";
    });
    tags = tags.substring(0, tags.length - 2);
  }

  const handleCartAmountChange = (cartAmount: number) => {
    if (cartAmount > 0) {
      setCartAmount(cartAmount);
    }
  };

  return (
    <Layout>
      <Meta />
      <Head>
        <title>
          {product.name +
            " " +
            product.internalCode +
            " | Horeca Depot | Meubles pour Hotels, Restaurants ..."}
        </title>
        <meta name="keywords" content={tags ?? "test"} />
        <meta
          property="og:image"
          content={
            product.images != null
              ? "https://hdapi.huseyinonalalpha.com" + getCoverImageUrl(product)
              : "/uploads/placeholder_9db455d1f1.webp"
          }
        />
        <meta name="language" content={lang} />
        <meta
          name="description"
          content={
            product.name + " " + t(product.categories[0].localized_name[lang])
          }
        />
        <meta name="subject" content={"" + product.name + ""} />
        <link
          rel="canonical"
          href={
            "https://horecadepot.be/products/" +
            `${product.categories.at(0).localized_name[lang]}/${product.name}/${product.id}`
          }
        />
      </Head>
      <div className="flex w-full flex-col items-start px-2 pt-2">
        <div className="flex flex-row gap-1 text-xs font-bold md:text-base">
          <Link key={1} href={"/"} className="text-gray-400">
            {t("Home Page")}
          </Link>
          <Link key={2} href={"/shop/tous?page=1"} className="text-gray-400">
            {"> "}
            {t("Shop")}
          </Link>
          {breadCrumbs &&
            breadCrumbs.map((crumb, index) => {
              return (
                <Link
                  key={index + 2}
                  href={`/shop/${encodeURIComponent(t(crumb))}`}
                  className="text-gray-400 last:text-black"
                >
                  {"> "}
                  {t(crumb)}
                </Link>
              );
            })}
        </div>
        <div className="grid w-full grid-cols-1 items-center justify-center gap-2 md:grid-cols-5">
          <div className="col-span-3">
            <ProductImages product={product} />
          </div>
          <div className="col-span-2 flex h-full w-full flex-col items-start justify-start gap-2 px-1 md:px-4">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <h3 className="text-lg font-semibold">
              {product.internalCode != "0" ? product.internalCode : ""}
            </h3>
            <div className="flex flex-row items-center gap-2">
              {product.priceBeforeDiscount <= product.value ? null : (
                <h3 className="font-bold text-gray-800 line-through">
                  {"€ " +
                    product.priceBeforeDiscount.toFixed(2).replaceAll(".", ",")}
                </h3>
              )}
              <h3 className="text-lg font-bold">
                {"€ " + product.value.toFixed(2).replaceAll(".", ",")}
              </h3>
              {product.priceBeforeDiscount > product.value ? (
                <p
                  draggable={false}
                  className="flex w-fit flex-row items-center justify-center overflow-hidden border-t-0 bg-red-600 px-2 py-1 text-xs font-bold text-white"
                >
                  {(
                    ((product.value - product.priceBeforeDiscount) /
                      product.priceBeforeDiscount) *
                    100
                  ).toFixed(0) + "%"}
                </p>
              ) : null}
            </div>

            <div className="flex flex-row items-center gap-2">
              <h3 className="text-lg font-bold">
                {"€ " +
                  (product.value / (1 + product.tax / 100))
                    .toFixed(2)
                    .replaceAll(".", ",")}
              </h3>
              <h4 className="text-xs">{t("vat-excl")}</h4>
            </div>
            {product.color && !product.product_color && (
              <p>
                <b>{t("Color")}:</b> {product.color}
              </p>
            )}
            {product.product_color && (
              <p>
                <b>{t("Color")}:</b> {product.product_color.name}
              </p>
            )}
            {breadCrumbs && (
              <div className="flex flex-row gap-2">
                <b>{t("Categories")}: </b>
                {breadCrumbs.map((crumb, index) => (
                  <Fragment key={index}>
                    <Link href={`/shop/${encodeURIComponent(t(crumb))}`}>
                      {t(crumb)}
                      {index < breadCrumbs.length - 1 && ","}
                    </Link>
                  </Fragment>
                ))}
              </div>
            )}
            <div className="flex w-full flex-col justify-center gap-2 border-b border-gray-400 pb-2 sm:justify-start">
              <ProductButtons
                product={product}
                amount={cartAmount}
                onChange={handleCartAmountChange}
              />
              {product.shelves && product.shelves.length > 0 && (
                <div draggable={false} className="text-md font-semibold">
                  {product.shelves?.reduce(
                    (acc, shelf) => acc + shelf.stock,
                    0,
                  ) > 10 && (
                    <div className="flex flex-row gap-0.5">
                      <p>{t("in_stock")}</p>
                      <TiTick size={20} color="green" />
                    </div>
                  )}
                  {product.shelves?.reduce(
                    (acc, shelf) => acc + shelf.stock,
                    0,
                  ) <= 10 &&
                    product.shelves?.reduce(
                      (acc, shelf) => acc + shelf.stock,
                      0,
                    ) > 0 && (
                      <AutoTextSize
                        draggable={false}
                        mode="oneline"
                        maxFontSizePx={18}
                        className="text-orange-500"
                      >
                        {t("low_stock")}
                      </AutoTextSize>
                    )}

                  {product.shelves?.reduce(
                    (acc, shelf) => acc + shelf.stock,
                    0,
                  ) < 1 && (
                    <AutoTextSize
                      draggable={false}
                      mode="oneline"
                      maxFontSizePx={18}
                      className="text-red-500"
                    >
                      {t("no_stock")}
                    </AutoTextSize>
                  )}
                </div>
              )}
            </div>

            <div className="flex w-full flex-col gap-1">
              {product.height !== undefined &&
                product.height !== null &&
                product.height != 0 && (
                  <div className="flex flex-row">
                    <MdHeight size={24} className="flex-shrink-0" />
                    <p>
                      <b>{t("Height")}:</b> {product.height} cm
                    </p>
                  </div>
                )}
              {product.width !== undefined &&
                product.width !== null &&
                product.width != 0 && (
                  <div className="flex flex-row">
                    <MdHeight size={24} className="flex-shrink-0 rotate-90" />
                    <p>
                      <b>{t("Width")}:</b> {product.width} cm
                    </p>
                  </div>
                )}
              {product.depth !== undefined &&
                product.depth !== null &&
                product.depth !== 0 && (
                  <div className="flex flex-row">
                    <MdHeight size={24} className="flex-shrink-0 rotate-45" />
                    <p>
                      <b>{t("Length")}:</b> {product.depth} cm
                    </p>
                  </div>
                )}
              {product.product_extra.surface_area &&
                product.product_extra.surface_area != "" && (
                  <div className="flex flex-row">
                    <GoCircleSlash size={24} className="flex-shrink-0" />
                    <p>
                      <b>{t("Surface")}:</b>{" "}
                      {product.product_extra.surface_area}
                    </p>
                  </div>
                )}
              {product.product_extra.seat_height !== undefined &&
                product.product_extra.seat_height !== null &&
                product.product_extra.seat_height !== 0 && (
                  <div className="flex flex-row">
                    <MdOutlineChair size={20} className="flex-shrink-0" />
                    <MdHeight size={11} className="-ml-1.5 flex-shrink-0" />
                    <p>
                      <b>{t("Seat Height")}:</b>{" "}
                      {product.product_extra.seat_height} cm
                    </p>
                  </div>
                )}
              {product.product_extra.armrest_height !== undefined &&
                product.product_extra.armrest_height !== null &&
                product.product_extra.armrest_height !== 0 && (
                  <div className="flex flex-row items-center">
                    <div className="flex flex-row items-end">
                      <MdOutlineChair size={20} className="flex-shrink-0" />
                      <MdHeight size={15} className="-ml-1 flex-shrink-0" />
                    </div>
                    <p>
                      <b>{t("Armrest Height")}:</b>{" "}
                      {product.product_extra.armrest_height} cm
                    </p>
                  </div>
                )}
              {product.material && (
                <p>
                  <b>{t("Material")}:</b> {product.material}
                </p>
              )}

              {product.localized_description && (
                <p className="mt-1 w-full border-t border-gray-400 pt-1">
                  {product.localized_description[lang]}
                </p>
              )}

              {!product.localized_description && product.description && (
                <p className="mt-1 w-full border-t border-gray-400 pt-1">
                  {product.description}
                </p>
              )}
              <div className="flex flex-row items-center gap-2">
                <b>{t("Share")}:</b>
                <Link
                  target="_blank"
                  aria-label="Share via Facebook"
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://horecadepot.be/products/${product.categories.at(0).localized_name[lang]}/${product.name}/${product.id}`}
                >
                  <Facebook
                    width={60}
                    height={60}
                    className="h-6 w-6 text-black duration-300 hover:text-blue-600"
                  />
                </Link>
                <Link
                  target="_blank"
                  aria-label="Share via Whatsapp"
                  href={`https://api.whatsapp.com/send?text=https://horecadepot.be/products/${product.categories.at(0).localized_name[lang]}/${product.name}/${product.id}`}
                >
                  <MdWhatsapp
                    width={60}
                    height={60}
                    className="h-6 w-6 text-black duration-300 hover:text-green-500"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
        {relatedProducts.length < 2 ? null : (
          <>
            <h2 className="mt-4 flex w-full flex-row justify-center text-xl font-bold">
              {t("RELATED PRODUCTS")}
            </h2>
            <div className={`relative flex h-full w-full flex-col px-2`}>
              <div
                className="no-scrollbar flex h-full flex-row overflow-x-scroll py-2"
                ref={ref}
              >
                <div className="flex h-full w-full items-center gap-2">
                  {relatedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="flex w-[40vw] flex-shrink-0 items-center p-1 last:mr-4 md:w-[15vw]"
                    >
                      <ProductPreview product={prod} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

type Params = {
  params: {
    id: string;
  };
  locale: string;
};

export const getStaticProps = async ({ params, locale }: Params) => {
  const product = await getProductByID(Number.parseInt(params.id));
  const result = await getProducts({
    page: 1,
    category: product.categories[0].id,
    count: 10,
    inStock: true,
  });
  const relatedProducts: Product[] = result[0]
    .filter((prd) => prd.id != product.id)
    .sort((a, b) => {
      // First, prioritize products with the same name as the main product
      if (a.name === product.name && b.name !== product.name) {
        return -1;
      } else if (a.name !== product.name && b.name === product.name) {
        return 1;
      }
      // If both have the same name, or neither have the same name, do random sorting
      return Math.random() - 0.5;
    })
    .slice(0, 9) as Product[];

  const categories = await getAllCategoriesFlattened();

  let breadCrumbs;

  const buildBreadcrumbs = (categoryId, crumbs = []) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (category) {
      crumbs.push(category.localized_name[locale]);
      if (category.headCategory != null) {
        buildBreadcrumbs(category.headCategory.id, crumbs);
      } else {
        breadCrumbs = crumbs.reverse();
      }
    }
  };
  if (product.id && product.categories[0]) {
    buildBreadcrumbs(product.categories[0].id);
  }

  return {
    props: {
      relatedProducts,
      product,
      categories,
      breadCrumbs,
    },
    revalidate: 900,
  };
};

export async function getStaticPaths({}) {
  const result = await getAllProductIDs();
  const allProductIDs: number[] = result;
  return {
    paths: allProductIDs.map((ID) => {
      return {
        params: {
          category: "any",
          name: "any",
          id: ID.toString(),
        },
      };
    }),
    fallback: "blocking",
  };
}

export default ProductPage;
