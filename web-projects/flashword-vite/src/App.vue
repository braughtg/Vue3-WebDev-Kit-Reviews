<script>
import WordCard from './components/WordCard.vue';

const LEADERBOARD_KEY = 'flashword-leaderboard';

export default {
  components: {
    WordCard,
  },
  data() {
    return {
      words: [],
      playerName: '',
      score: 0,
      attempts: 0,
      correctCount: 0,
      completed: false,
      hasError: false,
      loading: true,
      leaderboardOpen: false,
      leaderboard: [],
      gameToken: 0,
      runSaved: false,
      runStartedAt: null,
    };
  },
  computed: {
    shuffledWords() {
      return [...this.words].sort(() => 0.5 - Math.random());
    },
    wordCount() {
      return this.words.length;
    },
  },
  methods: {
    // AI-generated code: this centralizes the live game state and browser-only leaderboard persistence.
    sortLeaderboard(entries) {
      return [...entries].sort(
        (a, b) => b.score - a.score || a.completedAt - b.completedAt
      );
    },
    loadLeaderboard() {
      if (typeof localStorage === 'undefined') {
        return [];
      }

      try {
        const stored = localStorage.getItem(LEADERBOARD_KEY);
        return stored ? this.sortLeaderboard(JSON.parse(stored)) : [];
      } catch (error) {
        console.error('Unable to read leaderboard entries.', error);
        return [];
      }
    },
    saveCompletedRun() {
      if (this.runSaved || !this.completed) {
        return;
      }

      const record = {
        playerName: this.playerName.trim() || 'Player',
        score: this.score,
        completedAt: this.runStartedAt ? Date.now() : Date.now(),
        durationMs: this.runStartedAt ? Date.now() - this.runStartedAt : 0,
      };

      this.leaderboard = this.loadLeaderboard();
      this.leaderboard.push(record);
      this.leaderboard = this.sortLeaderboard(this.leaderboard);

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(this.leaderboard));
      }

      this.runSaved = true;
    },
    startNewGame() {
      this.words = this.words.map((word) => ({
        ...word,
        correct: false,
        mistakes: 0,
      }));
      this.score = 0;
      this.attempts = 0;
      this.correctCount = 0;
      this.completed = false;
      this.runSaved = false;
      this.runStartedAt = Date.now();
      this.gameToken += 1;
    },
    handleWordAttempt(event) {
      const { word, isCorrect, answer } = event;
      const activeWord = this.words.find(
        (entry) => entry.word_a === word.word_a
      );

      if (!activeWord || activeWord.correct) {
        return;
      }

      this.attempts += 1;

      if (isCorrect) {
        activeWord.correct = true;
        activeWord.answer = answer;
        this.correctCount += 1;

        if (activeWord.mistakes === 0) {
          this.score += 10;
        } else {
          this.score += 5;
        }

        this.completed = this.correctCount === this.wordCount;
        if (this.completed) {
          this.saveCompletedRun();
        }
        return;
      }

      activeWord.mistakes = (activeWord.mistakes || 0) + 1;
      this.score += activeWord.mistakes === 1 ? -3 : -1;
    },
  },
  async created() {
    this.leaderboard = this.loadLeaderboard();

    try {
      const response = await fetch('/api/words');
      if (!response.ok) {
        throw new Error('Server response not ok. Status: ' + response.status);
      }

      this.words = (await response.json()).map((word) => ({
        ...word,
        correct: false,
        mistakes: 0,
      }));
      this.runStartedAt = Date.now();
    } catch (error) {
      this.hasError = true;
      console.error('Error: Unable to fetch words. ', error);
    } finally {
      this.loading = false;
    }
  },
};
</script>

<template>
  <div v-if="hasError">
    <p>An Error Has Occurred. Please Come Back Later.</p>
  </div>

  <div id="app" v-cloak v-if="!hasError && !loading">
    <h1>FlashWord</h1>

    <div class="toolbar">
      <label class="player-name">
        Player name
        <input v-model="playerName" type="text" placeholder="Enter your name" />
      </label>

      <button type="button" class="primary-button" v-on:click="startNewGame">
        Start another game
      </button>

      <button
        type="button"
        class="secondary-button"
        v-on:click="leaderboardOpen = !leaderboardOpen"
      >
        {{ leaderboardOpen ? 'Hide leaderboard' : 'Show leaderboard' }}
      </button>
    </div>

    <p v-if="completed" id="completed">
      Great work, you have completed all the words!
    </p>
    <p v-else id="correctCount">
      You have answered {{ correctCount }} out of {{ wordCount }} and your score
      is {{ score }}
    </p>

    <div v-if="leaderboardOpen" id="leaderboard" aria-live="polite">
      <h2>Leaderboard</h2>
      <ol v-if="leaderboard.length">
        <li
          v-for="(entry, index) in leaderboard"
          v-bind:key="`${entry.playerName}-${entry.completedAt}-${index}`"
        >
          {{ entry.playerName }} — {{ entry.score }} pts
        </li>
      </ol>
      <p v-else>No completed runs yet.</p>
    </div>

    <div id="cards">
      <WordCard
        v-for="word in shuffledWords"
        v-bind:key="`${word.word_a}-${gameToken}`"
        v-bind:word="word"
        v-on:attempt="handleWordAttempt"
      />
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

.toolbar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.player-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.player-name input {
  padding: 8px 10px;
  border: 1px solid #d0d7de;
  border-radius: 4px;
  font-size: 16px;
}

.primary-button,
.secondary-button {
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  padding: 10px 16px;
}

.primary-button {
  background-color: #0d6efd;
  color: white;
}

.secondary-button {
  background-color: #f3f4f6;
  color: #111827;
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
  margin: 0 auto 20px;
  max-width: 420px;
  background: #f8fafc;
  border: 1px solid #dbeafe;
  border-radius: 10px;
  padding: 12px 16px;
}

#leaderboard h2 {
  margin-top: 0;
}

#leaderboard ol {
  margin: 0;
  padding-left: 20px;
  text-align: left;
}
</style>
