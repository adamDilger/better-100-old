import { navigate } from "astro/virtual-modules/transitions-router.js";
import {
  type Component,
  createSignal,
  For,
  Match,
  Show,
  Switch,
} from "solid-js";

type YoutubeItem = {
  id: string;
  title: string;
  thumbnail: string;
};

const MAX_VOTE_COUNT = 3;

let nameInput: HTMLInputElement | undefined;

export default function Form() {
  const [error, setError] = createSignal<string | null>(null);
  const [searching, setSearching] = createSignal(false);
  const [search, setSearch] = createSignal("");
  const [votes, setVotes] = createSignal<Array<YoutubeItem>>([]);
  const [votesConfirmed, setVotesConfirmed] = createSignal(false);
  const [submitting, setSubmitting] = createSignal(false);

  const [name, setName] = createSignal("");

  const [
    responseMessage,
    setResponseMessage,
  ] = createSignal<Array<YoutubeItem> | null>(null);

  async function doSearch() {
    setSearching(true);

    const url = "/api/search.json?search=" + encodeURIComponent(search());
    const response = await fetch(url);

    if (!response.ok) {
      setError("Failed to submit votes");
      setSearching(false);
      throw new Error(
        `Failed to submit search: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    setSearching(false);

    if (data) {
      setResponseMessage(data);
    }
  }

  function addVote(i: YoutubeItem) {
    setVotes([...votes(), { ...i }]);
    setResponseMessage(null);
    setSearch("");
  }

  function confirmVotes() {
    setVotesConfirmed(true);
    nameInput?.focus();
  }

  async function submitVotes() {
    setSubmitting(true);
    const res = await fetch("/api/votes.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name(),
        votes: votes(),
      }),
    });

    if (!res.ok) {
      setError("Failed to submit votes");
      setSubmitting(false);
      throw new Error(
        `Failed to submit votes: ${res.status} ${res.statusText}`,
      );
    }

    window.localStorage.setItem("voted", "true");
    navigate("/tnx");
  }

  return (
    <Switch>
      <Match when={error()}>
        <div class="bg-red-100 text-red-800 p-4 text-center">
          Somthing fkd up: {error()}
        </div>
      </Match>
      <Match when={votesConfirmed()}>
        <div class="flex flex-col gap-2 mb-8 px-8 items-center py-4 w-full">
          <input
            ref={nameInput}
            type="text"
            name="name"
            placeholder="Whats ya name"
            class="p-2 rounded flex-1 border-2 border-gray-300 w-full"
            value={name()}
            onInput={(e) => setName((e.target as HTMLInputElement).value)}
            autocomplete="off"
          />

          <button
            class="py-2 px-3 bg-cyan-700 active:bg-cyan-800 text-white disabled:bg-cyan-600/30 rounded mt-2"
            onClick={submitVotes}
            disabled={name().length < 4 || submitting()}
          >
            <Show when={submitting()} fallback="VOTE!">
              Voting...
            </Show>
          </button>
        </div>
      </Match>

      <Match when={!votesConfirmed()}>
        <div class="flex flex-col pt-3 pb-5">
          <Switch>
            <Match when={votes().length < MAX_VOTE_COUNT}>
              <div class="flex gap-2 mb-8 mx-8 items-center">
                <input
                  type="text"
                  name="search"
                  placeholder="Song/artist..."
                  class="p-2 rounded flex-1 border-2 border-gray-300"
                  value={search()}
                  onInput={(e) =>
                    setSearch((e.target as HTMLInputElement).value)}
                  onKeyUp={(e) => e.key === "Enter" && doSearch()}
                  autocomplete="off"
                />

                <button
                  class="px-3 bg-red-600 active:bg-red-700 text-white disabled:bg-red-300 rounded h-full"
                  onClick={doSearch}
                  disabled={search().length < 3 || searching()}
                >
                  <Show when={searching()} fallback="Search">
                    Searching...
                  </Show>
                </button>
              </div>
            </Match>
          </Switch>

          <Show when={responseMessage()}>
            <div class="mx-2 divide-y divide-gray-300">
              <For each={responseMessage()}>
                {(i) => (
                  <div class="flex items-center space-between bg-white/80">
                    <div class="flex items-center flex-1">
                      <img
                        src={i.thumbnail}
                        style="max-width: 100px"
                        class="rounded-l p-3"
                      />
                      <p class="pl-3 p-2" innerHTML={i.title}></p>
                    </div>

                    <button
                      class="bg-red-100 active:bg-red-200 text-red-800 mx-3 h-10 w-10 rounded-full"
                      onClick={() => addVote(i)}
                    >
                      +
                    </button>
                  </div>
                )}
              </For>
            </div>
          </Show>

          <Show when={!responseMessage()}>
            <Switch>
              <Match when={votes().length === MAX_VOTE_COUNT}>
                <VoteSummary
                  votes={votes()}
                  removeVote={(i) =>
                    setVotes(votes().filter((v) => v.id !== i.id))}
                />

                <div class="flex flex-col items-center mt-5">
                  <p class="font-bold text-lg">
                    These are your votes.
                  </p>

                  <div class="mt-4">
                    <button
                      class="py-2 px-3 bg-cyan-700 active:bg-cyan-900 text-white disabled:bg-cyan-600 rounded h-full"
                      onClick={confirmVotes}
                    >
                      Confirm Votes
                    </button>
                  </div>
                </div>
              </Match>

              <Match when={votes().length < MAX_VOTE_COUNT}>
                <VoteSummary
                  votes={votes()}
                  removeVote={(i) =>
                    setVotes(votes().filter((v) => v.id !== i.id))}
                />
              </Match>
            </Switch>
          </Show>
        </div>
      </Match>
    </Switch>
  );
}

const VoteSummary: Component<{
  votes: Array<YoutubeItem>;
  removeVote: (i: YoutubeItem) => void;
}> = (props) => (
  <Switch>
    <Match when={props.votes.length === 0}>
      <div class="mt-3 text-center">
        <h3 class="mb-1 text-red-800 font-bold">No votes!</h3>
        <p class="text-sm text-gray-700">
          Vote for {MAX_VOTE_COUNT} songs plz
        </p>
      </div>
    </Match>

    <Match
      when={props.votes.length > 0}
    >
      <div class="mt-3 text-center">
        <h3 class="mb-3">Current Votes</h3>

        <div class="mx-3">
          <SummaryList votes={props.votes} remove={props.removeVote} />
        </div>
      </div>
    </Match>
  </Switch>
);

const SummaryList: Component<
  { votes: Array<YoutubeItem>; remove(i: YoutubeItem): void }
> = (props) => (
  <For each={props.votes}>
    {(i) => (
      <div class="flex justify-center items-center mb-2">
        <button
          class="text-red-500 font-bold mr-2 h-6 w-6 rounded flex items-center justify-center"
          onClick={() => props.remove(i)}
        >
          X
        </button>
        <div
          class="text-sm"
          style={{
            "white-space": "nowrap",
            overflow: "hidden",
            "text-overflow": "ellipsis",
          }}
          innerHTML={i.title.replace(/\(.*\)$/, "").replace(
            /MUSIC|VIDEO/g,
            "",
          )}
        >
        </div>
      </div>
    )}
  </For>
);
