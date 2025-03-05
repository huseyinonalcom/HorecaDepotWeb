export default function InputField({
  label,
  name,
  defaultValue = "",
  type = "text",
}) {
  return (
    <div className="col-span-full">
      <label htmlFor={name} className="block text-sm font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <input
          defaultValue={defaultValue}
          id={name}
          name={name}
          type={type}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
        />
      </div>
    </div>
  );
}
