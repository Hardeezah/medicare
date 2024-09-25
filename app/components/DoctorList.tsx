import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FaArrowRightLong } from "react-icons/fa6";


const DoctorList = () => {
  return (
    <div className="bg-white  rounded-xl shadow-lg">
      <div className="flex justify-between  bg-green-900 px-4 py-7 rounded-t-xl">
        <p className='font-bold md:text-lg self-center text-white'> Doctor&apos;s List</p>
        <div className="flex text-center gap-3 text-[#03A48A]">
          <p className='text-sm font-semibold '>See all</p>
          <FaArrowRightLong className='self-center'/>
        </div>
      </div>
      <Table className='md:w-[50vw] '>
      <TableHeader className=' bg-[#F8F8F8] rounded-md mb-3'>
        <TableRow>
          <TableHead className="w-[200px]">Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Department</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
      <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow><TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow><TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow><TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow><TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
    </div>
    
  )
}

export default DoctorList