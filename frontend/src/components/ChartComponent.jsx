import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell,
  AreaChart, Area, ReferenceLine
} from 'recharts';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label, prefix = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card p-3 text-xs shadow-lg">
      <p className="font-semibold text-slate-700 dark:text-white mb-1.5">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-slate-500 dark:text-slate-400">{entry.name}:</span>
          <span className="font-semibold text-slate-700 dark:text-white">
            {prefix}{typeof entry.value === 'number' ? entry.value.toLocaleString('en-IN') : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// Comparison Bar Chart (Govt vs ML value)
export function ComparisonBarChart({ govtValue, mlValue }) {
  const data = [
    { name: 'Govt. Circle Rate', value: govtValue, fill: '#3b82f6' },
    { name: 'ML Prediction', value: mlValue, fill: '#22c55e' },
  ];
  const diff = mlValue - govtValue;
  const pct = ((diff / govtValue) * 100).toFixed(1);

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barCategoryGap="40%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false}
            tickFormatter={v => `₹${(v / 100000).toFixed(1)}L`} />
          <Tooltip content={<CustomTooltip prefix="₹" />} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className={`mt-2 text-center text-sm font-semibold ${diff > 0 ? 'text-primary-600' : 'text-red-500'}`}>
        {diff > 0 ? '↑' : '↓'} ML value is {Math.abs(pct)}% {diff > 0 ? 'higher' : 'lower'} than govt. rate
      </div>
    </div>
  );
}

// Historical trend line chart
export function TrendLineChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="mlGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false}
          tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
        <Tooltip content={<CustomTooltip prefix="₹" />} />
        <Area type="monotone" dataKey="value" name="Land Value" stroke="#22c55e" strokeWidth={2.5}
          fill="url(#mlGrad)" dot={{ fill: '#22c55e', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Status Pie Chart
export function StatusPieChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"
          innerRadius={55} outerRadius={80} paddingAngle={3}>
          {data.map((entry, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// Monthly submissions bar chart
export function MonthlyBarChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={24}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="submissions" name="Submissions" fill="#22c55e" radius={[6, 6, 0, 0]} />
        <Bar dataKey="approved" name="Approved" fill="#3b82f6" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
