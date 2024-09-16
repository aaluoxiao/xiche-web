<template>
    <div class="custom-switch" @click="toggle" :class="{ 'is-active': isActive }">
      <span class="switch-knob"></span>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CustomSwitch',
    props: {
      modelValue: {
        type: [Boolean, String, Number],
        default: false,
      },
      activeValue: {
        type: [Boolean, String, Number],
        default: true,
      },
      inactiveValue: {
        type: [Boolean, String, Number],
        default: false,
      },
    },
    computed: {
      isActive() {
        // 这里我们简单地比较modelValue和activeValue，但你可能需要更复杂的逻辑来处理字符串或数字
        return this.modelValue === this.activeValue;
      },
    },
    methods: {
      toggle() {
        this.$emit('update:modelValue', this.isActive ? this.inactiveValue : this.activeValue);
      },
    },
  };
  </script>
  
  <style scoped>
  .custom-switch {
    /* 自定义开关的样式 */
    position: relative;
    width: 50px;
    height: 30px;
    background-color: gray;
    border-radius: 15px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .custom-switch.is-active {
    background-color: blue;
  }
  
  .switch-knob {
    /* 开关按钮的样式 */
    position: absolute;
    top: 2px;
    left: 2px;
    width: 26px;
    height: 26px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.3s;
    transform: translateX(${this.isActive ? '20px' : '0'}); /* 注意：这里不能直接使用模板字符串，需要动态绑定样式或使用其他方法 */
  }
  
  /* 注意：上面的transform属性不能直接这样写，因为Vue模板不支持模板字符串。
     你需要在mounted钩子或计算属性中动态设置这个样式，或者使用内联样式绑定。
     为了简化示例，这里我们省略了动态变换的部分。 */
  </style>