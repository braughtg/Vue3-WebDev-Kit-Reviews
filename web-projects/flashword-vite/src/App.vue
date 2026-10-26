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
  watch: {
    correctCount() {
      this.completed = this.correctCount == this.wordCount;
    },
  },
  methods: {
    incrementCorrectCount() {
      this.correctCount++;
    },
  },
  async created() {
    try {
      let response = await fetch('/api/words');
      if (!response.ok) {
        throw new Error('Server response not ok. Status: ' + response.status);
      }
      this.words = await response.json();
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
</style>
