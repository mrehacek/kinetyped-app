<template>
  <div
    :id="sketch_id"
    :style="{
      width: props_setup.canvasWidth + 'px',
      height: props_setup.canvasHeight + 'px',
      'min-height': props_setup.canvasHeight + 'px',
    }"
  ></div>
</template>

<script setup lang="ts">
import { reactive, onMounted, computed } from "vue";
import { watchDebounced, useWindowSize } from "@vueuse/core";
import { useP5Helpers } from "../composables/p5-helpers";
import { KT_P5 } from "../types";
import s_template from "../p5/type-template";

const { width, height } = useWindowSize();
const { p5_bind_sketch, p5_bind_data } = useP5Helpers();

const sketch_id = "sketch-type-template";

const heightWithoutHeader = computed(() => {
  return height.value - 60;
});

const props_setup = reactive({
  canvasWidth: width,
  canvasHeight: heightWithoutHeader,
  interpolationResolution: 3,
  posX: 250,
  posY: 500,
  fontSize: 350,
  fontPath: "fonts/Roboto/Roboto-Regular.ttf",
  text: "abcd",
});
const props_draw = reactive({
  shapeColor: "hsla(203, 100%, 50%, 1)",
});

let s_instance: KT_P5 | null = null;

onMounted(async () => {
  // @ts-expect-error
  const s_reactive = p5_bind_data(s_template, props_setup, props_draw);
  // @ts-expect-error
  s_instance = await p5_bind_sketch(s_reactive, sketch_id);

  // if props_setup changes, wait a little, and then reset the p5 sketch
  watchDebounced(
    props_setup,
    () => {
      if (s_instance) {
        s_instance.reset();
      }
    },
    { debounce: 15, maxWait: 20 }
  );
});
</script>
