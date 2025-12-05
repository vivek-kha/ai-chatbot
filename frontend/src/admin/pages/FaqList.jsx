// frontend/src/admin/pages/FaqList.jsx
import { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";

export default function FaqList() {
  const [faqs, setFaqs] = useState([]);
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [published, setPublished] = useState("all"); // all | true | false
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchFaqs() {
    try {
      setLoading(true);
      setError("");

      const params = { page, perPage };
      if (q.trim()) params.q = q;
      if (tag.trim()) params.tag = tag;
      if (published !== "all") params.published = published;

      const res = await adminApi.get("/faqs", { params });
      setFaqs(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
      setError("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFaqs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, published]); // search is triggered by button

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    fetchFaqs();
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await adminApi.delete(`/faqs/${id}`);
      fetchFaqs();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  async function handleTogglePublish(faq) {
    try {
      await adminApi.patch(`/faqs/${faq._id}/publish`, {
        published: !faq.published,
      });
      fetchFaqs();
    } catch (err) {
      console.error(err);
      alert("Failed to update publish status");
    }
  }

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">FAQ Management</h1>
        <Link
          to="/admin/faqs/new"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          + New FAQ
        </Link>
      </div>

      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 items-end"
      >
        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1">Search</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search in question/answer"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1">Tag</label>
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Filter by tag"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-medium mb-1">Published</label>
          <select
            value={published}
            onChange={(e) => setPublished(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="true">Published</option>
            <option value="false">Unpublished</option>
          </select>
        </div>

        <button
          type="submit"
          className="h-[38px] px-4 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-800"
        >
          Apply Filters
        </button>
      </form>

      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-2 font-medium text-gray-600">
                Question
              </th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">
                Tags
              </th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">
                Category
              </th>
              <th className="text-left px-4 py-2 font-medium text-gray-600">
                Published
              </th>
              <th className="text-right px-4 py-2 font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            ) : faqs.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  No FAQs found.
                </td>
              </tr>
            ) : (
              faqs.map((faq) => (
                <tr
                  key={faq._id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 align-top max-w-xs">
                    <div className="font-medium text-gray-900 line-clamp-2">
                      {faq.question}
                    </div>
                    <div className="text-xs text-gray-500">
                      v{faq.version} • Updated{" "}
                      {new Date(faq.updatedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-2 align-top">
                    <div className="flex flex-wrap gap-1">
                      {faq.tags?.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2 align-top text-gray-700">
                    {faq.category || "-"}
                  </td>
                  <td className="px-4 py-2 align-top">
                    <button
                      onClick={() => handleTogglePublish(faq)}
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        faq.published
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {faq.published ? "Published" : "Unpublished"}
                    </button>
                  </td>
                  <td className="px-4 py-2 align-top text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/faqs/${faq._id}/edit`}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(faq._id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}

