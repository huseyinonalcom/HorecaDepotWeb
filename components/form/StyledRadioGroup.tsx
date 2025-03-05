export default function StyledRadioGroup({
  name,
  options,
  selectedValue,
}: {
  name: string;
  options: { value: string; label: string }[];
  selectedValue: string;
}) {
  return (
    <fieldset>
      <div className="mt-6 space-y-6">
        {options.map(({ value, label }) => (
          <div key={value} className="flex items-center gap-x-3">
            <input
              defaultChecked={selectedValue === value}
              id={`${name}-${value}`}
              name={name}
              type="radio"
              value={value}
              className="not-checked:before:hidden relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
            />
            <label
              htmlFor={`${name}-${value}`}
              className="block text-sm font-medium text-gray-900"
            >
              {label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}
