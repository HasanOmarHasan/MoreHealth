import React from "react";

type Props = {
  name: string;
  type?: "email" | "text" | "password" | "number";
  placeholder?: string;
  column?: "sm:col-span-3";
  error?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  select?: string;
  value?: string;
  value2?: string;
};

export default function InputItem({
  name,
  type,
  placeholder,
  column,
  error,
  onBlur,
  onChange,
  required,
  select,
  value,
  value2,
}: Props) {
  if (select) {
    return (
      <div className={`col-span-6 ${column}`}>
        <label
          htmlFor={name}
          className="  rounded-md  shadow-xs "
        >
          {" "}
         {" "}
        </label>

        <select
          name={name}
          id={name}
          className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm  peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:ring-0 focus:outline-hidden h-10 px-4 "
        >
          <option value="">{select} </option>
          <option value={value}>{value} </option>
          <option value={value2}>{value2} </option>
        </select>
      </div>
    );
  }
  return (
    <>
      {/* sm:col-span-3 */}
      <div className={`col-span-6 ${column}`}>
        <label
          htmlFor={name}
          className="relative block rounded-md border border-gray-200 shadow-xs focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
        >
          <input
            type={type}
            id={name}
            name={name}
            className={`peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:ring-0 focus:outline-hidden h-10 px-4  w-full ${
              error ? "border-red-500" : ""
            } `}
            placeholder={placeholder}
            onBlur={onBlur}
            onChange={onChange}
          />

          <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
            {placeholder}{" "}
            {required && <sup className="text-red-600 text-sm ">*</sup>}
          </span>
        </label>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </>
  );
}
