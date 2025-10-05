interface StatsCardProps {
  title: string;
  value: number;
  icon: string;
  color: "blue" | "green" | "red";
}

export default function StatsCard({ title, value, icon, color }: StatsCardProps) {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-100 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value.toLocaleString()}</p>
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </div>
  );
}
