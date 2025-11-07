export default async function HealthPage() {
    const base = process.env.INTERNAL_API_URL || "http://api:3000";
    const res = await fetch(`${base}/healthz`, { cache: "no-store" });
    const data = await res.json();

    return (
        <main className="p-6">
            <h1 className="text-2xl font-semibold">Health</h1>
            <pre className="mt-4 rounded bg-gray-100 p-4">{JSON.stringify(data, null, 2)}</pre>
        </main>
    )
}