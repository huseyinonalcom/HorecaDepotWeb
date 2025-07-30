import { ProductPreviewCustom } from "../../../components/products/product-preview-custom";
import { ProductSelector } from "../../../components/selector/ProductSelector";
import { Fieldset, Label, Legend } from "../../../components/styled/fieldset";
import LoadingIndicator from "../../../components/common/loadingIndicator";
import AdminPanelLayout from "../../../components/admin/AdminPanelLayout";
import { Switch, SwitchField } from "../../../components/styled/switch";
import StyledForm from "../../../components/form/StyledForm";
import { Divider } from "../../../components/styled/divider";
import useTranslation from "next-translate/useTranslation";
import { Button } from "../../../components/styled/button";
import { Input } from "../../../components/styled/input";
import { FiCopy, FiTrash } from "react-icons/fi";
import { CSSProperties, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { CSS } from "@dnd-kit/utilities";
import Head from "next/head";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";

const DraggableProduct = ({ product, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: product.id,
      animateLayoutChanges: () => false,
    });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      key={product.id}
      role="button"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`w-[50vw] bg-white md:w-[33vw] lg:w-[250px] ${isDragging ? "z-[99]" : ""}`}
    >
      <ProductPreviewCustom onClick={onClick} product={product} />
    </div>
  );
};

export default function Collection() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currentCollection, setCurrentCollection] = useState({
    id: 0,
    name: "",
    products: [],
    featured: false,
  });

  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchCollection = async (collectionID: number) => {
    const request = await fetch(`/api/private/collections?id=${collectionID}`, {
      method: "GET",
    });
    const response = await request.json();
    if (request.ok) {
      return response;
    } else {
      setIsLoading(false);
      return;
    }
  };

  useEffect(() => {
    if (router.isReady && router.query.id) {
      if (
        !Number.isSafeInteger(Number(router.query.id)) ||
        Number(router.query.id) <= 0
      ) {
        setIsLoading(false);
        return;
      }

      const collectionID: number = Number(router.query.id);

      if (collectionID) {
        fetchCollection(collectionID)
          .then(async (coll) => {
            setCurrentCollection(coll);
            setIsLoading(false);
          })
          .catch((_) => {
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    } else setIsLoading(false);
  }, [router.isReady, router.query.id]);

  const postCollection = async ({ data }: { data: any }) => {
    const request = await fetch(`/api/private/collections`, {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        products: data.products.map((pro) => pro.id),
        featured: data.featured,
      }),
    });
    if (request.ok) {
      const answer = await request.json();
      if (!answer.result) {
        setSubmitError(answer.error);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      router.push(`/admin/website/collection?id=${answer.result.data.id}`);
    } else {
      const answer = await request.text();
      setIsLoading(false);
      setSubmitError(t("collection_submit_error"));
    }
  };

  const putCollection = async ({ data }: { data: any }) => {
    const request = await fetch(`/api/private/collections?id=${data.id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: data.name,
        products: data.products.map((pro) => pro.id),
        featured: data.featured,
      }),
    });
    if (request.ok) {
      const answer = await request.json();
      console.log(answer);
      router.push("/admin/website/collections");
    } else {
      const answer = await request.text();
      console.error(answer);
      setSubmitError(t("collection_modify_error"));
    }
  };

  const deleteCollection = async () => {
    const deleteColl = async () => {
      try {
        const request = await fetch(
          `/api/private/collections?id=` + currentCollection.id,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (!request.ok) {
        } else {
          router.push("/admin/website/collections");
        }
      } catch {}
    };

    let confirmDelete = confirm(t("confirm_delete_collection"));

    if (confirmDelete) {
      deleteColl();
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    if (currentCollection.id != 0) {
      try {
        await putCollection({ data: currentCollection });
      } catch (error) {
        setIsLoading(false);
        setSubmitError(error);
      }
    } else {
      try {
        await postCollection({ data: currentCollection });
      } catch (error) {
        setIsLoading(false);
        setSubmitError(error);
      }
    }
  };

  return (
    <>
      <Head>
        <title>{t("collection")}</title>
      </Head>
      {isLoading && (
        <div className="fixed inset-0 z-[99] flex h-full w-full items-center justify-center bg-white">
          <LoadingIndicator />
        </div>
      )}
      <StyledForm
        bottomBarChildren={
          <>
            {currentCollection.id != 0 && (
              <>
                <div className="flex flex-row gap-6">
                  <Button type="button" color="red" onClick={deleteCollection}>
                    <div className="p-2">
                      <FiTrash />
                    </div>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setCurrentCollection((pr) => ({
                        ...pr,
                        id: 0,
                      }));
                    }}
                    color="white"
                  >
                    <div className="p-2">
                      <FiCopy />
                    </div>
                  </Button>
                </div>
              </>
            )}
            {submitError && (
              <p className="bg-white p-1 text-red-400">{submitError}</p>
            )}
          </>
        }
        onSubmit={handleFormSubmit}
      >
        <div className="hidden flex-row space-x-6 lg:flex">
          <div className="flex w-full flex-col space-y-12 border-r border-zinc-950/10 pr-6">
            <Input
              label={t("name")}
              required
              name="name"
              value={currentCollection.name}
              onChange={(e) =>
                setCurrentCollection((pc) => ({
                  ...pc,
                  name: e.target.value,
                }))
              }
            />
            <SwitchField className="flex flex-row items-start">
              <Label>{t("active")}</Label>
              <Switch
                defaultChecked={currentCollection.featured}
                color="green"
                onChange={(e) => {
                  setCurrentCollection((pp) => ({
                    ...pp,
                    featured: e,
                  }));
                }}
              />
            </SwitchField>
            <Divider />
            <Fieldset>
              <Legend>{t("products")}</Legend>
              <div className="flex flex-wrap gap-2">
                <DndContext
                  sensors={[
                    useSensor(PointerSensor, {
                      activationConstraint: { distance: 10 },
                    }),
                  ]}
                  autoScroll={{ enabled: false }}
                  key="dnd-1"
                  collisionDetection={closestCenter}
                  onDragEnd={(e) => {
                    const { active, over } = e;

                    let items = currentCollection.products;

                    const activeIndex = items.indexOf(
                      items.find((p) => p.id == active.id),
                    );
                    const overIndex = items.indexOf(
                      items.find((p) => p.id == over.id),
                    );

                    if (activeIndex === overIndex) {
                      return;
                    }

                    if (active.id !== over.id) {
                      setCurrentCollection((pc) => ({
                        ...pc,
                        products: arrayMove(items, activeIndex, overIndex),
                      }));
                    }
                  }}
                >
                  <SortableContext
                    key="sortable-1"
                    strategy={rectSortingStrategy}
                    items={currentCollection.products}
                  >
                    {currentCollection?.products?.map((product) => (
                      <DraggableProduct
                        product={product}
                        onClick={() =>
                          setCurrentCollection((pc) => ({
                            ...pc,
                            products: pc.products.filter(
                              (p) => p.id !== product.id,
                            ),
                          }))
                        }
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            </Fieldset>
            <Divider />
            <ProductSelector
              onProductSelected={(prod) => {
                if (currentCollection.products.some((p) => p.id === prod.id)) {
                } else {
                  setCurrentCollection((pc) => ({
                    ...pc,
                    products: [...pc.products, prod],
                  }));
                }
              }}
            />
          </div>
        </div>
      </StyledForm>
    </>
  );
}

Collection.getLayout = function getLayout(children) {
  const { t } = useTranslation("common");
  return (
    <AdminPanelLayout title={t("collections")}>{children}</AdminPanelLayout>
  );
};
