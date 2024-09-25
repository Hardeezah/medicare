import React from 'react'
import DashboardHeading from './DashboardHeading'
import Search from './Search'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const TopBar = () => {
  return (
    <div className='flex justify-between'>
        <div className="">
            <DashboardHeading

            />
        </div>
        <div className="flex gap-5 justify-center">
          <div className="self-center">
            <Search/>
          </div>
          <div className="flex gap-2">
          <div className="font-bold self-center text-[#807f7f]">User</div>

            <Avatar className='bg-[#FFCE50] self-center'>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback className='text-white'>CN</AvatarFallback>
          </Avatar>
          </div>
        </div>
    </div>
  )
}

export default TopBar