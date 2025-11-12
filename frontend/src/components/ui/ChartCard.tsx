import React from 'react';

interface ChartData {
  day: number;
  current: number;
  previous: number;
}

interface ChartCardProps {
  title: string;
  data: ChartData[];
}

const ChartCard: React.FC<ChartCardProps> = ({ title, data }) => {
  const maxValue = Math.max(...data.flatMap(d => [d.current, d.previous]));
  const chartHeight = 200;
  const chartWidth = 600;

  const getY = (value: number) => {
    return chartHeight - (value / maxValue) * chartHeight;
  };

  const getX = (index: number) => {
    return (index / (data.length - 1)) * chartWidth;
  };

  // Generate path for current month
  const currentPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.current)}`)
    .join(' ');

  // Generate path for previous month
  const previousPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.previous)}`)
    .join(' ');

  // Generate area paths
  const currentAreaPath = `${currentPath} L ${getX(data.length - 1)} ${chartHeight} L ${getX(0)} ${chartHeight} Z`;
  const previousAreaPath = `${previousPath} L ${getX(data.length - 1)} ${chartHeight} L ${getX(0)} ${chartHeight} Z`;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-sm text-gray-600">Current Month</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-300"></div>
          <span className="text-sm text-gray-600">Last Month</span>
        </div>
      </div>

      <div className="relative" style={{ height: chartHeight, width: '100%', overflowX: 'auto' }}>
        <svg width={chartWidth} height={chartHeight} className="w-full" viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`} preserveAspectRatio="xMidYMid meet">
          {/* Y-axis labels */}
          {[1, 2, 3, 4, 5].map((val) => (
            <g key={val}>
              <line
                x1={0}
                y1={getY(val * (maxValue / 5))}
                x2={chartWidth}
                y2={getY(val * (maxValue / 5))}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={-10}
                y={getY(val * (maxValue / 5)) + 4}
                className="text-xs fill-gray-500"
                textAnchor="end"
              >
                {val}K
              </text>
            </g>
          ))}

          {/* Previous month area */}
          <path d={previousAreaPath} fill="rgba(147, 197, 253, 0.3)" />
          {/* Current month area */}
          <path d={currentAreaPath} fill="rgba(168, 85, 247, 0.3)" />

          {/* Previous month line */}
          <path
            d={previousPath}
            fill="none"
            stroke="#93c5fd"
            strokeWidth="2"
          />
          {/* Current month line */}
          <path
            d={currentPath}
            fill="none"
            stroke="#a855f7"
            strokeWidth="2"
          />

          {/* X-axis labels */}
          {data.map((d, i) => {
            if (i % 3 === 0 || i === data.length - 1) {
              return (
                <text
                  key={i}
                  x={getX(i)}
                  y={chartHeight + 20}
                  className="text-xs fill-gray-500"
                  textAnchor="middle"
                >
                  {d.day}
                </text>
              );
            }
            return null;
          })}
        </svg>
      </div>
    </div>
  );
};

export default ChartCard;

