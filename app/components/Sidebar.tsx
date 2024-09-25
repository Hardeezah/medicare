"use client"

import Image from 'next/image';
import { IconType } from 'react-icons';

interface Link {
  label: string;
  href: string;
  Icon: IconType;
}
interface bottomLinks {
  label: string;
  href: string;
  Icon: IconType;
}

interface SidebarProps {
  links: Link[];
  bottomLinks: bottomLinks[];
  activeLink: string;
  setActiveLink: (link: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ links, activeLink, setActiveLink, bottomLinks }) => {
  return (
    <div className="flex overflow-hidden fixed">
      {/* Sidebar */}
      <div className="bg-[#292929] text-white h-screen w-72 fixed md:relative z-10 p-1 hidden md:block">
        <div className="p-4 flex gap-3 ">
          <Image
            src="/images/logo.png"
            height={45}
            width={45}
            alt='logo image'
            className=''
          />
          <h2 className="text-2xl font-bold self-center">Medicare</h2>
        </div>
        <nav className="mt-10 flex flex-col h-[90%] justify-between">
          <div className="">
            {links.map((link, index) => (
              <button
                key={index}
                onClick={() => setActiveLink(link.label)}
                className={`block py-2.5 px-5 rounded transition duration-200 w-[80%] hover:bg-[#a0c560] mx-5 my-5 ${
                  activeLink === link.label ? 'bg-[#a0c560] mx-7' : ''
                }`}
              >
                <div className="flex align-middle">
                  <link.Icon className="mr-3 text-xl" />
                  <p className='self-center text-[16px]'>{link.label}</p>
                </div>
              </button>
          ))}
          </div>
          
          <div className="mb-5">
            {bottomLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => setActiveLink(link.label)}
                className={`block py-2.5 px-5 rounded transition duration-200 w-[80%] hover:bg-[#a0c560] mx-5 my-5 ${
                  activeLink === link.label ? 'bg-[#a0c560] mx-7' : ''
                }`}
              >
                <div className="flex align-middle">
                  <link.Icon className="mr-3 text-xl" />
                  <p className='self-center text-[16px]'>{link.label}</p>
                </div>
                
            </button>
          ))}
          </div>
          
        </nav>
        
      </div>
    </div>
  );
};

export default Sidebar;
