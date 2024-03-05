import Head from "next/head";
import Meta from "../../components/public/meta";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/public/layout";
import { Product } from "../../api/interfaces/product";
import {
  getAllProductIDs,
  getProductByID,
  getProducts,
} from "../../api/calls/productCalls";
import ProductPreview from "../../components/products/product-preview";
import ProductButtons from "../../components/products/product-buttons";
import { Fragment, useState } from "react";
import { ArrowLeft, Facebook } from "react-feather";
import Link from "next/link";
import { getAllCategoriesFlattened } from "../api/categories/public/getallcategoriesflattened";

type Props = {
  product: Product;
  relatedProducts: Product[];
  categories;
  breadCrumbs;
};

const ProductPage = ({
  product,
  relatedProducts,
  categories,
  breadCrumbs,
}: Props) => {
  const { t, lang } = useTranslation("common");

  const [cartAmount, setCartAmount] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const imageBase =
    "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000";
  const imageVisible = "opacity-100 z-40";
  const imageInvisible = "opacity-0";

  // useEffect(() => {
  //   setCurrentImage(0);
  //   fetchCategories();
  // }, [product]);

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
      <div className="w-full flex flex-col items-center pt-2">
        <div className="flex flex-row gap-1 font-bold text-sm">
          <Link key={1} href={"/"}>
            {t("Page d'acceuil")}
          </Link>

          <Link key={2} href={"/products"}>
            {"> "}
            {t("Shop")}
          </Link>
          {breadCrumbs &&
            breadCrumbs.map((crumb, index) => {
              return (
                <Link
                  key={index + 2}
                  href={`/products?category=${
                    categories.find((cat) => cat.Name == crumb).id
                  }`}
                >
                  {"> "}
                  {t(crumb)}
                </Link>
              );
            })}
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-[90vw]">
          <div className="relative h-[80vw] sm:h-[40vw] w-[80vw] sm:w-[40vw] flex flex-row items-center justify-center">
            <div className="relative mx-auto w-[80%] h-[80%]">
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
                    className={`${imageBase} ${
                      currentImage === index ? imageVisible : imageInvisible
                    }`}
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
                className="absolute left-0 z-40 w-[30%] h-full flex flex-col justify-center items-start"
                onClick={slidePrevious}
              >
                <ArrowLeft />
              </div>
            ) : null}
            {product.images && product.images.length > 1 ? (
              <div
                className="absolute right-0 z-40 w-[30%] h-full flex flex-col justify-center items-end"
                onClick={slideNext}
              >
                <ArrowLeft className="rotate-180" />
              </div>
            ) : null}
          </div>
          <div className="flex flex-col pl-2 items-center sm:items-start gap-2">
            <h2 className="font-bold text-lg">
              {product.name +
                " " +
                (product.internalCode != "0" ? product.internalCode : "")}
            </h2>
            <div className="flex flex-row gap-2 items-center">
              {product.priceBeforeDiscount <= product.value ? null : (
                <>
                  <div className="font-bold text-white bg-green-700  p-1">
                    {(
                      ((product.value - product.priceBeforeDiscount) /
                        product.priceBeforeDiscount) *
                      100
                    ).toFixed(0) + "%"}
                  </div>
                  <h3 className="font-bold line-through text-gray-800">
                    {"€ " +
                      (cartAmount * product.priceBeforeDiscount)
                        .toFixed(2)
                        .replaceAll(".", ",")}
                  </h3>
                </>
              )}
              <h3 className="font-bold text-lg">
                {"€ " +
                  (cartAmount * product.value).toFixed(2).replaceAll(".", ",")}
              </h3>
            </div>
            {product.description && <p>{product.description}</p>}
            <div className="w-full flex flex-row justify-center sm:justify-start">
              <ProductButtons
                product={product}
                amount={cartAmount}
                onChange={handleCartAmountChange}
              />
            </div>
            {(product.height && product.height) != 0 && (
              <p>
                <b>{t("Hauteur")}:</b> {product.height} cm
              </p>
            )}
            {(product.width && product.width) != 0 && (
              <p>
                <b>{t("Largeur")}:</b> {product.width} cm
              </p>
            )}
            {(product.depth && product.depth) != 0 && (
              <p>
                <b>{t("Longueur")}:</b> {product.depth} cm
              </p>
            )}
            {product.product_extra.seat_height != 0 && (
              <p>
                <b>{t("Hauteur d'assise")}:</b>{" "}
                {product.product_extra.seat_height} cm
              </p>
            )}
            {product.product_extra.armrest_height != 0 && (
              <p>
                <b>{t("Hauteur Accoudoir")}:</b>{" "}
                {product.product_extra.armrest_height} cm
              </p>
            )}
            {product.color && (
              <p>
                <b>{t("Couleur")}:</b> {product.color}
              </p>
            )}
            {product.material && (
              <p>
                <b>{t("Matériel")}:</b> {product.material}
              </p>
            )}
            {breadCrumbs && (
              <div className="flex flex-row gap-2">
                <b>{t("Catégories")}: </b>
                {breadCrumbs.map((crumb, index) => (
                  <Fragment key={index}>
                    <Link
                      href={`/products?category=${
                        categories.find((cat) => cat.Name === crumb).id
                      }`}
                    >
                      {t(crumb)}
                      {index < breadCrumbs.length - 1 && ","}
                    </Link>
                  </Fragment>
                ))}
              </div>
            )}
            <div className="flex flex-row items-center gap-2">
              <b>{t("Partager")}:</b>
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
        {relatedProducts.length < 2 ? null : (
          <>
            <h2 className="w-full flex flex-row justify-center text-xl font-bold mt-6">
              {t("PRODUITS APPARENTÉS")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-[90%]">
              {relatedProducts.map((product) => (
                <div
                  onClick={() => setCurrentImage(0)}
                  key={product.id}
                  className="w-full mt-2 mb-2"
                >
                  <ProductPreview product={product} width={"full"} />
                </div>
              ))}
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
    .slice(0, 6) as Product[];

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
