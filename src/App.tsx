import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-white">
          🎰 Boujee Baccarat
        </h1>
        <p className="text-slate-400">
          Setup Complete! Ready to build.
        </p>
        <Button className="bg-green-600 hover:bg-green-700">
          Test Button
        </Button>
      </div>
    </div>
  )
}

export default App