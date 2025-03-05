export default function PageHeader({ children }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-8 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}
