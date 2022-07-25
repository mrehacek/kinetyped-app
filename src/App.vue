<template>
  <n-layout>
    <n-layout-header bordered style="padding-left: 1.6rem">
      <n-space justify="space-between">
        <h1 class="logo">Kinetyped</h1>
        <!-- <n-menu mode="horizontal" :options="menuOptions" v-model:value="selectedView" /> -->
        <div style="height: 100%; display: flex; align-items: center; margin-right: 1rem; color:darkgrey">Marko Řeháček, 2022</div>
      </n-space>
    </n-layout-header>

    <KinetypeView />
  </n-layout>
</template>

<script setup lang="ts">
import KinetypeView from "./views/KinetypeView.vue";
</script>

<style>
html,
body {
  height: 100%;
  display: flex;
  flex-direction: column;
}

h1.logo {
  max-height: 42px;
  font-size: 1.25rem;
}
</style>
