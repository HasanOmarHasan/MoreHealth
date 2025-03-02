import React from "react";
import { Link } from "react-router";
import Loader from "./Loader";

type pop = {
  content: string;
  width?: string;
  type?: "border";
  link?: string;
  btnType?: 'submit'; 
  disabled?: boolean;
  isLoading?: boolean;
  

};

export default function Button({ content, width, type, link = "#", btnType, disabled = false, isLoading = false }: pop) {
  const base = `inline-block focus:ring-2 focus:outline-hidden border border-blue-600 px-12 py-3 text-sm font-medium transition rounded-md ${
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer "
  }`;

  const solid = `${base} shrink-0   bg-blue-600  text-white  hover:bg-transparent hover:text-blue-600 `;
  const border = `${base}  text-blue-600 hover:bg-blue-600 hover:text-white   `;

  return (
    <>
      <button className={`${type ? border : solid} ${width}`} type={btnType} disabled={disabled} >
        {link !== "#" ? (
          <>
            <Link to={link}>{content}</Link>
          </>
        ) : (
            <> {isLoading && <Loader size="btn" color="text-blue" />}  {content}</>
            
        )}
      </button>
    </>
  );
}
  