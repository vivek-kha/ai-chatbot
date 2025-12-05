// frontend/src/admin/components/Pagination.jsx
export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  function goTo(p) {
    if (p < 1 || p > totalPages) return;
    onPageChange(p);
  }

  return (
    <div className="flex items-center justify-end gap-2 text-sm">
      <button
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1 rounded-md border border-gray-300 bg-white disabled:opacity-50"
      >
        Prev
      </button>
      <span className="px-2 text-gray-600">
        Page <span className="font-medium">{page}</span> of{" "}
        <span className="font-medium">{totalPages}</span>
      </span>
      <button
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1 rounded-md border border-gray-300 bg-white disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

