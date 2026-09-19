<script>
export default {
  name: 'WordCard',
  props: {
    word: {
      type: Object,
      required: true,
      hint: false,
    },
  },
  emits: ['incrementCorrectCount'],
  data() {
    return {
      correct: false,
      answer: '',
      showHint: false,
    };
  },
  methods: {
    checkAnswer() {
      this.correct = this.word.english === this.answer;

      if (this.correct) {
        this.$emit('incrementCorrectCount');
      }
    },
  },
};
</script>

<template>
  <div class="card" v-bind:class="{ correct: correct }">
    <p class="word">{{ word.spanish }}</p>
    <input
      type="text"
      v-if="!correct"
      v-model="answer"
      v-on:keyup.enter="checkAnswer()"
    />
    <p v-else class="correctAnswer">{{ answer }}</p>

    <div v-show="!correct">
      <label for="showHint">Hint? </label>
      <input type="checkbox" id="showHint" v-model="showHint" />
      <span v-show="showHint"> {{ word.hint }}</span>
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: #e8f0ff;
  border-radius: 5px;
  padding: 10px 0;
  font-size: 25px;
}

input[type='text'] {
  border: 0;
  font-size: 25px;
  border-radius: 5px;
  margin-top: 5px;
  text-align: center;
  padding: 5px;
}

.word {
  font-weight: bold;
  padding: 0;
  margin: 0;
}

.correctAnswer {
  padding: 0;
  margin: 0;
}

.correct {
  color: #0f5132;
  background-color: #d1e7dd;
}
</style>
