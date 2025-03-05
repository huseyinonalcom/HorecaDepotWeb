export default function StyledForm({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form
      className="overflow-hidden rounded-lg bg-white shadow-sm"
      onSubmit={onSubmit}
    >
      <div className="space-y-12 px-4 py-5 sm:p-6">
        {children}
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="shadow-xs rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
