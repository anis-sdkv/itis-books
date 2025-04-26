import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col items-center gap-6">
      <h1 className="text-3xl font-semibold">Страница не найдена</h1>
    </section>
  );
};

export default ErrorPage;
