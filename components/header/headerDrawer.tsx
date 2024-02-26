import React, { useContext } from "react";
import { CartContext } from "../../api/providers/cartProvider";
import { X } from "react-feather";
import useTranslation from "next-translate/useTranslation";

const HeaderDrawer = ({ onClickOutside, isOpen }) => {
  const { t, lang } = useTranslation("common");
  const { cart, openDrawer, closeDrawer, calculateTotal } =
    useContext(CartContext);

  const drawerClass = isOpen ? "fixed z-50 right-0" : "fixed right-[-100%]";
  const overlayClass = isOpen
    ? "fixed inset-0 bg-black bg-opacity-50 z-40"
    : "fixed right-[-100%]";

  return (
    <>
      <div
        className={`${overlayClass} duration-700`}
        onClick={onClickOutside}
      ></div>
      <div
        className={`${drawerClass} top-0 min-w-[250px] h-screen bg-gray-100 p-5 z-50 overflow-y-auto duration-500`}
      >
        <button onClick={onClickOutside} className="w-full mb-2 duration-700">
          <div className="group flex w-full flex-row justify-between py-1 pl-2 pr-1 border-b border-gray-300">
            <p className="font-bold">{t("Panier")}</p>
            <X className="-rotate-180 group-hover:rotate-180 duration-700" />
          </div>
        </button>
      </div>
    </>
  );
};

export default HeaderDrawer;
