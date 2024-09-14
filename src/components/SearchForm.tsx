import { useState } from "preact/hooks";

type YoutubeItem = {
  id: string;
  title: string;
  thumbnail: string;
};

const MAX_VOTE_COUNT = 3;

export default function Form() {
  const [search, setSearch] = useState("");
  const [votes, setVotes] = useState<Array<YoutubeItem>>([]);

  const [responseMessage, setResponseMessage] = useState<
    Array<YoutubeItem> | null
  >(null);

  async function submit() {
    const response = await fetch(
      "/api/search.json?search=" + encodeURIComponent(search),
    );

    const data = await response.json();

    if (data) {
      setResponseMessage(data);
    }
  }

  function addVote(i: YoutubeItem) {
    console.log(i);

    setVotes([...votes, { ...i }]);
    setResponseMessage(null);
    setSearch("");
  }

  function submitVotes() {
    console.log("Submitting votes", votes);
  }

  return (
    <div class="flex flex-col pt-3 pb-5">
      <div class="flex gap-2 mb-8 mx-8 items-center">
        <input
          type="text"
          name="search"
          placeholder="Song/artist..."
          class="p-2 rounded-md flex-1 border-2 border-gray-300"
          value={search}
          onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
          autocomplete="off"
        />

        <button
          class="px-3 bg-red-600 text-white disabled:bg-red-300 rounded-md h-full"
          onClick={submit}
          disabled={search.length < 3}
        >
          Search
        </button>
      </div>

      <div class="mx-2">
        {responseMessage
          ? responseMessage.map((i) => (
            <div class="flex space-between mb-3 bg-white/80 border-bottom rounded shadow">
              <div class="flex items-center flex-1">
                <img
                  src={i.thumbnail}
                  style="max-width: 100px"
                  class="rounded-l"
                />
                <p
                  class="pl-4 p-2"
                  dangerouslySetInnerHTML={{ __html: i.title }}
                >
                </p>
              </div>

              <div class="flex flex-col justify-center">
                <button
                  class="bg-red-100 text-red-800 mx-3 h-10 w-10 rounded-full"
                  onClick={() => addVote(i)}
                >
                  +
                </button>
              </div>
            </div>
          ))
          : (
            VoteSummary(votes, {
              removeVote: (i) => setVotes(votes.filter((v) => v.id !== i.id)),
              submitVotes,
            })
          )}
      </div>
    </div>
  );
}

function VoteSummary(
  votes: Array<YoutubeItem>,
  { removeVote, submitVotes }: {
    removeVote: (i: YoutubeItem) => void;
    submitVotes: () => void;
  },
) {
  if (votes.length === 0) {
    return (
      <div class="mt-3 text-center">
        <h3 class="mb-1 text-red-800 font-bold">No votes!</h3>
        <p class="text-sm text-gray-700">Vote for {MAX_VOTE_COUNT} songs plz</p>
      </div>
    );
  }

  return (
    <div class="mt-3 text-center">
      <h3 class="mb-3">Current Votes</h3>

      <div class="mx-3">
        {votes.map((i) => (
          <div class="flex justify-center items-center mb-2">
            <button
              class="text-red-500 font-bold mr-2 h-6 w-6 rounded-md bg-gray-100 flex items-center justify-center"
              onClick={() => removeVote(i)}
            >
              X
            </button>
            <div
              class="text-sm"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              dangerouslySetInnerHTML={{
                __html: i.title.replace(/\(.*\)$/, "")
                  .replace(/MUSIC|VIDEO/g, ""),
              }}
            >
            </div>
          </div>
        ))}
      </div>

      {votes.length === 3
        ? (
          <button
            class="mt-5 bg-cyan-700 text-white px-4 py-2 rounded-md"
            onClick={submitVotes}
          >
            Submit your votes
          </button>
        )
        : null}
    </div>
  );
}
