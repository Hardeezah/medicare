'use client';

import { useState, useEffect } from 'react';

const DashboardHeading: React.FC = () => {
  const [name, setName] = useState<string | null>('Loading...');
  const [role, setRole] = useState<string | null>('Loading...');

  useEffect(() => {
    const fetchData = async () => {

    };

    fetchData();
  }, []);

  return (
    <div className="text-start">
      <div className="font-bold text-[#0B1125] text-[22px] mt-2 md:text-[30px]">
        Welcome, {name} ({role})
      </div>
      <div className="font-light text-[#9F9F9F] text-[16px] md:text-[18px]">
        {/* Additional subtitle or data */}
      </div>
    </div>
  );
};

export default DashboardHeading;
