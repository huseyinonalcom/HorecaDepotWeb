export const OutlinedButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full flex-row items-center justify-center border-1 border-black p-2 font-bold text-black duration-300 hover:bg-neutral-200">
      {children}
    </div>
  );
};
