import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

export default function Input({ label, error, id, className = '', ...props }: InputProps) {
  return (
    <div className={`${styles.formGroup} ${className}`}>
      {label && <label className={styles.label} htmlFor={id}>{label}</label>}

      <div className={styles.inputWrapper}>
        <input
          id={id}
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          aria-invalid={!!error}
          {...props}
        />
      </div>

      {error && (
        <p className={styles.errorMessage}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
