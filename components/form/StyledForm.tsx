import { Divider } from "../styled/divider";
import { Button } from "../styled/button";
import { FiLoader, FiSave } from "react-icons/fi";

export default function StyledForm({
  children,
  bottomBarChildren,
  onSubmit,
  inProgress,
}: {
  children: React.ReactNode;
  bottomBarChildren?: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  inProgress?: boolean;
}) {
  return (
    <form className="rounded-lg bg-white shadow-sm" onSubmit={onSubmit}>
      <div className="relative space-y-12 px-4 py-5 sm:p-6">{children}</div>
      <div className="sticky bottom-0 flex flex-col items-end justify-center space-y-12 gap-x-6 rounded-lg bg-white px-4 pb-6 sm:px-6">
        <Divider />
        <div className="flex w-full flex-row items-center justify-between gap-2 pb-6">
          {bottomBarChildren}
          <Button
            color="green"
            type="submit"
            disabled={inProgress}
            className="ml-auto"
          >
            <div className="h-8 w-8 p-2">
              {inProgress ? (
                <FiLoader className="animate-spin text-black" />
              ) : (
                <FiSave />
              )}
            </div>
          </Button>
        </div>
      </div>
    </form>
  );
}
