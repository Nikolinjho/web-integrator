<template>
  <div id="app">
    <button
      class="backward"
      :class="{ backward_empty: !savedDataLength }"
      @click="backward"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.0005 6.91394V2.58594L6.29353 7.29294L2.51953 11.0669L6.36053 14.2679L11.0005 18.1349V13.8999C19.1465 13.2859 22.0005 17.9999 22.0005 17.9999C22.0005 15.0629 21.7585 12.0149 19.4495 9.70694C16.7655 7.02194 12.8785 6.83194 11.0005 6.91394Z"
          fill="#393939"
        />
      </svg>
      <div class="backward__title">BACK</div>
    </button>
    <div class="container">
      <div class="container__left">
        <div class="select" v-for="(item, index) in data" :key="item.key">
          <div :name="`${item.key}`" class="select__input">
            <div class="select__text" @click="openDropdown(index)">
              Please choose an option
            </div>
            <div
              class="select__dropdown"
              v-show="showDropdown && currentDropdown === index"
            >
              <label
                v-for="(option, index) in item.value"
                :key="option.id"
                class="select__option"
                :for="`${option.id}`"
              >
                <input
                  type="checkbox"
                  :id="`${option.id}`"
                  :value="`${option.value}`"
                  :checked="isChecked(option, item.key)"
                  @change="chooseOption(option, item.key, index)"
                />
                <div class="select__option-label">
                  {{ option.value }}
                </div>
              </label>
            </div>
          </div>
        </div>
        <button class="bem-button" @click.prevent="resetSelect">Reset</button>
      </div>
      <div class="container__right">
        <SelectResult :data="selectData" />
      </div>
    </div>
  </div>
</template>

<script>
import SelectResult from './components/SelectResult.vue';

export default {
  name: 'App',
  components: {
    SelectResult,
  },
  data: () => ({
    data: [],
    currentDropdown: 0,
    showDropdown: false,
    selectData: {
      string: [],
      object: [],
      number: [],
      boolean: [],
    },
  }),
  async created() {
    this.data = await fetch(
      `https://raw.githubusercontent.com/WilliamRu/TestAPI/master/db.json`,
    )
      .then(res => {
        if (res.ok) {
          return Promise.resolve(res);
        }
        return Promise.reject({
          status: res.status,
          statusText: res.statusText,
        });
      })
      .then(res => res.json())
      .then(data => data.testArr)
      .then(data => this.customFlat(data))
      .then(data => this.customSplitArray(data))
      .then(data => (this.data = data))
      .catch(error =>
        alert(`Error, with message: ${error.status} ${error.statusText}`),
      );
  },
  methods: {
    customFlat(arr, res = []) {
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (Array.isArray(element)) {
          this.customFlat(element, res);
        } else {
          res.push(element);
        }
      }
      return res;
    },
    customSplitArray(arr) {
      let strings = [];
      let objs = [];
      let numbers = [];
      let bools = [];
      let others = [];

      let id = 0;
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];

        switch (true) {
          case typeof element === 'string':
            strings.push({ id: id++, value: element });

            break;
          case typeof element === 'number':
            numbers.push({ id: id++, value: element });

            break;
          case typeof element === 'boolean':
            bools.push({ id: id++, value: element });

            break;
          case typeof element === 'object' && element != null:
            if (Object.keys(element).length > 0)
              objs.push({ id: id++, value: element.value });

            break;
          default:
            others.push(element);
            break;
        }
      }
      let res = [
        { key: 'string', value: strings },
        { key: 'object', value: objs },
        { key: 'number', value: numbers },
        { key: 'boolean', value: bools },
      ];
      return res;
    },
    resetSelect() {
      for (const key in this.selectData) {
        this.selectData[key] = '';
      }
    },
    openDropdown(index) {
      if (this.showDropdown && this.currentDropdown === index) {
        this.showDropdown = false;
        return;
      }
      this.currentDropdown = index;
      this.showDropdown = true;
    },
    chooseOption(option, key, index) {
      console.log(this.selectData);
      this.$store.dispatch('updateDataState', {
        boolean: [...this.selectData.boolean],
        number: [...this.selectData.number],
        object: [...this.selectData.object],
        string: [...this.selectData.string],
      });

      if (this.selectData[key].includes(option)) {
        const elIndex = this.selectData[key].indexOf(option);
        this.selectData[key].splice(elIndex, 1);
        return;
      }
      this.selectData[key].splice(index, 0, option);
    },
    backward() {
      if (this.savedDataLength) {
        const prevData = this.$store.getters.getPreviousState;
        console.log(prevData);
        this.selectData = prevData;
        this.$store.dispatch('popPrevDataState');
      }
    },
  },
  computed: {
    savedDataLength() {
      return this.$store.getters.getSelectDataLength;
    },
    isChecked() {
      return (option, key) => {
        return this.selectData[key].includes(option);
      };
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 60px;
}

.backward {
  display: flex;
  align-items: center;
  outline: none;
  border: none;
  background: transparent;
  cursor: pointer;
  &_empty {
    opacity: 0.6;
    cursor: default;
  }
  &__title {
    margin-left: 5px;
  }
}

.container {
  display: flex;
  &__left {
    margin-right: 25px;
  }
  &__right {
  }
}

.select {
  margin-top: 20px;
  display: flex;
  position: relative;
  cursor: pointer;
  &__input {
    // padding: 12px;
    width: 250px;
    outline: none;
    border: 1px solid #d9d9d9;
  }
  &__text {
    padding: 12px;
  }
  &__dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: calc(100% - 2px);
    max-height: 150px;
    overflow: auto;
    z-index: 2;
    background: #fff;
    border: 1px solid #d9d9d9;
    border-top: none;
    box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
  }
  &__option {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 12px;
    &-label {
      margin-left: 8px;
    }
    &:hover {
      background: #e3e3e3;
    }
  }
}

.bem-button {
  margin-top: 20px;
  border-radius: 20px;
  border: none;
  outline: none;
  background: rgb(58, 141, 235);
  color: #fff;
  padding: 12px 20px;
  cursor: pointer;
}
</style>
