import React from "react";

interface Trainer {
  name: string;
  specialty: string;
  experience: string;
  rating: number;
}

interface Props {
  region: string;
  trainers: Trainer[];
  onClose: () => void;
}

export default function RegionTrainerModal({ region, trainers, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl w-full max-w-sm">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-[#1A1B35]">{region} 지역 트레이너</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {trainers.map((trainer, index) => (
            <div key={index} className="border-b border-gray-100 last:border-0 py-3">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h4 className="font-semibold text-[#1A1B35]">{trainer.name}</h4>
                  <p className="text-sm text-gray-600">{trainer.specialty}</p>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-star text-yellow-400 mr-1"></i>
                  <span className="text-sm font-semibold">{trainer.rating}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500">경력 {trainer.experience}</div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-[#1A1B35] text-white py-3 rounded-lg font-semibold !rounded-button"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
