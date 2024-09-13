"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios, { AxiosResponse } from "axios";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import { Form } from "@/components/ui/form";
import { RegisterUserFormValidation, UserFormValidation } from "@/lib/validations/validation";
import Button from "../Button";
import { useToast } from "@/hooks/use-toast";
import {useAuthStore} from "@/hooks/useAuthStore";

export const RegisterForm = () => {
  const { setEmail } = useAuthStore();
  const { toast } = useToast()
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof RegisterUserFormValidation>>({
    resolver: zodResolver(RegisterUserFormValidation),
    defaultValues: {
      email: "",
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterUserFormValidation>) => {
    setIsLoading(true);
  
    try {
      const response: AxiosResponse = await axios.post('/api/registerUser', values);
      
      // Check the status code of the response
      if (response.status === 201) {
        setEmail(values.email);
        console.log("Registration successful!");
        toast({
          title: "Success!",
          description: "OTP sent to your email.",
        });
        router.push('/verifyUser');
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
            case 405:
              console.log('OTP Error');
              toast({
                variant: "destructive",
                title: "OTP Error",
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
          name="hospitalId"
          label="Hospital ID"
          placeholder="507f1f77bcf86cd799439011"    
              
        />
         <div className="flex justify-between mt-5">
              <div className="flex">
                <p className="text-sm font-semibold px-2 text-[#3d2d5c9a] cursor-pointer hover:underline hover:text-[#2E1460]" onClick={() => router.push("/registerAdmin")}>Register hospital?</p>
            </div>
            </div>
          <div className="mt-10">
              <Button
                label="Sign Up"
                onClick={()=> onSubmit}
              />
            </div>
          <div className="text-center mt-4 text-[#3d2d5c9a]">Already have an account? <span className="text-[#FFC000] font-semibold cursor-pointer hover:underline" onClick={() => router.push("/")}>Log in</span></div>
      </form>
    </Form>
  );
};