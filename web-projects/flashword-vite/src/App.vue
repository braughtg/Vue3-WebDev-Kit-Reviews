<script>
import WordCard from './components/WordCard.vue';

export default {
  components: {
    WordCard,
  },
  async created() {
    await this.loadWords();
    await this.loadLeaderboard();
  },
  beforeUnmount() {
    window.clearInterval(this.timerId);
  },
  data() {
    return {
      words: [],
      hasError: false,
      correctCount: 0,
      completed: false,
      startedAt: null,
      timerId: null,
      elapsedSeconds: 0,
      playerName: '',
      scoreSubmitting: false,
      scoreSubmitted: false,
      scoreSubmissionError: '',
      leaderboard: [],
      leaderboardLoading: true,
      leaderboardError: '',
    };
  },
  computed: {
    shuffledWords() {
      return [...this.words].sort(() => 0.5 - Math.random());
    },
    wordCount() {
      return this.words.length;
    },
    sortedLeaderboard() {
      return [...this.leaderboard]
        .sort(
          (first, second) =>
            first.time - second.time || first.name.localeCompare(second.name)
        )
        .slice(0, 10);
    },
  },
  watch: {
    correctCount() {
      if (this.wordCount > 0 && this.correctCount === this.wordCount) {
        this.completed = true;
        this.elapsedSeconds = Math.floor((Date.now() - this.startedAt) / 1000);
        window.clearInterval(this.timerId);
        this.timerId = null;
      }
    },
  },
  methods: {
    async loadWords() {
      try {
        const response = await fetch('/api/words');
        if (!response.ok) {
          throw new Error('Server response not ok. Status: ' + response.status);
        }
        this.words = await response.json();
        if (this.wordCount > 0) {
          this.startedAt = Date.now();
          this.timerId = window.setInterval(() => {
            this.elapsedSeconds = Math.floor(
              (Date.now() - this.startedAt) / 1000
            );
          }, 1000);
        }
      } catch (error) {
        console.error('Error: Unable to fetch words. ', error);
        this.hasError = true;
      }
    },
    async loadLeaderboard() {
      this.leaderboardLoading = true;
      this.leaderboardError = '';

      try {
        const response = await fetch('/api/times');
        if (!response.ok) {
          throw new Error('Server response not ok. Status: ' + response.status);
        }

        const scores = await response.json();
        if (!Array.isArray(scores)) {
          throw new Error('Leaderboard response must be an array.');
        }
        this.leaderboard = scores;
      } catch (error) {
        console.error('Error: Unable to load the leaderboard. ', error);
        this.leaderboardError = 'Unable to load the leaderboard.';
      } finally {
        this.leaderboardLoading = false;
      }
    },
    async submitScore() {
      this.playerName = this.playerName.trim();
      if (!this.playerName || this.scoreSubmitting || this.scoreSubmitted) {
        if (!this.playerName) {
          this.scoreSubmissionError = 'Enter your name to save your time.';
        }
        return;
      }

      this.scoreSubmitting = true;
      this.scoreSubmissionError = '';

      try {
        const response = await fetch('/api/times', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.playerName,
            time: this.elapsedSeconds,
          }),
        });
        if (!response.ok) {
          throw new Error('Server response not ok. Status: ' + response.status);
        }

        this.scoreSubmitted = true;
        await this.loadLeaderboard();
      } catch (error) {
        console.error('Error: Unable to save your time. ', error);
        this.scoreSubmissionError =
          'Unable to save your time. Please try again.';
      } finally {
        this.scoreSubmitting = false;
      }
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0');
      const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
      return `${minutes}:${remainingSeconds}`;
    },
    incrementCorrectCount() {
      this.correctCount++;
    },
  },
};
</script>

<template>
  <div id="app" v-cloak>
    <div v-if="hasError">There was an error when loading the words.</div>

    <div v-else>
      <h2 data-cy="app-header">FlashWord</h2>

      <p v-if="completed" id="completed">
        Great work, you have completed all the words!
      </p>
      <p v-else data-cy="correct-count" id="correctCount">
        You have answered {{ correctCount }} out of {{ wordCount }}
      </p>
      <p data-cy="game-timer" aria-live="polite">
        Time: {{ formatTime(elapsedSeconds) }}
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

      <section v-if="completed" aria-labelledby="score-heading">
        <h3 id="score-heading">Save your time</h3>
        <p>Your time: {{ formatTime(elapsedSeconds) }}</p>
        <p v-if="scoreSubmitted" role="status">
          Your time has been added to the leaderboard.
        </p>
        <form v-else v-on:submit.prevent="submitScore">
          <label for="player-name">Name</label>
          <input
            id="player-name"
            v-model.trim="playerName"
            data-cy="player-name"
            type="text"
            maxlength="30"
            autocomplete="name"
          />
          <button type="submit" v-bind:disabled="scoreSubmitting">
            {{ scoreSubmitting ? 'Saving...' : 'Save time' }}
          </button>
        </form>
        <p v-if="scoreSubmissionError" role="alert">
          {{ scoreSubmissionError }}
        </p>
      </section>

      <section aria-labelledby="leaderboard-heading">
        <h3 id="leaderboard-heading">Leaderboard</h3>
        <p v-if="leaderboardLoading" data-cy="leaderboard-loading">
          Loading leaderboard...
        </p>
        <div v-else-if="leaderboardError" role="alert">
          <p>{{ leaderboardError }}</p>
          <button type="button" v-on:click="loadLeaderboard">Try again</button>
        </div>
        <p
          v-else-if="sortedLeaderboard.length === 0"
          data-cy="leaderboard-empty"
        >
          No scores yet.
        </p>
        <table v-else data-cy="leaderboard">
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Name</th>
              <th scope="col">Time</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(score, index) in sortedLeaderboard"
              v-bind:key="score.id || `${score.name}-${score.time}-${index}`"
              data-cy="leaderboard-row"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ score.name }}</td>
              <td>{{ formatTime(score.time) }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 300px));
  gap: 30px;
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

section {
  margin: 30px auto;
  max-width: 600px;
}

form {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  border-bottom: 1px solid #ccc;
}
</style>
