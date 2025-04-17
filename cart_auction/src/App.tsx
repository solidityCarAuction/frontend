import Homepage from "./pages/Homepage";
import useAuctionEvents from "./useAuctionEvents";

function App() {
  useAuctionEvents();
  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#0f0f0f] via-[#1f2937] to-[#0f172a] text-white">
      <Homepage />
    </div>
  );
}

export default App;
