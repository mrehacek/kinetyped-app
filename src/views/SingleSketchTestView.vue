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
import { useP5Helpers } from "../composables/p5-helpers";
import { KT_P5 } from "../types";
import s_template from "../p5/template";

const { p5_bind_sketch, p5_bind_data } = useP5Helpers();

const sketch_id = "sketch-shader-test";

const sketch_data_setup = reactive({
  canvasWidth: 1000,
  canvasHeight: 500,
});

const sketch_data_draw = reactive({});

let s_instance: KT_P5 | null = null;

onMounted(async () => {
  // @ts-expect-error
  const s_reactive = p5_bind_data(s_template, sketch_data_setup, sketch_data_draw);
  // @ts-expect-error
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
