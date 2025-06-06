
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Controller , Control , FieldValues, Path} from "react-hook-form"

interface formFieldProps<T extends FieldValues> {
    control: Control<T> ,
    name : Path<T>,
    label: string ,
    placeholder: string ,
    type?: "text" | "email" | "password" | 'file'
}

const FormInputField =<T extends FieldValues>({control , name , label ,placeholder, type ="text"}: formFieldProps<T>) =>{
    return (
        <Controller 
        name = {name} 
        control = {control} 
        render = {({field})=>(
            <FormItem>
            <FormLabel className="label">{label}</FormLabel>
            <FormControl>
              <Input className="input" placeholder={placeholder} type={type} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
          )}
          />
        )}

        export default FormInputField;