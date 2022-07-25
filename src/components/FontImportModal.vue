<template>
  <n-modal
    v-model:show="open"
    preset="card"
    title="Base font import"
    :bordered="true"
    :segmented="true"
    @after-leave="emit('close')"
    style="width: 50rem; max-height: 80vh"
  >
    <template #header-extra>Cancel</template>

    <h4>Import from <a href="https://fonts.google.com/" target="_blank">Google Fonts</a> (sorted by popularity)</h4>
    <n-data-table
      v-if="open"
      :columns="tableColumns"
      :data="tableData"
      :pagination="{ pageSize: 10 }"
      :bordered="false"
      v-model:checked-row-keys="checkedRowKeys"
    />
    <template #footer>
      <n-space justify="space-between">
        <n-p v-if="checkedRowKeys.length">
          You have selected {{ checkedRowKeys.length }} font{{ checkedRowKeys.length > 1 ? "s" : "" }}.
        </n-p>
        <n-p v-if="!checkedRowKeys.length"> None selected. </n-p>
        <n-button @click="handleImport()" :disabled="!checkedRowKeys.length">Import</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFetch } from "@vueuse/core";

export interface KT_Font {
  key: number;
  family: string;
  category: string;
  files: number;
  children?: {
    family: string;
  };
}

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "import", fonts: KT_Font[]): void;
  (e: "close"): void;
}>();

const google_fonts = ref([]);
const loaded = ref(false);
const checkedRowKeys = ref([]);
const tableData = ref<KT_Font[]>([]);
const tableColumns = [
  {
    type: "selection",
    options: ["all", "none"],
  },
  {
    title: "Family",
    key: "family",
  },
  {
    title: "Category",
    key: "category",
  },
  {
    title: "Files",
    key: "files",
  },
];

async function loadFontList() {
  console.log("Loading google fonts list");
  const { isFetching, error, data } = await useFetch(
    "https://webfonts.googleapis.com/v1/webfonts?sort=POPULARITY&key=AIzaSyDHG2TBV7XtAHGMz20nWfjmZHlDwjv9cnw"
  )
    .get()
    .json();
  google_fonts.value = data.value.items;

  google_fonts.value.forEach((f: KT_Font, idx: number) => {
    /* const children = [];
    for (const [weight, filePath] of Object.entries(f.files)) {
      children.push({
        key: Math.ceil(Math.random()*100000000000000),
        family: "" +f.family+"-"+weight
      });
    } */

    tableData.value.push({
      key: idx,
      family: f.family,
      category: f.category,
      files: Object.keys(f.files).length,
      //children: children
    });
  });
}

onMounted(async () => { loadFontList() });

function handleImport(): void {
  const importedFonts = [];
  for (const val of Object.values(checkedRowKeys.value)) {
    const f: KT_Font = google_fonts.value[val];

    importedFonts.push({
      key: val,
      family: f.family,
      category: f.category,
      files: f.files,
    });
  }
  emit("import", importedFonts);
  checkedRowKeys.value = [];
}
</script>

<style scoped>
h4 {
  margin-bottom: 1rem;
}
</style>
