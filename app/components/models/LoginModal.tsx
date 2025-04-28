'use client'
import {signIn} from 'next-auth/react';
import axios, { toFormData } from 'axios'; 
import {AiFillGithub } from "react-icons/ai";
import {FcGoogle} from "react-icons/fc";
import { useCallback, useState} from 'react';
import {
    FieldValues,
    SubmitHandler,
    useForm,
} from 'react-hook-form';
import useLoginModal from '@/app/hooks/useLoginModal';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../Inputs/Input';
import { isAbsoluteUrl } from 'next/dist/shared/lib/utils';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Button from '../Button';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import { redirect } from 'next/dist/server/api-utils';
import RegisterModal from './RegisterModal';
const LoginModal= ()=>{
    const router= useRouter();
    const registerModal =useRegisterModal();
    const LoginModal = useLoginModal();
    const [isLoading, setIsLoading] =useState(false);

    const {
        register,
        handleSubmit,
        formState :{
            errors,
        }

    }= useForm<FieldValues>({
        defaultValues:{
            
            email:'',
            password:''
        }
    });
    const onSubmit: SubmitHandler<FieldValues> =(data)=>{
        setIsLoading(true);
        
       signIn('credentials',{
        ...data,
        redirect: false,

       })
       .then((callback)=>{
        setIsLoading(false);
        if(callback?.ok){
            toast.success('logged in');
            router.refresh();
            LoginModal.onClose();
        }
        else if(callback?.error){
            toast.error('error');
        }
       })
    }
    const toggle=useCallback(
      () => {
       LoginModal.onClose();
       registerModal.onOpen();
      },
      [LoginModal,registerModal],
    )
    
    const bodyContent =(
        <div className="flex flex-col gap-4">
           <Heading
           title="Welcome Back"
           subtitle="Login to you account!"
           center/>

           <Input
           id="email"
           label="Email"
           disabled={isLoading}
           register={register}
           errors={errors}
           required/>
           <Input
           id="password"
           label="Password"
           type="password"
           disabled={isLoading}
           register={register}
           errors={errors}
           required/>
        </div>

    );
    const footerContent=(
        <div className="flex flex-col gap-4 mt-3">
            <hr/>
          <Button
          outline
          label ="continue with Google"
          icon={FcGoogle}
          onClick={()=>signIn('google')}
          />
          {/* <Button
          outline
          label="continue with Github"
          icon={AiFillGithub}
          onClick={()=>signIn('github')}
          /> */}
          <div className="
            text-neutral-500
            text-center
            mt-4
            font-light">
                <div className="justify-center flex flex-row items-center gap-2">
                    <div>First time using CozyHut?</div>
                    <div 
                    onClick={toggle}
                    className="text-neutral-800
                    cursor-pointer
                    hover:underline
                    ">Create an account!</div>
                </div>

          </div>
        </div>
    )
    return(
        <Modal
        disabled={isLoading}
        isOpen={LoginModal.isOpen}
        title="Login"
        actionLabel="Login"
        onClose={LoginModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        body={bodyContent}
        footer={footerContent}
         />
    );
}
export default LoginModal;