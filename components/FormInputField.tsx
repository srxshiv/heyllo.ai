import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Controller, Control, FieldValues, Path } from "react-hook-form"
import { motion } from "framer-motion"

interface formFieldProps<T extends FieldValues> {
  control: Control<T>,
  name: Path<T>,
  label: string,
  placeholder: string,
  type?: "text" | "email" | "password" | 'file'
}

const FormInputField = <T extends FieldValues>({
  control, 
  name, 
  label, 
  placeholder, 
  type = "text"
}: formFieldProps<T>) => {
  return (
    <Controller 
      name={name} 
      control={control} 
      render={({ field, fieldState }) => (
        <FormItem className="space-y-2">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FormLabel className="text-sm font-medium text-gray-700/90">
              {label}
            </FormLabel>
            <FormControl>
              <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.02 }}>
                <Input 
                  className={`w-full px-4 py-3 bg-white/70 backdrop-blur-sm rounded-xl text-gray-800 placeholder-gray-400/80
                    focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-1
                    transition-all duration-200 shadow-sm ${fieldState.error ? 'border-red-300/50' : 'border-transparent'}`}
                  placeholder={placeholder} 
                  type={type} 
                  {...field} 
                />
              </motion.div>
            </FormControl>
            <FormMessage className="text-xs text-red-500/90" />
          </motion.div>
        </FormItem>
      )}
    />
  )
}

export default FormInputField