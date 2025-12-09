
import React, { useState } from 'react';
import { getEmployeeName } from '../data/mockData';
import { PerformanceReview } from '../types';
import { PlusIcon, StarSolid } from '../constants';
import AddPerformanceReviewModal from '../components/AddPerformanceReviewModal';
import { useNotifications } from '../contexts/NotificationContext';

interface PenilaianKinerjaProps {
    reviews: PerformanceReview[];
    onAddReview: (review: PerformanceReview) => void;
}

const StarRating: React.FC<{ score: number }> = ({ score }) => {
    const totalStars = 5;
    const fullStars = Math.floor(score);
    const halfStar = score % 1 !== 0;
    const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);
  
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => <StarSolid key={`full-${i}`} className="text-yellow-400 h-5 w-5" />)}
        {[...Array(emptyStars)].map((_, i) => <StarSolid key={`empty-${i}`} className="text-gray-300 h-5 w-5" />)}
      </div>
    );
};

const PenilaianKinerja: React.FC<PenilaianKinerjaProps> = ({ reviews, onAddReview }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addNotification } = useNotifications();

  const handleAddReview = (newReview: PerformanceReview) => {
    onAddReview(newReview);
    
    // Notify the employee
    addNotification({
        id: `review-${newReview.id}`,
        userId: newReview.employeeId,
        message: `Anda memiliki penilaian kinerja baru.`,
        link: 'Dasbor Pegawai'
    });
  };

  return (
    <>
        <div className="bg-surface p-6 rounded-xl shadow-sm">
        <div className="flex justify-end mb-6">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition-colors"
                >
                    <PlusIcon className="mr-2"/>
                    Beri Penilaian
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Nama Pegawai</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Tanggal Penilaian</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Skor</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Komentar</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {reviews.map((review: PerformanceReview) => (
                    <tr key={review.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">{getEmployeeName(review.employeeId)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-subtle">{new Date(review.reviewDate).toLocaleDateString('id-ID')}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <StarRating score={review.score} />
                        </td>
                        <td className="px-6 py-4 text-sm text-subtle max-w-sm truncate">{review.comments}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
        <AddPerformanceReviewModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAdd={handleAddReview}
        />
    </>
  );
};

export default PenilaianKinerja;
