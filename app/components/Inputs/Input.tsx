'use client'
import { UseFormRegisterReturn } from "react-hook-form";
import { useEffect } from "react";
import { toast } from 'react-hot-toast';
import {BiDollar} from 'react-icons/bi';
import { FieldErrors,
         FieldValues,
         UseFormRegister
     } from "react-hook-form";
interface InputProps {
    id:string;
    label:string;
    type?:string;
    disabled?:boolean;
    formatPrice?:boolean;
    required?:boolean;
    // register: UseFormRegisterReturn;
    register:UseFormRegister<FieldValues>,
    // register: ReturnType<UseFormRegister<FieldValues>>,
    errors:FieldErrors;
}
const Input: React.FC<InputProps> =({
    id,
    label,
    type="text",
    disabled,
    formatPrice,
    register,
    required,
    errors
})=>{

    // useEffect(() => {
    //     if (errors[id]?.message) {
    //       toast.error(errors[id]?.message.toString());
    //     }
    //   }, [errors, id]);

    useEffect(() => {
        const message = errors[id]?.message;
        if (typeof message === 'string') {
          toast.dismiss(); // optional: prevents multiple toasts
          toast.error(message);
        }
      }, [errors, id]);

    return(
        <div className="w-full relative">{
            formatPrice && (
                <BiDollar
                size={24}
                className="text-neutral-700
                absolete
                top-5
                left-2
                "
                />
            )
        }
        <input
        id={id}
        disabled={disabled}
        //{...register(id,{required})}


        // {...register(id, {
        //     required: required ? `${label} is required` : false,
        //     pattern: id === 'email'
        //       ? {
        //           value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        //           message: 'Invalid email address',
        //         }
        //       : undefined,
        //     minLength: id === 'password'
        //       ? {
        //           value: 6,
        //           message: 'Password must be at least 6 characters',
        //         }
        //       : undefined,
        //     validate: id === 'password'
        //       ? (value) =>
        //           /[A-Za-z]/.test(value) && /\d/.test(value) ||
        //           "Password must contain letters and numbers"
        //       : undefined
        //   })}
          

        {...register(id, {
            required: required ? `${label} is required` : false,
            pattern: id === 'email'
              ? {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
                }
              : undefined,
            minLength: id === 'password'
              ? {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                }
              : undefined,
            validate: id === 'password'
              ? (value) =>
                  /[A-Za-z]/.test(value) && /\d/.test(value) ||
                  "Password must contain letters and numbers"
              : undefined,
          })}

        placeholder=" "
        type={type}
        className={`
        peer
        w-full
        p-4
        pt-6
        font-light
        bg-white
        border-2
        rounded-md
        outline-none
        transition
        disabled:opacity-70
        disabled:cursor-not-allowed
        ${formatPrice ? 'pl-9' : 'pl-4'}
        ${errors[id] ?'border-rose-500'  : 'border-neutral-300'}
        ${errors[id] ?'focus:border-rose-500'  : 'focus:border-black'}
        // ${errors[id] ? 'border-rose-500' : 'border-[#ccc]'}
        // ${errors[id] ? 'focus:border-rose-500' : 'focus:border-[#7f69bf]'}
        //bg-[#7f69bf]
        `}
        />
        <label className={`
        absolute
        text-md
        duration-150
        transform
        -translate-y-3
        top-5
        z-10
        origin-[0]
        ${formatPrice ? 'left-9' : 'left-4'}
        peer-placeholder-shown:scale-100
        peer-placeholder-shown:translate-y-0
        peer-focus:scale-75
        peer-focus:-translate-y-4
        ${errors[id]? 'text-rose-500':'text-zinc-400'}
        // ${errors[id] ? 'text-rose-500' : 'text-[#7f69bf]'}
        `}>{label}</label>
        </div>
    )
}
export default Input;