import { getAllCategoriesFlattened } from "../api/categories/public/getallcategoriesflattened";
import { getAllProductIDs, getProductByID, getProducts } from "../../api/calls/productCalls";
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

type Props = {
  relatedProducts: Product[];
  product: Product;
  breadCrumbs;
  categories;
};

const ProductPage = ({ product, relatedProducts, categories, breadCrumbs }: Props) => {
  const { t, lang } = useTranslation("common");

  const [cartAmount, setCartAmount] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const imageBase = "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000";
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

  const containerRef = useRef(null);

  const handleScroll = (scrollOffset) => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += scrollOffset;
    }
  };

  return (
    <Layout>
      <Meta />
      <Head>
        <title>{product.name + " " + product.internalCode + " | Horeca Depot | Meubles pour Hotels, Restaurants ..."}</title>
        <meta name="keywords" content={tags ?? "test"} />
        <meta
          property="og:image"
          content={product.images != null ? "https://hdapi.huseyinonalalpha.com" + product.images.at(0).url : "/assets/img/placeholder.png"}
        />
        <meta name="language" content={lang} />
        <meta name="description" content={product.name + " " + t(product.category.Name)} />
        <meta name="subject" content={"" + product.name + ""} />
        <link rel="canonical" href={"https://horecadepot.be/products/" + product.id} />
      </Head>
      <div className="w-full flex flex-col items-center pt-2">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-[90vw] justify-center">
          <div className="relative h-[80vw] sm:h-[30vw] w-[80vw] sm:w-[30vw] flex flex-row items-center justify-center flex-shrink-0">
            <div className="relative mx-auto w-[90%] h-[90%]">
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
                <Image key={1} src={`/assets/img/placeholder.png`} fill style={{ objectFit: "cover" }} alt={product.name} className={`${imageBase}`} />
              )}
            </div>
            {product.images && product.images.length > 1 ? (
              <div className="absolute left-0 z-40 w-[30%] h-full flex flex-col justify-center items-start" onClick={slidePrevious}>
                <ArrowLeft />
              </div>
            ) : null}
            {product.images && product.images.length > 1 ? (
              <div className="absolute right-0 z-40 w-[30%] h-full flex flex-col justify-center items-end" onClick={slideNext}>
                <ArrowLeft className="rotate-180" />
              </div>
            ) : null}
          </div>
          <div className="flex flex-col pl-2 items-center sm:items-start gap-2">
            <div className="flex flex-row gap-1 font-bold text-xs">
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
            <h2 className="font-bold text-xl">{product.name + " " + (product.internalCode != "0" ? product.internalCode : "")}</h2>
            {product.description && <p className="border-t w-full border-gray-400 mt-1 pt-1">{product.description}</p>}
            <div className="flex flex-row gap-2 items-center">
              {product.priceBeforeDiscount <= product.value ? null : (
                <h3 className="font-bold line-through text-gray-800">{"€ " + (cartAmount * product.priceBeforeDiscount).toFixed(2).replaceAll(".", ",")}</h3>
              )}
              <h3 className="font-bold text-lg">{"€ " + (cartAmount * product.value).toFixed(2).replaceAll(".", ",")}</h3>
              {product.priceBeforeDiscount <= product.value ? null : (
                <div className="font-bold text-white bg-green-700  p-1">
                  {(((product.value - product.priceBeforeDiscount) / product.priceBeforeDiscount) * 100).toFixed(0) + "%"}
                </div>
              )}
            </div>
            <div className="w-full flex flex-row justify-center sm:justify-start border-b border-gray-400 pb-3">
              <ProductButtons product={product} amount={cartAmount} onChange={handleCartAmountChange} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="grid grid-cols-1 w-full content-left gap-2 md:grid-cols-2">
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
                {product.product_extra.surface_area && product.product_extra.surface_area != "" && (
                  <p>
                    <b>{t("Surface")}:</b> {product.product_extra.surface_area}
                  </p>
                )}
              </div>
              {product.product_extra.seat_height !== undefined && product.product_extra.seat_height !== 0 && (
                <p>
                  <b>{t("Seat Height")}:</b> {product.product_extra.seat_height} cm
                </p>
              )}
              {product.product_extra.armrest_height && product.product_extra.armrest_height !== 0 && (
                <p>
                  <b>{t("Armrest Height")}:</b> {product.product_extra.armrest_height} cm
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
                      <Link href={`/products?category=${categories.find((cat) => cat.Name === crumb).id}`}>
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
                  <Image src={"/assets/img/whatsapp.svg"} width={30} height={30} alt="WhatsApp" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        {relatedProducts.length < 2 ? null : (
          <>
            <h2 className="w-full flex flex-row justify-center text-xl font-bold mt-6">{t("RELATED PRODUCTS")}</h2>
            <div className={`flex relative flex-col w-full px-2 h-full`}>
              <div className="flex flex-row py-2 h-full overflow-x-scroll no-scrollbar" ref={containerRef} style={{ scrollBehavior: "smooth" }}>
                <div className="w-full h-full items-center gap-2 flex">
                  {relatedProducts.map((prod) => (
                    <div key={prod.id} className="flex w-[40vw] md:w-[20vw] md:aspect-[10/16] flex-shrink-0 p-1 items-center last:mr-4">
                      <ProductPreview width={"full"} product={prod} />
                    </div>
                  ))}
                </div>
              </div>
              {relatedProducts.length > 3 && (
                <div className="absolute left-1 top-0 z-20 h-full flex items-center" onClick={() => handleScroll(-250)}>
                  <ArrowLeft className="cursor-pointer bg-orange-400 h-8 p-0.5 hover:animate-pulse" />
                </div>
              )}
              {relatedProducts.length > 3 && (
                <div className="absolute right-1 top-0 z-20 h-full flex items-center" onClick={() => handleScroll(250)}>
                  <ArrowLeft className="cursor-pointer rotate-180 bg-orange-400 h-8 p-0.5 hover:animate-pulse" />
                </div>
              )}
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
  const relatedProducts: Product[] = result[0].filter((prd) => prd.id != product.id).slice(0, 9) as Product[];

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
