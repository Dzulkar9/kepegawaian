import React, { useEffect, useState } from 'react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    subMessage?: string;
    time?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, title, message, subMessage, time }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShow(true);
        } else {
            const timer = setTimeout(() => setShow(false), 300); // Wait for exit animation
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!show && !isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className={`relative bg-surface rounded-2xl shadow-2xl p-8 max-w-sm w-full transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
                <div className="flex flex-col items-center text-center">

                    {/* Animated Checkmark Circle */}
                    <div className="w-20 h-20 mb-6 relative">
                        <svg
                            className="w-full h-full text-green-500"
                            viewBox="0 0 52 52"
                        >
                            <circle
                                className="checkmark-circle"
                                cx="26"
                                cy="26"
                                r="25"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                            <path
                                className="checkmark-check"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                            />
                        </svg>
                        <style>{`
              .checkmark-circle {
                stroke-dasharray: 166;
                stroke-dashoffset: 166;
                animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
              }
              .checkmark-check {
                transform-origin: 50% 50%;
                stroke-dasharray: 48;
                stroke-dashoffset: 48;
                animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
              }
              @keyframes stroke {
                100% {
                  stroke-dashoffset: 0;
                }
              }
            `}</style>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>

                    {time && (
                        <div className="bg-green-50 text-green-700 px-4 py-1 rounded-full font-mono text-xl font-bold mb-3 tracking-wider">
                            {time}
                        </div>
                    )}

                    <p className="text-gray-600 mb-6 leading-relaxed">
                        {message}
                        {subMessage && <span className="block text-sm text-gray-400 mt-1">{subMessage}</span>}
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-green-600/30 transform transition hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Selesai
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
