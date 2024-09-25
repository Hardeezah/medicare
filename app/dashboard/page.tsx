"use client"
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import { MdOutlineDashboard, MdPeople, MdSchedule, MdSettings } from 'react-icons/md'; // Import icons
import { IconType } from 'react-icons';
import { RxDashboard } from "react-icons/rx";
import { IoCalendarOutline } from "react-icons/io5";
import { FaUserDoctor } from "react-icons/fa6";
import { LuHistory } from "react-icons/lu";
import { RiUser3Fill } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";


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

const Home: React.FC = () => {
  const adminLinks: Link[] = [
    { label: 'Dashboard', href: '#', Icon: MdOutlineDashboard },
    { label: 'Manage Users', href: '#',Icon: MdOutlineDashboard  },
    { label: 'Appointments', href: '#' , Icon: MdOutlineDashboard},
    { label: 'Reports', href: '#' ,Icon: MdOutlineDashboard   },
    { label: 'Settings', href: '#', Icon: MdOutlineDashboard },
  ];

  const doctorLinks: Link[] = [
    { label: 'Dashboard', href: '#',Icon: MdOutlineDashboard },
    { label: 'Appointments', href: '#',Icon: MdOutlineDashboard },
    { label: 'Patient Records', href: '#',Icon: MdOutlineDashboard },
    { label: 'Prescriptions', href: '#',Icon: MdOutlineDashboard },
    { label: 'Reports', href: '#',Icon: MdOutlineDashboard },
  ];

  const userLinks: Link[] = [
    { label: 'Dashboard', href: '#',Icon: RxDashboard },
    { label: 'Appointments', href: '#', Icon: IoCalendarOutline },
    { label: 'Doctors', href: '#',Icon: FaUserDoctor },
    { label: 'History', href: '#',Icon: LuHistory },
  ];
  const userBottomLinks: bottomLinks[] = [
    { label: 'Profile', href: '#',Icon: RiUser3Fill },
    { label: 'Logout', href: '#', Icon: CiLogout },
  ];
  const adminBottomLinks: bottomLinks[] = [
    { label: 'Dashboard', href: '#',Icon: RxDashboard },
    { label: 'Logout', href: '#', Icon: CiLogout },
  ];
  const doctorBottomLinks: bottomLinks[] = [
    { label: 'Dashboard', href: '#',Icon: RxDashboard },
    { label: 'Appointments', href: '#', Icon: IoCalendarOutline },
  ];

  // Simulate user role; in a real app, this might come from an API
  const userRole = 'user';

  // Determine the links and title based on the role
  let links: Link[] = [];
  let bottomLinks: bottomLinks[] = [];


  switch (userRole) {
    case 'admin':
      links = adminLinks;
      bottomLinks = userBottomLinks;
      break;
    case 'doctor':
      links = doctorLinks;
      bottomLinks = userBottomLinks;
      break;
    case 'user':
      links = userLinks;
      bottomLinks = userBottomLinks;
      break;
    default:
      links = [];
      bottomLinks=[]
  }

  // State for the active link (default to the first link)
  const [activeLink, setActiveLink] = useState(links[0]?.label);

  // Function to render content based on active link
  const renderContent = () => {
    switch (activeLink) {
      case 'Dashboard':
        return <Dashboard/>;
      case 'Manage Users':
        return <div>Manage your users here</div>;
      case 'Appointments':
        return <div>View and manage appointments</div>;
      case 'Reports':
        return <div>Access reports here</div>;
      case 'Settings':
        return <div>Change your settings</div>;
      case 'Patient Records':
        return <div>View patient records</div>;
      case 'Prescriptions':
        return <div>Manage prescriptions</div>;
      case 'My Appointments':
        return <div>Check your appointments</div>;
      case 'Doctors':
        return <div>View available doctors</div>;
      case 'History':
          return <div>All history</div>;
      case 'Profile':
          return <div>Profile</div>;
      default:
        return <div>Welcome to the Dashboard</div>;
    }
  };

  return (
    <div className="flex min-h-screen ">
    <Sidebar links={links} activeLink={activeLink} setActiveLink={setActiveLink} bottomLinks={bottomLinks} />
      <main className="flex-1 p-10 bg-gray-100 md:ml-72 ">
        {renderContent()}
      </main>
    </div>
  );
};

export default Home;
