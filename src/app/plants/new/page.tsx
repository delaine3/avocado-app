import NewPlantForm from "@/src/components/NewPlantForm";

export default function NewPlantPage() {
  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10  page">
      <div className="page-header">
        <h1 className="title">Add a New Plant</h1>
        <p className="">
          Log a new seedling, rescue case, or future tree in the squad.
        </p>
      </div>

      <NewPlantForm />
    </main>
  );
}
