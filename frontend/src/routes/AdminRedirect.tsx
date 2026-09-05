import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/common/Loader';

export default function AdminRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/admin/dashboard', { replace: true });
  }, [navigate]);

  return <Loader />;
}
