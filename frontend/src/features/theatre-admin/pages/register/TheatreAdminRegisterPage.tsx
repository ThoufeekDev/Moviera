import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { Turnstile } from 'react-turnstile';
import { getErrorMessage } from '../../../../shared/utils/getErrorMessage';
import MovieraLogo from '../../../../shared/components/moviera-logo/MovieraLogo';
import './AdminRegister.css';

import { registerUser } from '../../../auth/services/auth.service';

export default function HospitalRegisterPage() {
  const [authError, setAuthError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const navigate = useNavigate();



  return (
    <div className="register-container">
        <h1>Coming soon</h1>
    </div>
  );
}
