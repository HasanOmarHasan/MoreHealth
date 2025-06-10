
type Props = { size?:   "btn" , color?: string  };
export default function Loader({ size , color = 'text-blue-600' }: Props) {

  return (
    <div className={` ${size==="btn" ? " " : "absolute inset-0 flex items-center justify-center bg-slate-200/20 backdrop-blur-sm"}`} >
    

      <div
        className={`animate-spin inline-block ${size==="btn" ? "size-6" : "size-12"}  border-[3px] border-current border-t-transparent ${color} rounded-full dark:text-blue-500"`}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
