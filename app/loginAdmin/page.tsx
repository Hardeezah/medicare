"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import Heading from "../components/Heading";
import { LoginCodeForm } from "../components/forms/LoginCodeForm";
export default function Home() {
  const router = useRouter()
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px] ">
          <div className="flex gap-4 ">
            <Image 
              src="/images/logo.png"
              height={100}
              width={100}
              alt="Logo Medicare"
              className="h-15 w-14"
            />
            <div className="logo-text">
              Medicare
            </div>
          </div>
          <div className="mt-12">
            <Heading
              title="Welcome Back!"
              subtitle="Log in to Admin's account"
            />
            <LoginCodeForm />
          </div>
        </div>
      </section>
      
      <div className="p-10 ">
        <Image 
          src="/images/doctorr.png"
          height={1000}
          width={1000}
          alt="doctor"
          className='side-img rounded-2xl shadow-2xl ' // Add floating animation and shadow
        />
      </div>
    </div>
  );
}
