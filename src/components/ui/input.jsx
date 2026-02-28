import * as React from "react"

const Input = React.forwardRef(({ className = "", type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={`
        w-full h-10 px-3 py-2 rounded-md
        border border-gray-300
        bg-white text-black
        placeholder:text-gray-400
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        dark:bg-[#1F2937] dark:text-white dark:border-white/10
        ${className}
      `}
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }
