import { z } from "zod";
const objectIdRegex = /^[a-fA-F0-9]{24}$/;

export const UserFormValidation = z.object({
 
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
    

});
export const RegisterUserFormValidation = z.object({
   name: z
     .string()
     .min(4, "Name must be at least 4 characters")
     .max(50, "Name must be at most 50 characters"),
   email: z.string().email("Invalid email address"),
   password: z
     .string()
     .min(6, "Password must be at least 6 characters"),
    hospitalId: z.string().regex(objectIdRegex, "Invalid Hospital ID format."),
 
 });
 export const LoginCodeValidation = z.object({
  password: z
    .string()
    .min(6, "Token must be at least 6 characters")
    .max(10),

});
export const RegisterAdminFormValidation = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
   hospitalName: z
   .string()
   .min(4, "Name must be at least 4 characters")
   .max(50, "Name must be at most 50 characters"),

});
export const RegisterDoctorFormValidation = z.object({
  name: z
    .string()
    .min(4, "Name must be at least 4 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  inviteToken: z.string()
    .min(6, "Password must be at least 6 characters"),

});