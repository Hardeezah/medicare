"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import { Form } from "@/components/ui/form";
import { UserFormValidation } from "@/lib/validations/validation";
import Button from "../Button";

export const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      email: "",
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);

    axios.post('/api/loginUser', values)
    
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


    /* try {
      const user = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };

      const newUser = await createUser(user);

      if (newUser) {
        router.push(`/patients/${newUser.$id}/register`);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false); */
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6 mt-10">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email Address"
          placeholder="johndoe@mail.com"    
              
        />

        <CustomFormField
          fieldType={FormFieldType.PASSWORD}
          control={form.control}
          name="password"
          label="Password"
          placeholder="********"
        />
         <div className="flex justify-between mt-5">
              <div className="flex">
                <p className="text-sm font-semibold px-2 text-[#3d2d5c9a] cursor-pointer hover:underline hover:text-[#2E1460]" onClick={()=> router.push('/loginAdmin')}>Admin</p>
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
          <div className="text-center mt-4 text-[#3d2d5c9a]">Don't have an account? <span className="text-[#FFC000] font-semibold cursor-pointer hover:underline " onClick={()=> router.push('/registerUser')}>Sign up</span></div>
      </form>
    </Form>
  );
};