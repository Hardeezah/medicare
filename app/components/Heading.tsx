'use client'

interface HeadingProps{
    title: string;
    subtitle?: string;
    center?: boolean;

}

const Heading: React.FC<HeadingProps> = ({
    title,subtitle,center
}) => {
    return ( 
        <div className={
            center ? 'text-center' : 'text-start'
        }>
            <div className="font-bold text-[#2E1460] text-[34px] mt-2 md:text-[40px]">
                {title}
            </div>
            <div className="font-light text-[#2E1460] text-[22px] md:text-[24px] opacity-[0.8]">
                {subtitle}
            </div>
        </div>
     );
}
 
export default Heading;