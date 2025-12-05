// frontend/src/admin/components/AdminLayout.jsx
import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col">
        <div className="px-4 py-3 text-lg font-semibold border-b border-gray-800">
          Admin Panel
        </div>
        <nav className="flex-1 px-3 py-2 space-y-1">
          <Link
            to="/admin/faqs"
            className="block px-3 py-2 rounded-md text-sm hover:bg-gray-800"
          >
            FAQs
          </Link>
          <Link
            to="/admin/sessions"
            className="block px-3 py-2 rounded-md text-sm hover:bg-gray-800"
          >
            Sessions
          </Link>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}

