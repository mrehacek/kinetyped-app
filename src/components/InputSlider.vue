<template>
  <div :style="{ 'margin-left': marginLeft ? '1.8rem' : 0 }">
    <label v-if="label.length">{{ label }}</label>
    <n-space style="margin-bottom: 0.4rem; margin-top: 0.2rem">
      <n-input-number v-model:value="input_value" size="small" :style="{ width: marginLeft ? '5rem' : '5rem' }" />
      <n-slider
        v-model:value="input_value"
        :step="step"
        :max="max"
        :min="min"
        :style="{ width: marginLeft ? '12rem' : '14rem', 'margin-top': '0.3rem' }"
      />
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const {
  label,
  modelValue,
  marginLeft = false,
  min = 1,
  max = 100,
  step = 1,
} = defineProps<{
  label: string;
  modelValue: number;
  marginLeft: boolean;
  min: number;
  max: number;
  step: number;
}>();

const emits = defineEmits(["update:modelValue"]);

const input_value = computed({
  get() {
    return modelValue;
  },
  set(value) {
    emits("update:modelValue", value);
  },
});
</script>

<style scoped></style>
