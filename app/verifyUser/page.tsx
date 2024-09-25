"use client";

import * as React from "react";
import OtpInput from 'react-otp-input';
import Button from "../components/Button";
import axios, { AxiosResponse } from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {useAuthStore} from "@/hooks/useAuthStore";

const Page = () => {
  // Access the email from the Zustand store
  const { email } = useAuthStore();
  const [otp, setOtp] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();
  
  // Update OTP input
  const handleChange = (otpValue: string) => setOtp(otpValue);

  // Handle OTP verification
  const handleSubmit = async () => {
    // Prevent submission if OTP is not provided
    console.log(otp, email);
    
    if (!otp || !email) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please provide a valid OTP and email.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Make POST request with email and OTP in the body
      const response: AxiosResponse = await axios.post('/api/verifyUserOTP', { email, otp });

      // Handle success
      if (response.status === 201) {
        console.log("OTP verification successful!");
        toast({
          title: "Success!",
          description: "OTP verification completed successfully.",
        });
        router.push('/dashboard');  // Redirect after successful verification
      }
  
    } catch (error: any) {
      // Error handling based on status codes
      if (error.response) {
        const errorMessage = error.response.data.message || 'Something went wrong. Please try again.';
        
        switch (error.response.status) {
          case 400:
            toast({
              variant: "destructive",
              title: "Invalid OTP",
              description: errorMessage,
            });
            break;
          case 401:
            toast({
              variant: "destructive",
              title: "Unauthorized",
              description: errorMessage,
            });
            break;
          case 403:
            toast({
              variant: "destructive",
              title: "OTP Expired",
              description: errorMessage,
            });
            break;
          case 500:
            toast({
              variant: "destructive",
              title: "Server Error",
              description: errorMessage,
            });
            break;
          default:
            toast({
              variant: "destructive",
              title: "Error",
              description: "Something went wrong. Please try again.",
            });
        }
      } else {
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
    <div className="bg-[#156B6A] h-screen flex items-center justify-center">
      <div className="bg-[#ffff] rounded-2xl p-10 md:p-16 shadow-lg">
        <div className="text-2xl font-bold text-[#2E1460]">Verify OTP code</div>
        <div className="font-extralight text-gray-500 opacity-[0.8]">Enter the 6-digit code sent to your email</div>
        <OtpInput
          value={otp}
          renderInput={(props) => <input {...props} />}
          onChange={handleChange}
          numInputs={6}
          renderSeparator={<span style={{ width: "18px" }}></span>}
          shouldAutoFocus
          inputStyle={{
            border: "1px solid #F0EDF4",
            borderRadius: "8px",
            width: "62px",
            height: "62px",
            fontSize: "16px",
            color: "#2E1460",
            fontWeight: "400",
            caretColor: "#FFC000",
            marginTop: "30px",
            marginBottom: "20px"
          }}
        />
        <Button
          label={isLoading ? "Verifying..." : "Verify"}
          onClick={handleSubmit}
          disabled={isLoading}  // Disable the button while loading
        />
      </div>
    </div>
  );
};

export default Page;
