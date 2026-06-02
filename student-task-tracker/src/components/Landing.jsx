export default function Landing({ goToDashboard }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-500 text-white">
      <h1 className="text-4xl font-bold mb-4">
        Student Task Tracker
      </h1>

      <button
        onClick={goToDashboard}
        className="bg-white text-blue-600 px-6 py-2 rounded font-semibold"
      >
        Go to Dashboard
      </button>
    </div>
  );
}