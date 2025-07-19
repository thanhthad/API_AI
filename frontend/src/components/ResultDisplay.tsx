import React from 'react';

interface Prediction {
  label: string;
  score: number;
}

interface AnalyzeResponse { // Cần định nghĩa lại interface này cho chính xác
  primaryPredictionLabel: string;
  primaryPredictionScore: number;
  detailedPredictions: Prediction[];
  message: string;
}

interface ResultDisplayProps {
  result: AnalyzeResponse | null;
  error: string | null;
  loading: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, error, loading }) => {
  if (loading) {
    return <p className="text-center text-gray-600">Analyzing email...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center font-semibold">Error: {error}</p>;
  }

  if (result) {
    return (
      <div className="mt-6 p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Analysis Result</h2>
        <p className="mb-3 text-lg">
          <span className="font-semibold text-blue-700">Primary Prediction:</span>{' '}
          <span className="text-gray-900">{result.primaryPredictionLabel}</span> (
          <span className="font-medium text-green-600">{(result.primaryPredictionScore * 100).toFixed(2)}%</span>)
        </p>
        <h3 className="font-semibold text-xl mt-4 mb-2 text-gray-700">Detailed Predictions:</h3>
        {result.detailedPredictions && result.detailedPredictions.length > 0 ? (
          <ul className="list-inside list-disc pl-2 text-gray-800">
            {result.detailedPredictions.map((prediction, index) => (
              <li key={index} className="mb-1">
                <span className="font-medium">{prediction.label}</span>:{' '}
                <span className="text-purple-600">{(prediction.score * 100).toFixed(2)}%</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No detailed predictions available.</p>
        )}
        <p className="mt-4 text-sm text-gray-500 text-center border-t pt-3">{result.message}</p>
      </div>
    );
  }

  return null;
};

export default ResultDisplay;