<template>
  <div
    :id="sketch_id"
    :style="{
      width: sketch_data_setup.canvasWidth + 'px',
      height: sketch_data_setup.canvasHeight + 'px',
      'min-height': sketch_data_setup.canvasHeight + 'px',
    }"
    style="border: solid 1px black"
  ></div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { watchDebounced } from "@vueuse/core";

import sketch_fn from "../p5/shader-test.ts";
import type p5_Extended from "../p5/shader-test.ts";
import { useP5Helpers } from "../composables/p5-helpers.ts";
const { p5_bind_sketch, p5_bind_data } = useP5Helpers();

const sketch_id = "sketch-shader-test";

const sketch_data_setup = reactive({
  canvasWidth: 1000,
  canvasHeight: 500,
});

const sketch_data_draw = reactive({});

let s_instance: p5_Extended | null = null;

onMounted(async () => {
  const s_reactive = p5_bind_data(sketch_fn, sketch_data_setup, sketch_data_draw);
  s_instance = await p5_bind_sketch(s_reactive, sketch_id);

  watchDebounced(
    sketch_data_setup,
    () => { if (s_instance) {
        s_instance.reset();
      } },
    { debounce: 15, maxWait: 20 },
  );
});
</script>
