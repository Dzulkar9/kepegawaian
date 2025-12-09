
import React, { useState } from 'react';
import { BuildingOfficeIcon } from '../constants';
import { employees } from '../data/mockData';
import { Employee } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: { role: 'admin' } | { role: 'employee', employee: Employee }) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hardcoded admin login
    if (email === 'admin@hris.com' && password === 'password123') {
      setError('');
      onLoginSuccess({ role: 'admin' });
      return;
    }

    // Employee login check
    const employee = employees.find(emp => emp.email === email);
    // For demo purposes, all employees have the same password
    if (employee && password === 'password123') {
        setError('');
        onLoginSuccess({ role: 'employee', employee });
        return;
    }

    setError('Email atau password salah. Silakan coba lagi.');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-surface rounded-xl shadow-lg">
        <div className="text-center">
            <div className="flex justify-center items-center mb-4">
                <BuildingOfficeIcon />
                <h1 className="text-3xl font-bold text-primary ml-2">HRIS</h1>
            </div>
            <h2 className="text-2xl font-bold text-on-surface">Selamat Datang</h2>
            <p className="mt-2 text-sm text-subtle">Silakan masuk untuk mengakses sistem.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Alamat Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Alamat Email (cth: budi.s@example.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password"className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password (cth: password123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg text-center" role="alert">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
            >
              Masuk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
