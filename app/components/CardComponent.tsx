import Card from '../components/Card';

const CardComponent: React.FC = () => {
  const cardsData = [
    {
        gradient: 'bg-gradient-to-r from-[#0A5748] to-[#0D8570]',
        title: 'Revenue',
        number: 4800,
        text: 'Total revenue for the month',
      },
    {
      gradient: 'bg-gradient-to-r from-[#02C9D0] to-[#1AD0D4]',
      title: 'Patients',
      number: 120,
      text: 'Number of active patients',
    },
    {
      gradient: 'bg-gradient-to-r from-[#eed659] to-[#F0DA6A]',
      title: 'Doctors',
      number: 15,
      text: 'Total number of doctors',
    },
    {
      gradient: 'bg-gradient-to-r from-[#A23CE6] to-[#B460E2]',
      title: 'Appointments',
      number: 32,
      text: 'Scheduled appointments today',
    },
    
  ];

  return (
    <div className=" bg-gray-100 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardsData.map((card, index) => (
          <Card
            key={index}
            gradient={card.gradient}
            title={card.title}
            number={card.number}
            text={card.text}
          />
        ))}
      </div>
    </div>
  );
};

export default CardComponent;
