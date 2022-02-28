<template>
  <div class="result">
    <div class="result__item" v-for="(item, index) in orderedData" :key="index">
      Value:
      <span v-for="el in item" :key="el.id">
        {{ el.value }}
      </span>
    </div>
    <div class="result__encrypted">Encrypted (sha256): {{ encrypted }}</div>
    <div class="result__encrypted">Calculated (numbers): {{ calculated }}</div>
  </div>
</template>

<script>
const sha256 = require('js-sha256').sha256;

export default {
  name: 'select-result',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    encrypted() {
      let str = '';
      for (const key in this.data) {
        for (const iterator of this.data[key]) {
          str += iterator;
        }
      }
      if (str !== '') return sha256(str);

      return str;
    },
    calculated() {
      let sum = 1;
      for (let i = 0; i < this.data.number.length; i++) {
        sum *= this.data.number[i].value;
      }
      if (sum !== 1) return sum;
      return '';
    },
    orderedData() {
      return {
        string: [...this.data.string],
        object: [...this.data.object],
        number: [...this.data.number],
        boolean: [...this.data.boolean],
      };
    },
  },
};
</script>

<style scoped lang="scss">
.result {
  &__item {
    margin-top: 20px;
    padding: 12px;
  }
  &__encrypted {
    margin-top: 25px;
    padding: 12px;
    font-weight: bold;
  }
}
</style>
