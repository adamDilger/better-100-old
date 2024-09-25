import { createSignal, Show } from "solid-js";

export default function SearchCodeForm() {
  const [code, setCode] = createSignal("");
  const [searching, setSearching] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  async function onSubmit(e: SubmitEvent) {
    e.preventDefault();

    setError(null);
    setSearching(true);

    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const res = await fetch(
        "/api/search-code.json?code=" + encodeURIComponent(code()),
      );

      if (res.status === 404) {
        setError(`Code ${code()} not found`);
        setSearching(false);
        return;
      }

      if (!res.ok) {
        setError("Failed to search for code");
        throw new Error(
          `Failed to submit search: ${res.status} ${res.statusText}`,
        );
      }

      const data = (await res.json()) as { code: string; name: string };
      window.location.href = data.code;
    } catch (e) {
      console.error(e);
      setError("Failed to search for code");
    } finally {
      setSearching(false);
    }
  }

  return (
    <div class="gap-5 pt-4 px-8 text-center">
      <div class="flex md:flex-row justify-center gap-6 flex-col mb-4">
        What's the code to your better 100 countdown?
      </div>

      <form
        id="search-form"
        onSubmit={onSubmit}
        class="flex gap-2 mb-8 mx-8 items-center"
      >
        <input
          name="code"
          placeholder="ABCD"
          maxlength="4"
          minlength="4"
          class="p-2 rounded flex-1 border-2 border-gray-300"
          value={code()}
          onChange={(e) => setCode((e.target as HTMLInputElement).value)}
          autocomplete="countdownCode"
        />

        <button
          class="py-2 px-3 bg-cyan-700 active:bg-cyan-800 text-white disabled:bg-cyan-600/30 rounded"
          type="submit"
        >
          <Show when={searching()} fallback="Search">
            Searching...
          </Show>
        </button>
      </form>

      <Show when={error()}>
        <div class="bg-red-100 text-red-800 p-4 text-center">{error()}</div>
      </Show>
    </div>
  );
}
