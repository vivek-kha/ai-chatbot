// frontend/src/admin/pages/FaqEditor.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import adminApi from "../../api/adminApi";

export default function FaqEditor() {
  const { id } = useParams(); // "new" or actual id
  const isEdit = id && id !== "new";
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("general");
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load existing FAQ when editing
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        setLoading(true);
        const res = await adminApi.get(`/faqs/${id}`);
        const faq = res.data;
        setQuestion(faq.question || "");
        setAnswer(faq.answer || "");
        setTags((faq.tags || []).join(", "));
        setCategory(faq.category || "general");
        setPublished(Boolean(faq.published));
      } catch (err) {
        console.error(err);
        setError("Failed to load FAQ");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      question,
      answer,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      category,
      published,
    };

    try {
      if (isEdit) {
        await adminApi.put(`/faqs/${id}`, payload);
      } else {
        await adminApi.post("/faqs", payload);
      }
      navigate("/admin/faqs");
    } catch (err) {
      console.error(err);
      setError("Save failed. Please check inputs.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">
          {isEdit ? "Edit FAQ" : "Create FAQ"}
        </h1>
        <Link
          to="/admin/faqs"
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          ← Back to list
        </Link>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 shadow-sm rounded-lg p-5 space-y-4"
        >
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={2}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the FAQ question..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Answer
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={6}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="Enter the answer. You can write in plain text or simple markdown style."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="billing, refund, account"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Comma-separated. Used for filtering & relevance.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="general / billing / technical"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 mt-6">
              <input
                id="published"
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label
                htmlFor="published"
                className="text-sm text-gray-700 cursor-pointer"
              >
                Published
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => navigate("/admin/faqs")}
              className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

