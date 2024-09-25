import { FaArrowRightLong } from "react-icons/fa6";

interface Appointment {
  time: string;
  title: string;
  description: string;
}

interface TimelineProps {
  appointments: Appointment[];
}

const Timeline: React.FC<TimelineProps> = ({ appointments }) => {
  return (
    <div className="relative border-l-4 border-blue-500 bg-white p-5 rounded-2xl shadow-lg xl:w-[25vw] mt-12 md:mt-0">
      <div className="flex justify-between mb-5">
        <p className='font-bold md:text-lg'> Upcoming Appointments</p>
        <div className="flex text-center gap-3 text-[#03A48A]">
          <p className='text-sm font-semibold '>See all</p>
          <FaArrowRightLong className='self-center'/>
        </div>
      </div>
      {appointments.map((appointment, index) => (
        <div key={index} className="mb-8 pl-6 relative">
          <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-2.5 top-1.5"></div>
          <div className="text-sm text-gray-500">{appointment.time}</div>
          <h3 className="text-lg font-semibold">{appointment.title}</h3>
          <p className="text-gray-600">{appointment.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
