type Props = {
  onClick?: VoidFunction;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
};

const ButtonShadow1 = ({ onClick, children, type }: Props) => {
  return (
    <button
      onClick={onClick}
      type={type || "button"}
      className="group relative inline-flex items-center justify-center overflow-hidden border border-neutral-200 bg-transparent font-medium text-neutral-600 transition-all duration-100 [box-shadow:2px_3px_rgb(82_82_82)] active:translate-x-[2px] active:translate-y-[2px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
    >
      {children}
    </button>
  );
};

export default ButtonShadow1;
