type Props = {
  onClick?: VoidFunction;
  children: React.ReactNode;
};

const ButtonShadow1 = ({ onClick, children }: Props) => {
  return (
    <button
      onClick={onClick}
      className="group relative inline-flex items-center p-2 justify-center overflow-hidden border border-neutral-200 bg-transparent font-medium text-neutral-600 transition-all duration-100 [box-shadow:3px_3px_rgb(82_82_82)] hover:translate-x-[2px] hover:translate-y-[2px] hover:[box-shadow:0px_0px_rgb(82_82_82)]"
    >
      {children}
    </button>
  );
};

export default ButtonShadow1;
