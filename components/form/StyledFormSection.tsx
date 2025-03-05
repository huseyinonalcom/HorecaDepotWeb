export default function StyledFormSection({ title, children }) {
  return (
    <div className="border-b border-gray-900/10 pb-12">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        {children}
      </div>
    </div>
  );
}
