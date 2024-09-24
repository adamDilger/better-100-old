export default function SearchCodeForm() {
  const searchForm = document.querySelector<HTMLFormElement>("#search-form")!;

  function onSubmit(e) {
    e.preventDefault();
    console.log(e);

    // // get data from the form
    // const formData = new FormData(searchForm);
    // console.log(formData);
    // console.log(formData.get("code"));
  }

  return (
    <div class="gap-5 px-8 text-center">
      <div class="flex md:flex-row justify-center gap-6 flex-col mb-4">
        What's the code to your better 100 countdown?
      </div>

      <form id="search-form" onSubmit={onSubmit}>
        <input
          class="px-4 py-2 border rounded"
          name="code"
          placeholder="ABCD"
          maxlength="4"
          minlength="4"
        />
      </form>
    </div>
  );
}
