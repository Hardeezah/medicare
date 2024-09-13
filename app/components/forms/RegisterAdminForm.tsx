"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios, { AxiosResponse } from "axios";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import { Form } from "@/components/ui/form";
import { RegisterAdminFormValidation } from "@/lib/validations/validation";
import Button from "../Button";
import { useToast } from "@/hooks/use-toast";
import {useAdminStore} from "@/hooks/useAuthStore";

export const RegisterAdminForm = () => {
  const { setEmail } = useAdminStore();
  const { toast } = useToast()
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof RegisterAdminFormValidation>>({
    resolver: zodResolver(RegisterAdminFormValidation),
    defaultValues: {
      email: "",
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterAdminFormValidation>) => {
    console.log(values);
    
    setIsLoading(true);
  
    try {
      const response: AxiosResponse = await axios.post('/api/registerAdmin', values);
      
      // Check the status code of the response
      if (response.status === 201) {
        setEmail(values.email);
        console.log("Registration successful!");
        toast({
          title: "Success!",
          description: "OTP sent to your email.",
        });
        router.push('/verifyAdmin');
      }
  
    } catch (error: any) {
      if (error.response) {
         const errorMessage = error.response.data.message || 'Something went wrong. Please try again.';
        // Handle specific status codes
        switch (error.response.status) {
          case 400:
            console.log('User already exist, Please log in');
            toast({
              variant: "destructive",
              title: "Invalid Email",
              description: errorMessage,
            });
            break;
          case 401:
            console.log('Unauthorized: Incorrect credentials.');
            toast({
              variant: "destructive",
              title: "Unauthorized",
              description: errorMessage,
            });
            break;
          case 403:
            console.log('Pending registration');
            toast({
              variant: "destructive",
              title: "Pending registration",
              description: errorMessage,
            });
            break;
          case 500:
            console.log('Server error.');
            toast({
              variant: "destructive",
              title: "Server Error",
              description: "There was a problem on the server. Please try again later.",
            });
            break;
          default:
            console.log('Something went wrong', error.response.data);
            toast({
              variant: "destructive",
              title: "Error",
              description: "Something went wrong. Please try again.",
            });
        }
      } else {
        console.log('No response from the server');
        toast({
          variant: "destructive",
          title: "No Response",
          description: "No response from the server. Please check your connection.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6 mt-10">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="Jane Doe"    
              
        />
        <CustomFormField
          fieldType={FormFieldType.EMAIL}
          control={form.control}
          name="email"
          label="Email"
          placeholder="janedoe@mail.com"    
              
        />

        <CustomFormField
          fieldType={FormFieldType.PASSWORD}
          control={form.control}
          name="password"
          label="Password"
          placeholder="********"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="hospitalName"
          label="Hospital Name"
          placeholder="Central Hospital"    
              
        />
         <div className="flex justify-between mt-5">
              <div className="flex">
                <p className="text-sm font-semibold px-2 text-[#3d2d5c9a] cursor-pointer hover:underline hover:text-[#2E1460]" onClick={()=> router.push("/registerUser")}>Create user account?</p>
            </div>
            <p className="text-sm font-semibold px-2 text-[#3d2d5c9a] cursor-pointer hover:underline hover:text-[#2E1460]" onClick={()=> router.push("/registerDoctor")}>Register Doctor</p>
            </div>
          <div className="mt-10">
              <Button
                label="Sign Up"
                onClick={()=> onSubmit}
              />
            </div>
          <div className="text-center mt-4 text-[#3d2d5c9a]">Already have an account? <span className="text-[#FFC000] font-semibold cursor-pointer hover:underline" onClick={() => router.push("/loginAdmin")}>Log in</span></div>
      </form>
    </Form>
  );
};