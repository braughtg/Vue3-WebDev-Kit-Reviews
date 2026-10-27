<script>
import WordCard from './components/WordCard.vue';

export default {
  components: {
    WordCard,
  },
  data() {
    return {
      words: [],
      correctCount: 0,
      completed: false,
      hasError: false,
      startedAt: null,
      completionTime: null,
      playerName: '',
      leaderboard: [],
      isLoadingLeaderboard: false,
      isSubmittingTime: false,
      leaderboardError: '',
      submissionSucceeded: false,
    };
  },
  computed: {
    shuffledWords() {
      return [...this.words].sort(() => 0.5 - Math.random());
    },
    wordCount() {
      return this.words.length;
    },
    topPlayers() {
      return [...this.leaderboard]
        .sort((first, second) => first.time - second.time)
        .slice(0, 5);
    },
  },
  watch: {
    correctCount() {
      if (this.wordCount > 0 && this.correctCount === this.wordCount) {
        this.finishGame();
      }
    },
  },
  methods: {
    incrementCorrectCount() {
      this.correctCount++;
    },
    finishGame() {
      if (this.completed) {
        return;
      }

      this.completed = true;
      this.completionTime =
        Math.round((Date.now() - this.startedAt) / 10) / 100;
      this.fetchLeaderboard();
    },
    async fetchLeaderboard() {
      this.isLoadingLeaderboard = true;
      this.leaderboardError = '';

      try {
        const response = await fetch('/api/times');
        if (!response.ok) {
          throw new Error('Server response not ok. Status: ' + response.status);
        }

        const times = await response.json();
        if (
          !Array.isArray(times) ||
          times.some(
            (entry) =>
              !entry ||
              typeof entry.name !== 'string' ||
              !entry.name.trim() ||
              (typeof entry.time !== 'number' &&
                typeof entry.time !== 'string') ||
              (typeof entry.time === 'string' && !entry.time.trim()) ||
              !Number.isFinite(Number(entry.time)) ||
              Number(entry.time) < 0
          )
        ) {
          throw new Error('Server returned an invalid leaderboard.');
        }

        this.leaderboard = times.map((entry) => ({
          id: entry.id,
          name: entry.name,
          time: Number(entry.time),
        }));
      } catch (error) {
        console.error('Error: Unable to fetch leaderboard. ', error);
        this.leaderboardError =
          'Unable to load the leaderboard. Please try again later.';
      } finally {
        this.isLoadingLeaderboard = false;
      }
    },
    async submitTime() {
      const name = this.playerName.trim();
      if (!name) {
        this.leaderboardError = 'Please enter your name.';
        this.submissionSucceeded = false;
        return;
      }

      this.isSubmittingTime = true;
      this.leaderboardError = '';
      this.submissionSucceeded = false;

      try {
        const response = await fetch('/api/times', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            time: this.completionTime,
          }),
        });

        if (!response.ok) {
          throw new Error('Server response not ok. Status: ' + response.status);
        }

        this.submissionSucceeded = true;
        await this.fetchLeaderboard();
      } catch (error) {
        console.error('Error: Unable to submit completion time. ', error);
        this.leaderboardError =
          'Unable to submit your time. Please try again later.';
      } finally {
        this.isSubmittingTime = false;
      }
    },
    formatTime(time) {
      return Number.isInteger(time) ? time : time.toFixed(2);
    },
  },
  async created() {
    try {
      const response = await fetch('/api/words');
      if (!response.ok) {
        throw new Error('Server response not ok. Status: ' + response.status);
      }
      this.words = await response.json();
      this.startedAt = Date.now();
    } catch (error) {
      console.error('Error: Unable to fetch words. ', error);
      this.hasError = true;
    }
  },
};
</script>

<template>
  <div id="app" v-cloak>
    <h2 data-cy="app-header">FlashWord</h2>

    <div v-if="hasError" id="error-message">
      Something went wrong. Please try again later.
    </div>
    <template v-else>
      <p v-if="completed" id="completed">
        Great work, you have completed all the words!
      </p>
      <p v-else data-cy="correct-count" id="correctCount">
        You have answered {{ correctCount }} out of {{ wordCount }}
      </p>

      <div id="cards">
        <WordCard
          v-for="word in shuffledWords"
          v-bind:data-cy="word.word_a + '-card'"
          v-bind:key="word.word_a"
          v-bind:word="word"
          v-on:incrementCorrectCount="incrementCorrectCount"
        >
        </WordCard>
      </div>

      <section
        v-if="completed"
        id="leaderboard"
        aria-labelledby="leaderboard-heading"
      >
        <p data-cy="completion-time">
          Your time: {{ formatTime(completionTime) }} seconds
        </p>

        <h3 id="leaderboard-heading">Top players</h3>
        <p v-if="isLoadingLeaderboard" role="status">Loading leaderboard...</p>
        <ol v-else-if="topPlayers.length" data-cy="leaderboard-list">
          <li
            v-for="(player, index) in topPlayers"
            v-bind:key="player.id || index"
            data-cy="leaderboard-entry"
          >
            {{ player.name }} — {{ formatTime(player.time) }} seconds
          </li>
        </ol>
        <p v-else-if="!leaderboardError">No completion times yet.</p>

        <form v-on:submit.prevent="submitTime">
          <label for="player-name">Your name</label>
          <input
            id="player-name"
            v-model="playerName"
            data-cy="player-name"
            type="text"
            required
            v-bind:disabled="isSubmittingTime"
          />
          <button
            data-cy="submit-time"
            type="submit"
            v-bind:disabled="isSubmittingTime"
          >
            {{ isSubmittingTime ? 'Submitting...' : 'Submit time' }}
          </button>
        </form>

        <p v-if="submissionSucceeded" role="status">Your time was submitted.</p>
        <p v-if="leaderboardError" id="leaderboard-error" role="alert">
          {{ leaderboardError }}
        </p>
      </section>
    </template>
  </div>
</template>

<style scoped>
[v-cloak] {
  display: none;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
  margin-top: 60px;
}

#cards {
  justify-content: center;
  display: grid;
  grid-template-columns: 300px 300px 300px;
  grid-gap: 30px;
}

#correctCount {
  font-size: 20px;
  margin: 10px;
  font-weight: bold;
  padding: 10px;
}

#completed {
  font-size: 20px;
  font-weight: bold;
  color: #0f5132;
  padding: 10px;
  margin: 10px;
}

#leaderboard {
  max-width: 520px;
  margin: 30px auto;
  text-align: left;
}

#leaderboard h3,
#leaderboard [data-cy='completion-time'] {
  text-align: center;
}

#leaderboard form {
  display: grid;
  gap: 8px;
  margin-top: 20px;
}

#leaderboard input,
#leaderboard button {
  box-sizing: border-box;
  font: inherit;
  padding: 8px;
}

#leaderboard button:disabled {
  cursor: wait;
}

#leaderboard-error {
  color: #b42318;
}
</style>
