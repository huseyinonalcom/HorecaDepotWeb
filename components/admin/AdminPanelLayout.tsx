import useTranslation from "next-translate/useTranslation";
import LocaleSwitcher from "../LocaleSwitcher";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import {
  TagIcon,
  HomeIcon,
  UsersIcon,
  Bars2Icon,
  Bars3Icon,
  XMarkIcon,
  FolderIcon,
  BookOpenIcon,
  Cog8ToothIcon,
  ArchiveBoxIcon,
  RectangleGroupIcon,
  ClipboardDocumentListIcon,
  ChatBubbleBottomCenterIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogPanel,
  DialogBackdrop,
  TransitionChild,
} from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [
  { name: "stock", href: "/admin/stock/all", icon: ArchiveBoxIcon },
  { name: "orders", href: "/admin/orders", icon: ClipboardDocumentListIcon },
  { name: "homepage", href: "/admin/website/homepage", icon: HomeIcon },
  {
    name: "categories",
    href: "/admin/website/categories",
    icon: FolderIcon,
  },
  {
    name: "collections",
    href: "/admin/website/collections",
    icon: BookOpenIcon,
  },
  {
    name: "banners",
    href: "/admin/website/banners",
    icon: RectangleGroupIcon,
  },
  { name: "banner", href: "/admin/website/banner", icon: Bars2Icon },
  {
    name: "popup",
    href: "/admin/website/popup",
    icon: ChatBubbleBottomCenterIcon,
  },
  {
    name: "bulkkeywordsetter",
    href: "/admin/website/bulkkeywordsetter",
    icon: TagIcon,
  },
];

const adminNavigation = [
  { name: "users", href: "/admin/users", icon: UsersIcon },
  { name: "settings", href: "/admin/settings", icon: Cog8ToothIcon },
];

export default function AdminPanelLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t, lang } = useTranslation("common");
  const [userTier, setUserTier] = useState(8);
  const router = useRouter();

  useEffect(() => {
    validateSession();
    console.log(router.pathname);
    console.log(title);
  }, [router.pathname]);

  const validateSession = async () => {
    const data = await fetch("/api/private/auth/checkloggedinuser");
    const answer = await data.json();
    if (data.status == 200) {
      if (answer.role != "Tier 9" && answer.role != "Tier 8") {
        router.push("/stock/list/all");
      } else {
        setUserTier(Number(answer.role.replaceAll("Tier ", "")));
      }
    } else {
      router.push(
        `/admin?destination=${encodeURIComponent(window.location.pathname)}`,
      );
    }
  };

  if (userTier == 9) {
    navigation.push(...adminNavigation);
  }

  return (
    <>
      <Head>
        <meta name="language" content={lang} />
      </Head>
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="data-closed:opacity-0 fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="data-closed:-translate-x-full relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out"
            >
              <TransitionChild>
                <div className="data-closed:opacity-0 absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">{t("close-menu")}</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                <div className="flex h-16 shrink-0 items-center">
                  <Image
                    alt="Horeca Depot Logo"
                    src="/assets/header/logob.png"
                    className="h-8 w-auto"
                    height={32}
                    width={179}
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className={classNames(
                                t(item.name) == title
                                  ? "bg-gray-50 text-indigo-600"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  t(item.name) == title
                                    ? "text-indigo-600"
                                    : "text-gray-400 group-hover:text-indigo-600",
                                  "size-6 shrink-0",
                                )}
                              />
                              {t(item.name)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                  <LocaleSwitcher />
                  <button
                    name="logout"
                    aria-label="Logout"
                    onClick={async () => {
                      await fetch("/api/admin/logout").then(() => {
                        router.push(`/`);
                      });
                    }}
                    className="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                  >
                    <ArrowRightStartOnRectangleIcon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                    />
                    {t("logout")}
                  </button>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
            <div className="flex h-16 shrink-0 items-center">
              <Image
                alt="Horeca Depot Logo"
                src="/assets/header/logob.png"
                className="h-8 w-auto"
                height={32}
                width={179}
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            t(item.name) == title
                              ? "bg-gray-50 text-indigo-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                            "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              t(item.name) == title
                                ? "text-indigo-600"
                                : "text-gray-400 group-hover:text-indigo-600",
                              "size-6 shrink-0",
                            )}
                          />
                          {t(item.name)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
              <LocaleSwitcher />
              <button
                name="logout"
                aria-label="Logout"
                onClick={async () => {
                  await fetch("/api/admin/logout").then(() => {
                    router.push(`/`);
                  });
                }}
                className="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
              >
                <ArrowRightStartOnRectangleIcon
                  aria-hidden="true"
                  className="size-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                />
                {t("logout")}
              </button>
            </nav>
          </div>
        </div>

        <div className="shadow-xs sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          >
            <span className="sr-only">{t("open-menu")}</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
          <div className="flex-1 text-sm/6 font-semibold text-gray-900">
            {title}
          </div>
        </div>

        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  );
}
