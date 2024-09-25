interface CardProps {
    gradient: string;  // The gradient background color
    title: string;
    number: number;
    text: string;
  }
  
  const Card: React.FC<CardProps> = ({ gradient, title, number, text }) => {
    return (
      <div
        className={`shadow-lg rounded-xl p-6 text-white ${gradient} transform transition duration-300 hover:scale-105`}
      >
        <div className="text-4xl font-bold">{number}</div>
        <div className="mt-2 text-xl">{title}</div>
        <div className="mt-4 text-sm">{text}</div>
      </div>
    );
  };
  
  export default Card;
  