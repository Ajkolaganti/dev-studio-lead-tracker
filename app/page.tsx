"use client"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="max-w-2xl rounded-lg bg-surface p-8 text-center shadow-lg">
        <h1 className="mb-4 text-4xl font-bold text-primary">Lead Tracker CRM</h1>
        <p className="mb-6 text-lg text-secondary">
          This is a Vite + React project. Please view the application by opening the project files.
        </p>

        <div className="mb-6 rounded-lg bg-gray-50 p-6 text-left">
          <h2 className="mb-3 text-xl font-semibold text-primary">Quick Start:</h2>
          <ol className="space-y-2 text-sm text-secondary">
            <li>
              1. Copy <code className="rounded bg-gray-200 px-2 py-1">.env.example</code> to{" "}
              <code className="rounded bg-gray-200 px-2 py-1">.env</code>
            </li>
            <li>
              2. Add your Firebase credentials to <code className="rounded bg-gray-200 px-2 py-1">.env</code>
            </li>
            <li>
              3. Run <code className="rounded bg-gray-200 px-2 py-1">npm install</code>
            </li>
            <li>
              4. Run <code className="rounded bg-gray-200 px-2 py-1">npm run dev</code>
            </li>
            <li>5. Visit the local development server</li>
          </ol>
        </div>

        <div className="rounded-lg border-2 border-accent bg-accent/5 p-4">
          <p className="text-sm font-medium text-accent">
            📁 Entry Point: <code className="ml-2 rounded bg-white px-2 py-1">src/main.tsx</code>
          </p>
        </div>

        <div className="mt-6 text-xs text-secondary">
          <p>
            See <strong>README.md</strong> and <strong>DEPLOYMENT.md</strong> for full documentation
          </p>
        </div>
      </div>
    </div>
  )
}
