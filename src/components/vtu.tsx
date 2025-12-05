
export default function VTU() {
  return (
    <section className="py-20 bg-[#0A0A0C] text-white">
      <div className="max-w-lg mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">VTU Recharge</h2>

        <div className="p-6 bg-white/5 rounded-xl border border-fuchsia-400 shadow-[0_0_35px_rgba(244,114,182,0.35)]">
          <label className="block mb-4">
            <span className="text-gray-300">Network</span>
            <select className="w-full mt-2 p-3 bg-black/40 border border-white/10 rounded-lg">
              <option>MTN</option>
              <option>Airtel</option>
              <option>Glo</option>
              <option>9mobile</option>
            </select>
          </label>

          <label className="block mb-4">
            <span className="text-gray-300">Phone Number</span>
            <input
              placeholder="0801 234 5678"
              className="w-full mt-2 p-3 bg-black/40 border border-white/10 rounded-lg"
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-300">Amount</span>
            <input
              placeholder="100"
              className="w-full mt-2 p-3 bg-black/40 border border-white/10 rounded-lg"
            />
          </label>

          <button className="w-full p-3 font-semibold bg-fuchsia-400 text-black rounded-lg shadow-[0_0_20px_rgba(244,114,182,0.5)] hover:bg-fuchsia-300 transition">
            Recharge Now
          </button>
        </div>
      </div>
    </section>
  );
}
  