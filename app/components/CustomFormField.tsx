import React, { useState } from "react";
/* eslint-disable no-unused-vars */
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Control } from "react-hook-form";
import ReactDatePicker from "react-datepicker";

export enum FormFieldType {
    INPUT = "input",
    EMAIL = "email",
    TEXTAREA = "textarea",
    PASSWORD = "password",
    CHECKBOX = "checkbox",
    DATE_PICKER = "datePicker",
    SELECT = "select",
    SKELETON = "skeleton",
}

interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
}

const RenderInput = ({
  field,
  props,
  onFocus,
  onBlur,
}: {
  field: any;
  props: CustomProps;
  onFocus: () => void;
  onBlur: () => void;
}) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              {...field}
              className="shad-input border-0 pb-5 text-[#2E1460] font-semibold text-lg"
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </FormControl>
        </div>
      );
    
    case FormFieldType.PASSWORD:
      return (
        <div className="flex">        
          <FormControl>
            <Input
             type="password"
              placeholder={props.placeholder}
              {...field}
              className="shad-input border-0 pb-5 text-[#2E1460] font-semibold text-lg"
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </FormControl>
        </div>
      );
    case FormFieldType.EMAIL:
      return (
        <div className="flex">        
          <FormControl>
            <Input
              type="email"
              placeholder={props.placeholder}
              {...field}
              className="shad-input border-0 pb-5 text-[#2E1460] font-semibold text-lg"
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </FormControl>
        </div>
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className="shad-textArea"
            disabled={props.disabled}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </FormControl>
      );

    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <Image
            src="/assets/icons/calendar.svg"
            height={24}
            width={24}
            alt="user"
            className="ml-2"
          />
          <FormControl>
            <ReactDatePicker
              showTimeSelect={props.showTimeSelect ?? false}
              selected={field.value}
              onChange={(date: Date | null) => field.onChange(date)}
              timeInputLabel="Time:"
              dateFormat={props.dateFormat ?? "MM/dd/yyyy"}
              wrapperClassName="date-picker"
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </FormControl>
        </div>
      );
    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="shad-select-trigger">
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, name, label } = props;
  const [isFocused, setIsFocused] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div
          className={`pt-2 px-2 border rounded-xl ${
            isFocused ? "border-[#156B6A] border-2" : "border-gray-300"
          }`}
        >
          <FormItem className="flex-1">
            {props.fieldType !== FormFieldType.CHECKBOX && label && (
              <FormLabel className="shad-input-label px-3">{label}</FormLabel>
            )}
            <RenderInput
              field={field}
              props={props}
              onFocus={() => setIsFocused(true)} // Set focus when input is focused
              onBlur={() => setIsFocused(false)} // Remove focus when input is blurred
            />
            <FormMessage className="shad-error" />
          </FormItem>
        </div>
      )}
    />
  );
};

export default CustomFormField;
