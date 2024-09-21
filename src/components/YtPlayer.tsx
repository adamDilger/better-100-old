import { createSignal, onMount, Show } from "solid-js";

type PlayerVote = {
  id: number;
  title: string;
  videoId: string;
  thumbnailUrl: string;
  thumbnailLgUrl: string;
  personName: string;

  count: number;
};

export default function Player(props: { eventCode: string }) {
  const [playerReady, setPlayerReady] = createSignal(false);
  const [countdownStarted, setCountdownStarted] = createSignal(false);
  const [voteCount, setVoteCount] = createSignal(0);
  const [changingVote, setChangingVote] = createSignal(false);
  const [votePersonName, setVotePersonName] = createSignal("");

  const voices = window.speechSynthesis.getVoices();

  let player: YT.Player;
  (window as any).onYouTubeIframeAPIReady = initPlayer;
  onMount(initPlayer);

  function initPlayer() {
    if (!window.YT) return;
    if (player) return;

    player = new window.YT.Player("player", {
      height: "390",
      width: "640",
      // videoId: 'ipe8cfJNt_o',
      playerVars: {
        playsinline: 1,
        // controls: 0,
        rel: 0,
        enablejsapi: 1,
      },
      events: {
        "onReady": () => setPlayerReady(true),
        "onStateChange": onPlayerStateChange,
      },
    });
  }

  async function onPlayerStateChange(event: YT.OnStateChangeEvent) {
    console.log("onPlayerStateChange", event);

    if (event.data == YT.PlayerState.PLAYING) {
      console.log("video playing");
    }

    if (event.data == YT.PlayerState.ENDED) {
      console.log("video ended");
      const nextVote = await markComplete();
      update(nextVote);
    }
  }

  async function firstSong() {
    const res = await fetch(`/api/player/${props.eventCode}/next.json`);
    const data = await res.json();
    update(data);
  }

  async function markComplete(): Promise<PlayerVote> {
    const res = await fetch(`/api/player/${props.eventCode}/complete.json`);
    const data = await res.json();
    return data;
  }

  function startCountdown() {
    setCountdownStarted(true);
    firstSong();
  }

  async function update(vote: PlayerVote) {
    setVoteCount(vote.count);
    setVotePersonName(vote.personName);

    setChangingVote(true);
    setTimeout(() => setChangingVote(false), 1000);

    await speakNumber(vote.count);
    player.loadVideoById(vote.videoId);
  }

  async function speakNumber(i: number) {
    let msg = new SpeechSynthesisUtterance();
    msg.voice = voices[1];
    msg.text = "Number " + i;
    msg.lang = "en-US";

    speechSynthesis.speak(msg);

    await (new Promise<void>((res) => {
      msg.onend = function (e) {
        console.log("Finished in " + e.elapsedTime + " seconds.");
        res();
      };
    }));
  }

  return (
    <main class="flex flex-col container mx-auto h-full py-7">
      <Show when={!countdownStarted()}>
        <div class="flex-1 flex justify-center items-center mx-4">
          <button
            class="text-5xl bg-red-500 text-white px-14 py-3 rounded-lg disabled:opacity-50"
            onClick={startCountdown}
            disabled={!playerReady()}
          >
            Start the Count!
          </button>
        </div>
      </Show>

      <div
        class="flex flex-col justify-center items-center relative"
        style={{ display: countdownStarted() ? "block" : "none" }}
      >
        <div
          class="top-0 bottom-0 right-0 left-0 bg-black absolute flex items-center justify-center font-extrabold text-white number-overlay"
          style="font-size: 100px"
          classList={{ showing: changingVote() }}
        >
          {voteCount()}
        </div>

        <div class="absolute top-6 right-6 bg-white px-3 rounded">
          <div class="text-4xl font-bold text-red-500">{voteCount()}</div>
        </div>

        <div id="player" style="height: 80vh; width: 100%"></div>
        <p id="voted-by" class="text-center text-lg font-light mt-3">
          Voted by {votePersonName()}
        </p>
      </div>
    </main>
  );
}
