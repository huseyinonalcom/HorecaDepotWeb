import { getAllCategoriesFlattened } from "../api/categories/public/getallcategoriesflattened";
import {
  getAllProductIDs,
  getProductByID,
  getProducts,
} from "../../api/calls/productCalls";
import ProductPreview from "../../components/products/product-preview";
import ProductButtons from "../../components/products/product-buttons";
import { Fragment, useEffect, useRef, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { Product } from "../../api/interfaces/product";
import Layout from "../../components/public/layout";
import { ArrowLeft, Facebook } from "react-feather";
import Meta from "../../components/public/meta";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { useDragScroll } from "../../components/common/use-drag-scroll";

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
  const [currentImage, setCurrentImage] = useState(0);
  const imageBase =
    "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000";
  const imageVisible = "opacity-100 z-40";
  const imageInvisible = "opacity-0";

  useEffect(() => {
    setCurrentImage(0);
    handleCartAmountChange(1);
  }, [product]);

  const slidePrevious = () => {
    setCurrentImage((prevImage) => {
      if (prevImage === 0) {
        return product.images.length - 1;
      } else {
        return prevImage - 1;
      }
    });
  };

  const slideNext = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % product.images.length);
  };

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
              ? "https://hdapi.huseyinonalalpha.com" + product.images.at(0).url
              : "/assets/img/placeholder.png"
          }
        />
        <meta name="language" content={lang} />
        <meta
          name="description"
          content={product.name + " " + t(product.category.Name)}
        />
        <meta name="subject" content={"" + product.name + ""} />
        <link
          rel="canonical"
          href={"https://horecadepot.be/products/" + product.id}
        />
      </Head>
      <div className="flex w-full flex-col items-center pt-2">
        <div className="flex w-[90vw] flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="relative flex h-[80vw] w-[80vw] flex-shrink-0 flex-row items-center justify-center sm:h-[30vw] sm:w-[30vw]">
            <div className="relative mx-auto h-[90%] w-[90%]">
              {product.images && product.images.length > 0 ? (
                product.images.map((img, index) => (
                  <Image
                    key={img.id}
                    src={`https://hdapi.huseyinonalalpha.com${img.url}`}
                    fill
                    priority
                    loading="eager"
                    style={{ objectFit: "cover" }}
                    alt={product.name}
                    className={`${imageBase} ${currentImage === index ? imageVisible : imageInvisible}`}
                  />
                ))
              ) : (
                <Image
                  key={1}
                  src={`/assets/img/placeholder.png`}
                  fill
                  style={{ objectFit: "cover" }}
                  alt={product.name}
                  className={`${imageBase}`}
                />
              )}
            </div>
            {product.images && product.images.length > 1 ? (
              <div
                className="absolute left-0 z-40 flex h-full w-[30%] flex-col items-start justify-center"
                onClick={slidePrevious}
              >
                <ArrowLeft />
              </div>
            ) : null}
            {product.images && product.images.length > 1 ? (
              <div
                className="absolute right-0 z-40 flex h-full w-[30%] flex-col items-end justify-center"
                onClick={slideNext}
              >
                <ArrowLeft className="rotate-180" />
              </div>
            ) : null}
          </div>
          <div className="flex w-full flex-col items-center gap-2 pl-2 sm:items-start">
            <div className="flex flex-row gap-1 text-xs font-bold">
              <Link key={1} href={"/"} className="text-gray-400">
                {t("Home Page")}
              </Link>

              <Link key={2} href={"/products"} className="text-gray-400">
                {"> "}
                {t("Shop")}
              </Link>
              {breadCrumbs &&
                breadCrumbs.map((crumb, index) => {
                  return (
                    <Link
                      key={index + 2}
                      href={`/products?category=${categories.find((cat) => cat.Name == crumb).id}`}
                      className="text-gray-400 last:text-black"
                    >
                      {"> "}
                      {t(crumb)}
                    </Link>
                  );
                })}
            </div>
            <h2 className="text-xl font-bold">
              {product.name +
                " " +
                (product.internalCode != "0" ? product.internalCode : "")}
            </h2>
            {product.description && (
              <p className="mt-1 w-full border-t border-gray-400 pt-1">
                {product.description}
              </p>
            )}
            <div className="flex flex-row items-center gap-2">
              {product.priceBeforeDiscount <= product.value ? null : (
                <h3 className="font-bold text-gray-800 line-through">
                  {"€ " +
                    (cartAmount * product.priceBeforeDiscount)
                      .toFixed(2)
                      .replaceAll(".", ",")}
                </h3>
              )}
              <h3 className="text-lg font-bold">
                {"€ " +
                  (cartAmount * product.value).toFixed(2).replaceAll(".", ",")}
              </h3>
              {product.priceBeforeDiscount <= product.value ? null : (
                <div className="bg-green-700 p-1 font-bold  text-white">
                  {(
                    ((product.value - product.priceBeforeDiscount) /
                      product.priceBeforeDiscount) *
                    100
                  ).toFixed(0) + "%"}
                </div>
              )}
            </div>
            <div className="flex w-full flex-row justify-center border-b border-gray-400 pb-3 sm:justify-start">
              <ProductButtons
                product={product}
                amount={cartAmount}
                onChange={handleCartAmountChange}
              />
            </div>
            <div className="flex w-full flex-col gap-1">
              {product.height && product.height != 0 && (
                <p>
                  <b>{t("Height")}:</b> {product.height} cm
                </p>
              )}
              {product.width && product.width != 0 && (
                <p>
                  <b>{t("Width")}:</b> {product.width} cm
                </p>
              )}
              {product.depth && product.depth != 0 && (
                <p>
                  <b>{t("Length")}:</b> {product.depth} cm
                </p>
              )}
              {product.product_extra.surface_area &&
                product.product_extra.surface_area != "" && (
                  <p>
                    <b>{t("Surface")}:</b> {product.product_extra.surface_area}
                  </p>
                )}
              {product.product_extra.seat_height !== undefined &&
                product.product_extra.seat_height !== 0 && (
                  <p>
                    <b>{t("Seat Height")}:</b>{" "}
                    {product.product_extra.seat_height} cm
                  </p>
                )}
              {product.product_extra.armrest_height !== undefined &&
                product.product_extra.armrest_height !== 0 && (
                  <p>
                    <b>{t("Armrest Height")}:</b>{" "}
                    {product.product_extra.armrest_height} cm
                  </p>
                )}
              {product.color && (
                <p>
                  <b>{t("Color")}:</b> {product.color}
                </p>
              )}
              {product.material && (
                <p>
                  <b>{t("Material")}:</b> {product.material}
                </p>
              )}
              {breadCrumbs && (
                <div className="flex flex-row gap-2">
                  <b>{t("Categories")}: </b>
                  {breadCrumbs.map((crumb, index) => (
                    <Fragment key={index}>
                      <Link
                        href={`/products?category=${categories.find((cat) => cat.Name === crumb).id}`}
                      >
                        {t(crumb)}
                        {index < breadCrumbs.length - 1 && ","}
                      </Link>
                    </Fragment>
                  ))}
                </div>
              )}
              <div className="flex flex-row items-center gap-2">
                <b>{t("Share")}:</b>
                <Link
                  target="_blank"
                  aria-label="Share via Facebook"
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://horecadepot.meubelweb.com/products/${product.id}`}
                >
                  <Facebook />
                </Link>
                <Link
                  target="_blank"
                  aria-label="Share via Whatsapp"
                  href={`https://api.whatsapp.com/send?text=https://horecadepot.meubelweb.com/products/${product.id}`}
                >
                  <Image
                    src={"/assets/img/whatsapp.svg"}
                    width={30}
                    height={30}
                    alt="WhatsApp"
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
                      <ProductPreview width={"full"} product={prod} />
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
};

export const getStaticProps = async ({ params }: Params) => {
  const product = await getProductByID(Number.parseInt(params.id));
  const result = await getProducts({
    page: 1,
    category: product.category.id,
    count: 10,
    inStock: true,
  });
  const relatedProducts: Product[] = result[0]
    .filter((prd) => prd.id != product.id)
    .slice(0, 9) as Product[];

  const categories = await getAllCategoriesFlattened();

  let breadCrumbs;

  const buildBreadcrumbs = (categoryId, crumbs = []) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (category) {
      crumbs.push(category.Name);
      if (category.headCategory != null) {
        buildBreadcrumbs(category.headCategory.id, crumbs);
      } else {
        breadCrumbs = crumbs.reverse();
      }
    }
  };
  if (product.id && product.category) {
    buildBreadcrumbs(product.category.id);
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
          id: ID.toString(),
        },
      };
    }),
    fallback: "blocking",
  };
}

export default ProductPage;
