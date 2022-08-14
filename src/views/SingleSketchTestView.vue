<template>
  <div
    :id="sketch_id"
    :style="{
      width: props_setup.canvasWidth + 'px',
      height: props_setup.canvasHeight + 'px',
      'min-height': props_setup.canvasHeight + 'px',
    }"
    style="border: solid 1px black"
  ></div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { watchDebounced } from "@vueuse/core";
import { useP5Helpers } from "../composables/p5-helpers";
import { KT_P5 } from "../types";
import s_template from "../p5/template";

const { p5_bind_sketch, p5_bind_data } = useP5Helpers();

const sketch_id = "sketch-shader-test";

const props_setup = reactive({
  canvasWidth: 1000,
  canvasHeight: 500,
});
const props_draw = reactive({});

let s_instance: KT_P5 | null = null;

onMounted(async () => {
  // @ts-expect-error
  const s_reactive = p5_bind_data(s_template, props_setup, props_draw);
  // @ts-expect-error
  s_instance = await p5_bind_sketch(s_reactive, sketch_id);

  // if props_setup changes, wait a little, and then reset the p5 sketch
  watchDebounced(
    props_setup,
    () => { if (s_instance) {
        s_instance.reset();
      } },
    { debounce: 15, maxWait: 20 },
  );
});
</script>
