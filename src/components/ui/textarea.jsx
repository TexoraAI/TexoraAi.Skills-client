import * as React from "react"

const Textarea = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`
        w-full min-h-[100px] px-3 py-2 rounded-md
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

Textarea.displayName = "Textarea"

export { Textarea }
