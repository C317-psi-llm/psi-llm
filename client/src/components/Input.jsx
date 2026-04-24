export default function Input({
  label,
  type = 'text',
  placeholder,
  className = '',
  ...props
}) {
  return (
    <label className="block w-full">
      {label && (
        <span className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </span>
      )}

      <input
        type={type}
        placeholder={placeholder}
        className={`w-full border-0 border-b border-gray-300 bg-transparent px-0 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition-colors duration-200 focus:border-blue-600 ${className}`}
        {...props}
      />
    </label>
  )
}
