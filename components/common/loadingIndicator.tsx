import { FiLoader } from "react-icons/fi";

type Props = {
  label?: String;
};

const LoadingIndicator = ({ label }: Props) => {
  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center">
      <FiLoader className="animate-spin text-orange-500" size={48} />
      {label && <p>{label}</p>}
    </div>
  );
};

export default LoadingIndicator;
