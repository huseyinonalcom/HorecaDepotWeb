import useTranslation from "next-translate/useTranslation";
import { Divider } from "../styled/divider";

export default function StyledForm({
  children,
  bottomBarChildren,
  onSubmit,
}: {
  children: React.ReactNode;
  bottomBarChildren?: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const { t } = useTranslation("common");
  return (
    <form className="rounded-lg bg-white shadow-sm" onSubmit={onSubmit}>
      <div className="relative space-y-12 px-4 py-5 sm:p-6">{children}</div>
      <div className="sticky bottom-0 flex flex-col items-end justify-center gap-x-6 space-y-12 rounded-lg bg-white px-4 pb-6 sm:px-6">
        <Divider />
        <div className="flex flex-row w-full items-center justify-between gap-2 pb-6">
          {bottomBarChildren}
          <button
            type="submit"
            className="shadow-xs cursor-pointer rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {t("save")}
          </button>
        </div>
      </div>
    </form>
  );
}
