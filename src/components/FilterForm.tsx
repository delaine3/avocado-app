type FilterFormProps = {
  healthFilter?: string;
  statusFilter?: string;
  sort?: string;
};
export default function FilterForm({
  statusFilter,
  healthFilter,
  sort,
}: FilterFormProps) {
  return (
    <details className="relative mt-6">
      <form
        method="GET"
        className="absolute z-10 mt-2 flex min-w-64 flex-col gap-3 rounded border bg-white p-4 shadow-lg"
      >
        <label>
          Sort
          <select
            name="sort"
            defaultValue={sort ?? "newest"}
            className="mt-1 w-full rounded border px-3 py-2"
          >
            <option value="newest">Newest added</option>
            <option value="oldest">Oldest added</option>
            <option value="name_asc">Name A → Z</option>
            <option value="name_desc">Name Z → A</option>
          </select>
        </label>
        <label>
          Health
          <select
            name="health"
            defaultValue={healthFilter ?? ""}
            className="mt-1 w-full rounded border px-3 py-2"
          >
            <option value="">All health</option>
            <option value="healthy">Healthy</option>
            <option value="struggling">Struggling</option>
            <option value="recovering">Recovering</option>
            <option value="dead">Dead</option>
          </select>
        </label>

        <label>
          Plant status
          <select
            name="status"
            defaultValue={statusFilter ?? ""}
            className="mt-1 w-full rounded border px-3 py-2"
          >
            <option value="">All plants</option>
            <option value="active">Active</option>
            <option value="gifted">Gifted</option>
            <option value="archived">Archived</option>
          </select>
        </label>

        <button
          type="submit"
          className="rounded bg-[#4a2c14] px-4 py-2 text-white"
        >
          Apply
        </button>
      </form>
    </details>
  );
}
