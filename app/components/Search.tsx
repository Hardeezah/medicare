'use client'

import { Input } from "@/components/ui/input";
import { differenceInDays } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { BiSearch } from "react-icons/bi";

const Search = () => {

   /*  const locationLabel = useMemo(() => {
        if(locationValue){
            return getByValues(locationValue as string)?.label;
        }

        return 'Anywhere';
    }, [getByValues, locationValue]);

    const durationLabel = useMemo(() => {
        if(startDate && endDate){
            const start = new Date(startDate as string);
            const end = new Date(endDate as string);
            let diff = differenceInDays(end, start);

            if(diff == 0){
                diff = 1
            }
            

            return `${diff} Days`;
        }

        return 'Any Week'
    }, [startDate, endDate]);

    const guestLabel = useMemo(() => {
        if(guestCount){
            return `${guestCount} Guests`
        }

        return 'Add Guests'
    }, [guestCount]) */

    return ( 
        <div 
            className="
                border-[1px]
                w-full
                md:w-auto 
                rounded-full
                shadow-sm
                hover:shadow-md
                transition
                cursor-pointer
                
        ">
            <div className="
                flex
                flex-row
                items-center
                justify-between
            ">
                <Input
                    className="border-none font-bold text-[#0B1125] py-6 px-5 placeholder:text-gray-300"
                    placeholder="Search anything..."
                />
                <div className="
                    text-sm
                    pl-6
                    pr-2
                    text-gray-600
                    flex
                    flex-row
                    items-center
                    gap-3
                ">
                    <div className="
                        p-2
                        bg-gray-600
                        rounded-full
                        text-white
                    ">
                        <BiSearch/>
                    </div>
                </div>
            </div>

        </div>
     );
}
 
export default Search;