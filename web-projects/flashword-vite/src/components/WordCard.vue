<script>
export default {
  name: 'WordCard',
  props: {
    word: {
      type: Object,
      required: true,
    },
  },
  emits: ['attempt'],
  data() {
    return {
      correct: false,
      answer: '',
    };
  },
  watch: {
    word: {
      immediate: true,
      handler(nextWord) {
        if (nextWord && nextWord.correct) {
          this.correct = true;
          this.answer = nextWord.answer || this.answer;
        } else {
          this.correct = false;
        }
      },
    },
  },
  methods: {
    // AI-generated code: each submit reports the outcome back to the parent so the app can update the running score and lock solved cards.
    checkAnswer() {
      if (this.correct) {
        return;
      }

      const submittedAnswer = this.answer.trim();
      const isCorrect =
        this.word.word_b.trim().toLowerCase() === submittedAnswer.toLowerCase();
      this.answer = submittedAnswer;

      if (isCorrect) {
        this.correct = true;
      } else {
        this.answer = '';
      }

      this.$emit('attempt', {
        word: this.word,
        isCorrect,
        answer: submittedAnswer,
      });
    },
  },
};
</script>

<template>
  <div class="card" v-bind:class="{ correct: correct }">
    <p class="word">{{ word.word_a }}</p>
    <input
      v-if="!correct"
      v-model="answer"
      type="text"
      v-on:keyup.enter="checkAnswer()"
    />
    <p v-else class="correctAnswer">{{ answer }}</p>
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
