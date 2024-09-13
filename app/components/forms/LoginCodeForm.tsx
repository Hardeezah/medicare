"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

import { Form } from "@/components/ui/form";
import { LoginCodeValidation, UserFormValidation } from "@/lib/validations/validation";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import Button from "../Button";

export const LoginCodeForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof LoginCodeValidation>>({
    resolver: zodResolver(LoginCodeValidation),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginCodeValidation>) => {
    setIsLoading(true);

    axios.post('/api/loginAdmin', values)
    
    .then(() => {
      console.log("success!");
      router.push('/dashboard');
      
    })
    .catch((error: any) => {
        console.log('Something went wrong', error);
    })
    .finally(() => {
        setIsLoading(false)
    })

  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6 mt-10">
        <CustomFormField
          fieldType={FormFieldType.PASSWORD}
          control={form.control}
          name="password"
          label="Admin Login Code"
          placeholder="******"
        />
         <div className="flex justify-between mt-5">
              <div className="flex">
                <p className="text-sm font-semibold px-2 text-[#3d2d5c9a] cursor-pointer hover:underline hover:text-[#2E1460]" onClick={()=> router.push('/')}>User</p>
                <p className="text-sm font-semibold px-2 text-[#3d2d5c9a] cursor-pointer hover:underline hover:text-[#2E1460]" onClick={()=> router.push('/loginDoctor')}>Doctor</p>
            </div>
              <p className="text-sm font-semibold px-2 text-[#FF9FA1] cursor-pointer hover:text-[#f35f64]">Forgot password?</p>
            </div>
          <div className="mt-10">
              <Button
                label="Login"
                onClick={()=> onSubmit}
              />
            </div>
          <div className="text-center mt-4 text-[#3d2d5c9a]">Want to register your hospital? <span className="text-[#FFC000] font-semibold cursor-pointer hover:underline " onClick={()=> router.push('/registerUser')}>Sign up</span></div>
      </form>
    </Form>
  );
};