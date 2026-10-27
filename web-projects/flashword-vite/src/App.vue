<script>
import WordCard from './components/WordCard.vue';

export default {
  components: {
    WordCard,
  },
  data() {
    return {
      words: [],
      shuffledWords: [],
      correctCount: 0,
      completed: false,
      completedAt: null,
      startedAt: null,
      incorrectAttempts: 0,
      playerName: '',
      leaderboard: [],
      loadingWords: true,
      loadingLeaderboard: true,
      wordsError: '',
      leaderboardError: '',
      submissionError: '',
      submittingScore: false,
      scoreSubmitted: false,
    };
  },
  computed: {
    wordCount() {
      return this.words.length;
    },
    elapsedSeconds() {
      if (this.startedAt === null || this.completedAt === null) {
        return 0;
      }
      return Math.ceil((this.completedAt - this.startedAt) / 1000);
    },
    score() {
      return this.elapsedSeconds + this.incorrectAttempts * 10;
    },
    rankedLeaderboard() {
      return this.leaderboard
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry) => {
          const time = Number(entry.time);
          const attempts = Number(entry.incorrectAttempts ?? 0);
          const incorrectAttempts = Number.isFinite(attempts)
            ? Math.max(0, attempts)
            : 0;
          const score =
            entry.score !== undefined && Number.isFinite(Number(entry.score))
              ? Number(entry.score)
              : time + incorrectAttempts * 10;

          return { ...entry, time, incorrectAttempts, score };
        })
        .filter(
          (entry) =>
            typeof entry.name === 'string' &&
            entry.name.trim() !== '' &&
            Number.isFinite(entry.time) &&
            Number.isFinite(entry.score)
        )
        .sort(
          (first, second) =>
            first.score - second.score || first.time - second.time
        );
    },
  },
  watch: {
    correctCount() {
      if (this.wordCount > 0 && this.correctCount === this.wordCount) {
        this.completed = true;
        this.completedAt = Date.now();
      }
    },
  },
  methods: {
    incrementCorrectCount() {
      this.correctCount++;
    },
    incrementIncorrectAttempts() {
      this.incorrectAttempts++;
    },
    async loadWords() {
      try {
        const response = await fetch('/api/words');
        if (!response.ok) {
          throw new Error('Server response not ok. Status: ' + response.status);
        }

        const words = await response.json();
        if (!Array.isArray(words)) {
          throw new Error('Words API response must be an array.');
        }

        this.words = words;
        this.shuffledWords = [...words].sort(() => 0.5 - Math.random());
        this.startedAt = Date.now();
      } catch (error) {
        console.error('Error: Unable to fetch words. ', error);
        this.wordsError = 'Error: API call failed.';
      } finally {
        this.loadingWords = false;
      }
    },
    async loadLeaderboard() {
      try {
        const response = await fetch('/api/times');
        if (!response.ok) {
          throw new Error(
            'Leaderboard response not ok. Status: ' + response.status
          );
        }

        const entries = await response.json();
        if (!Array.isArray(entries)) {
          throw new Error('Leaderboard API response must be an array.');
        }

        this.leaderboard = entries;
      } catch (error) {
        console.error('Error: Unable to fetch leaderboard. ', error);
        this.leaderboardError = 'Unable to load the leaderboard.';
      } finally {
        this.loadingLeaderboard = false;
      }
    },
    async submitScore() {
      const name = this.playerName.trim();
      this.submissionError = '';

      if (!name) {
        this.submissionError = 'Enter your name to submit your score.';
        return;
      }
      if (!this.completed || this.submittingScore || this.scoreSubmitted) {
        return;
      }

      this.submittingScore = true;
      const newEntry = {
        name,
        time: this.elapsedSeconds,
        incorrectAttempts: this.incorrectAttempts,
        score: this.score,
      };

      try {
        const response = await fetch('/api/times', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEntry),
        });
        if (!response.ok) {
          throw new Error(
            'Score submission failed. Status: ' + response.status
          );
        }

        const savedEntry = await response.json();
        this.leaderboard.push(savedEntry);
        this.scoreSubmitted = true;
      } catch (error) {
        console.error('Error: Unable to submit score. ', error);
        this.submissionError = 'Unable to submit your score. Please try again.';
      } finally {
        this.submittingScore = false;
      }
    },
  },
  async created() {
    await Promise.all([this.loadWords(), this.loadLeaderboard()]);
  },
};
</script>

<template>
  <div id="app" v-cloak>
    <h2 data-cy="app-header">FlashWord</h2>

    <p v-if="loadingWords">Loading words...</p>
    <p v-else-if="wordsError">{{ wordsError }}</p>
    <p v-else-if="wordCount === 0">No words are available to play.</p>
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
          v-on:incorrectAttempt="incrementIncorrectAttempts"
        >
        </WordCard>
      </div>

      <form
        v-if="completed && !scoreSubmitted"
        id="score-form"
        data-cy="score-form"
        v-on:submit.prevent="submitScore"
      >
        <p data-cy="game-score">
          Your score: {{ score }} ({{ elapsedSeconds }}s +
          {{ incorrectAttempts }} incorrect)
        </p>
        <label for="player-name">Name</label>
        <input
          id="player-name"
          v-model="playerName"
          data-cy="player-name"
          maxlength="40"
          required
        />
        <button type="submit" v-bind:disabled="submittingScore">
          {{ submittingScore ? 'Submitting...' : 'Submit score' }}
        </button>
        <p v-if="submissionError" role="alert">{{ submissionError }}</p>
      </form>
      <p v-else-if="scoreSubmitted" data-cy="score-submitted">
        Your score has been added to the leaderboard.
      </p>
    </template>

    <section id="leaderboard" data-cy="leaderboard">
      <h3>Leaderboard</h3>
      <p>
        Lower scores rank higher: time in seconds + 10 per incorrect answer.
      </p>
      <p v-if="loadingLeaderboard">Loading leaderboard...</p>
      <p v-else-if="leaderboardError" role="alert">{{ leaderboardError }}</p>
      <p v-else-if="rankedLeaderboard.length === 0">
        No leaderboard scores yet.
      </p>
      <ol v-else>
        <li
          v-for="(entry, index) in rankedLeaderboard"
          v-bind:key="entry.id || index"
          data-cy="leaderboard-entry"
        >
          {{ entry.name }} — score {{ entry.score }} ({{ entry.time }}s +
          {{ entry.incorrectAttempts }} incorrect)
        </li>
      </ol>
    </section>
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
  margin: 40px auto 0;
  max-width: 600px;
}

#leaderboard ol {
  display: inline-block;
  text-align: left;
}

#score-form {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}
</style>
