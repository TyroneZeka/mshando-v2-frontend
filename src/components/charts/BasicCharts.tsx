import React from 'react';

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: ChartData[];
  title: string;
  height?: number;
  showValues?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  title, 
  height = 200, 
  showValues = true 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="flex items-end justify-between space-x-2" style={{ height }}>
        {data.map((item, index) => {
          const barHeight = maxValue > 0 ? (item.value / maxValue) * (height - 40) : 0;
          const color = item.color || colors[index % colors.length];
          
          return (
            <div key={item.label} className="flex flex-col items-center flex-1">
              <div className="relative w-full flex justify-center">
                {showValues && (
                  <span className="text-xs text-gray-600 mb-1">{item.value}</span>
                )}
                <div
                  className="w-full max-w-12 rounded-t transition-all duration-300 hover:opacity-80"
                  style={{
                    height: `${barHeight}px`,
                    backgroundColor: color,
                    minHeight: '4px'
                  }}
                />
              </div>
              <span className="text-xs text-gray-500 mt-2 text-center truncate w-full">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface PieChartProps {
  data: ChartData[];
  title: string;
  size?: number;
}

export const PieChart: React.FC<PieChartProps> = ({ data, title, size = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No data available</p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
  
  let cumulativePercentage = 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="flex items-center space-x-6">
        <div className="relative">
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={size / 2 - 10}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="20"
            />
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage * 2.51} 251`;
              const strokeDashoffset = -cumulativePercentage * 2.51;
              const color = item.color || colors[index % colors.length];
              
              cumulativePercentage += percentage;
              
              return (
                <circle
                  key={item.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={size / 2 - 10}
                  fill="none"
                  stroke={color}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="space-y-2">
            {data.map((item, index) => {
              const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
              const color = item.color || colors[index % colors.length];
              
              return (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {item.value} ({percentage}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

interface LineChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
  title: string;
  height?: number;
  color?: string;
}

export const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  title, 
  height = 200, 
  color = '#3B82F6' 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue || 1;

  const width = 300;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((item, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + ((maxValue - item.value) / range) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <svg width={width} height={height} className="border border-gray-200 rounded">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding + ratio * chartHeight;
            return (
              <line
                key={ratio}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            className="transition-all duration-300"
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = padding + ((maxValue - item.value) / range) * chartHeight;
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={color}
                className="transition-all duration-300 hover:r-6"
              >
                <title>{`${item.label}: ${item.value}`}</title>
              </circle>
            );
          })}
          
          {/* X-axis labels */}
          {data.map((item, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            
            return (
              <text
                key={index}
                x={x}
                y={height - 10}
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                {item.label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 ${colorClasses[color]} rounded-md flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-lg font-medium text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
      {trend && (
        <div className="mt-4">
          <div className={`inline-flex items-center text-sm ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.isPositive ? (
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ) : (
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            )}
            {Math.abs(trend.value)}%
          </div>
        </div>
      )}
    </div>
  );
};
