import { getAllCategoriesFlattened } from "../../../api/categories/public/getallcategoriesflattened";
import { formatCurrency } from "../../../../api/utils/formatters/formatcurrency";
import { getAllProductIDs } from "../../../api/public/products/getallproductids";
import { useDragScroll } from "../../../../components/common/use-drag-scroll";
import ProductPreview from "../../../../components/products/product-preview";
import ProductButtons from "../../../../components/products/product-buttons";
import { getCoverImageUrl } from "../../../../api/utils/getprodcoverimage";
import ProductImages from "../../../../components/products/product-images";
import { MdHeight, MdOutlineChair, MdWhatsapp } from "react-icons/md";
import { getProducts } from "../../../api/private/products/products";
import { Product } from "../../../../api/interfaces/product";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../../../components/public/layout";
import { Fragment, useEffect, useState } from "react";
import Meta from "../../../../components/public/meta";
import { GoCircleSlash } from "react-icons/go";
import { AutoTextSize } from "auto-text-size";
import { FiFacebook } from "react-icons/fi";
import { TiTick } from "react-icons/ti";
import Head from "next/head";
import Link from "next/link";

type Props = {
  relatedProducts: Product[];
  product: Product;
  breadCrumbs;
  categories;
};

export default function ProductPage({
  product,
  relatedProducts,
  breadCrumbs,
}: Props) {
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

  let localizedName = product.name;

  if (product.localized_name) {
    if (product.localized_name[lang]) {
      localizedName = product.localized_name[lang];
    }
  }

  let localizedDescription = product.description;

  if (product.localized_description) {
    if (product.localized_description[lang]) {
      localizedDescription = product.localized_description[lang];
    }
  }

  useEffect(() => {
    if (!product?.id) return;

    const viewsKey = `views_${product.id}`;

    // Check if this product was already views in this session
    if (sessionStorage.getItem(viewsKey)) {
      return;
    }

    // Mark as views in this session
    sessionStorage.setItem(viewsKey, "true");

    fetch(`/api/public/products/stats?id=${product.id}&action=views`, {
      method: "POST",
    }).catch();
  }, [product.id]);

  return (
    <Layout>
      <Meta />
      <Head>
        <title>
          {localizedName +
            " " +
            product.internalCode +
            " | Horeca Depot | Meubles pour Hotels, Restaurants ..."}
        </title>
        <meta name="keywords" content={tags ?? "test"} />
        <meta
          property="og:image"
          content={
            product.images != null
              ? "https://hdcdn.hocecomv1.com" + getCoverImageUrl(product)
              : "/uploads/placeholder_9db455d1f1.webp"
          }
        />
        <meta name="language" content={lang} />
        <meta name="description" content={localizedDescription} />
        <meta name="subject" content={"" + localizedName + ""} />
        <link
          rel="canonical"
          href={
            "https://horecadepot.be/products/" +
            `${product.categories.at(0).localized_name[lang]}/${localizedName}/${product.id}`
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
            <h2 className="text-xl font-bold">{localizedName}</h2>
            <h3 className="text-lg font-semibold">
              {product.internalCode != "0" ? product.internalCode : ""}
            </h3>
            <div className="flex flex-row items-center gap-2 text-2xl">
              {product.priceBeforeDiscount <= product.value ? null : (
                <h3 className="font-bold text-gray-800 line-through">
                  {formatCurrency(product.priceBeforeDiscount / 1.21)}
                </h3>
              )}
              <h3 className="font-bold">
                {formatCurrency(product.value / 1.21)}
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
            <p className="text-[10px]">{t("vat-excl")}</p>
            <div className="flex flex-row items-center gap-2">
              {product.priceBeforeDiscount <= product.value ? null : (
                <h3 className="font-bold text-gray-800 line-through">
                  {formatCurrency(product.priceBeforeDiscount)}
                </h3>
              )}
              <h3 className="font-bold">{formatCurrency(product.value)}</h3>
              <p>{t("vat-incl")}</p>
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

              {localizedDescription && (
                <p className="mt-1 w-full border-t border-gray-400 pt-1">
                  {localizedDescription}
                </p>
              )}

              <div className="flex flex-row items-center gap-2">
                <b>{t("Share")}:</b>
                <Link
                  target="_blank"
                  aria-label="Share via Facebook"
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://horecadepot.be/products/${product.categories.at(0).localized_name[lang]}/${localizedName}/${product.id}`}
                >
                  <FiFacebook
                    width={60}
                    height={60}
                    className="h-6 w-6 text-black duration-300 hover:text-blue-600"
                  />
                </Link>
                <Link
                  target="_blank"
                  aria-label="Share via Whatsapp"
                  href={`https://api.whatsapp.com/send?text=https://horecadepot.be/products/${product.categories.at(0).localized_name[lang]}/${localizedName}/${product.id}`}
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
}

type Params = {
  params: {
    id: string;
  };
  locale: string;
};

export const getStaticProps = async ({ params, locale }: Params) => {
  const product = await getProducts({
    authToken: null,
    id: Number.parseInt(params.id),
  });
  const result = (
    await getProducts({
      page: 1,
      category: product.categories[0].id,
      count: "10",
      authToken: null,
    })
  ).data;

  console.log(result);

  const relatedProducts: Product[] = result
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
      breadCrumbs,
    },
    revalidate: 900,
  };
};

export async function getStaticPaths({}) {
  const result = (await getAllProductIDs()).result;
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
