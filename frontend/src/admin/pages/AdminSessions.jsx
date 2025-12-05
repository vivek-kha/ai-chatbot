import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";

export default function AdminSessions() {
  const [sessions, setSessions] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchSessions(targetPage = 1) {
    try {
      setLoading(true);
      setError("");
      const res = await adminApi.get("/sessions", {
        params: { page: targetPage, perPage },
      });
      setSessions(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(targetPage);
    } catch (err) {
      console.error(err);
      setError("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSessions(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">User Sessions</h1>
        <div className="text-sm text-gray-600">Showing recent chats</div>
      </div>

      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-2 font-medium text-gray-600">User</th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">Session</th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">Last Query</th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">AI Reply</th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">Messages</th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">Updated</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            ) : sessions.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                  No sessions found.
                </td>
              </tr>
            ) : (
              sessions.map((s) => (
                <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 align-top">
                    <div className="font-medium text-gray-900">{s.userName || "—"}</div>
                    <div className="text-xs text-gray-500">{s.userEmail || "Guest"}</div>
                  </td>
                  <td className="px-4 py-3 align-top text-xs text-gray-600">
                    {s.sessionId}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="line-clamp-3 text-gray-800">
                      {s.lastUserMessage || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="line-clamp-3 text-gray-700">
                      {s.lastAssistantMessage || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-gray-700">{s.messageCount}</td>
                  <td className="px-4 py-3 align-top text-xs text-gray-500">
                    {new Date(s.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => fetchSessions(Math.max(1, page - 1))}
            disabled={page === 1 || loading}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => fetchSessions(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || loading}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

