

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ThemeToggle from "../components/ThemeToggle"
import { Moon } from "lucide-react"

export default function Navbar({setFont}) {
    
  return (
    <div className="mt-[58px]">
        <nav className="flex justify-between overflow-x-hidden mx-auto w-[330px] sm:w-[560px] md:w-[740px]">
            {/* logo */}
            <div>
                <img src="./iconoir_book.svg" alt="nav logo" />
            </div>
            {/* select font  */}
            <div className=" flex items-center gap-4">
<Select  onValueChange={(value) => setFont(value)}>
      <SelectTrigger className="w-full max-w-48 ">
        <SelectValue  placeholder="Select Font" />
      </SelectTrigger>
      <SelectContent  >
        <SelectGroup >
          <SelectLabel>Select font</SelectLabel>
          <SelectItem value="font-sans" className='font-sans'>Sans Serif</SelectItem>
          <SelectItem value="font-serif" className='font-serif'>Serif</SelectItem>
          <SelectItem value="font-mono" className='font-mono'>Mono</SelectItem>
       
        </SelectGroup>
      </SelectContent>
    </Select>
      
    <div className="w-px bg-gray-300 dark:bg-gray-600">
        
    </div>
  <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />


  <div >

      <ThemeToggle />
  </div>



            </div>
          
            
        </nav>
    </div>
  )
}
