import { Loader } from "react-feather";

type Props = {
  label?: String;
};

const LoadingIndicator = ({label}: Props) => {
  return (
    <div className="flex justify-center items-center flex-col min-h-[80dvh]">
      <Loader className="animate-spin text-orange-500" size={48} />
      {label && <p>{label}</p>}
    </div>
  );
};

export default LoadingIndicator;
