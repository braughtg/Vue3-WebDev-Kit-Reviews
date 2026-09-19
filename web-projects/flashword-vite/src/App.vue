<script>
import WordCard from './components/WordCard.vue';
import ScoreLine from './components/ScoreLine.vue';

export default {
  components: {
    WordCard,
    ScoreLine,
  },
  data() {
    return {
      words: [
        {
          spanish: 'hola',
          english: 'hello',
          hint: 'greeting',
        },
        {
          spanish: 'uno',
          english: 'one',
          hint: 'number',
        },
        {
          spanish: 'gris',
          english: 'grey',
          hint: 'color',
        },
      ],
      correctCount: 0,
      completed: false,
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
};
</script>

<template>
  <div id="app" v-cloak>
    <h1>FlashWord</h1>

    <ScoreLine
      v-bind:correct-count="correctCount"
      v-bind:word-count="wordCount"
      v-bind:completed="completed"
    />

    <div id="cards">
      <WordCard
        v-for="word in shuffledWords"
        v-bind:key="word.spanish"
        v-bind:word="word"
        v-on:incrementCorrectCount="incrementCorrectCount"
      >
      </WordCard>
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
  grid-template-columns: 300px 300px 300px;
  grid-gap: 30px;
}
</style>
