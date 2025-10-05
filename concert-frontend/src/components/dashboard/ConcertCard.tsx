interface Concert {
  id: string;
  name: string;
  description: string;
  totalSeats: number;
  createdAt: string;
}

interface ConcertCardProps {
  concert: Concert;
  onDelete?: (id: string) => void;
  onReserve?: (id: string) => void;
  onCancel?: (id: string) => void;
  userType: "admin" | "user";
  isReserved?: boolean;
}

export default function ConcertCard({ concert, onDelete, onReserve, onCancel, userType, isReserved = false }: ConcertCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-bold text-blue-600 mb-3">{concert.name}</h3>
          <p className="text-gray-600 mb-4 leading-relaxed text-sm md:text-base">{concert.description}</p>
          <div className="flex items-center text-gray-500">
            <span className="text-lg mr-2">👥</span>
            <span className="font-medium">{concert.totalSeats}</span>
          </div>
        </div>

        <div className="mt-4 md:mt-0 md:ml-4">
          {userType === "admin" ? (
            <button onClick={() => onDelete?.(concert.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <span>🗑️</span>
              <span>Delete</span>
            </button>
          ) : (
            <button onClick={() => (isReserved ? onCancel?.(concert.id) : onReserve?.(concert.id))} className={`w-full md:w-auto px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${isReserved ? "bg-red-500 hover:bg-red-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}>
              <span>{isReserved ? "❌" : "🎫"}</span>
              <span>{isReserved ? "Cancel" : "Reserve"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
