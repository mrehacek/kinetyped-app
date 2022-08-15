<template>
  <n-layout>
    <n-layout-header bordered style="padding-left: 1.6rem">
      <n-space justify="space-between">
        <n-space>
          <h1 class="logo">Kinetyped</h1>
          <n-menu mode="horizontal" :options="menuOptions" style="padding-top: 0.7rem" />
        </n-space>

        <div class="header-right">
          <a href="https://github.com/mrehacek/kinetyped" target="_blank">
            <img src="/github-64px.png" width="24" height="24" style="position: relative; top: 0.2rem" />
            <span style="font-size: 0.8rem; margin-left: 0.6rem; position: relative; bottom: 0.2rem"
              >Marko Řeháček, 2022</span
            >
          </a>
        </div>
      </n-space>
    </n-layout-header>

    <router-view />
  </n-layout>
</template>

<script setup lang="ts">
import { h } from "vue";
import { RouterLink } from "vue-router";
import type { MenuOption } from "naive-ui";

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "editor",
          },
        },
        { default: () => "Editor" }
      ),
    key: "editor",
  },
  {
    key: "divider-1",
    type: "divider",
    props: {
      style: {
        marginLeft: "32px",
      },
    },
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "type",
          },
        },
        { default: () => "Single sketch" }
      ),
    key: "type",
  },
];
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

.header-right {
  height: 100%;
  display: flex;
  align-items: center;
  margin-right: 1rem;
  color: darkgrey;
}

.header-right a span {
  color: darkgrey;
  text-decoration: none;
}

.header-right a:link {
  text-decoration: none;
}
.header-right a:visited {
  text-decoration: none;
}
.header-right a:hover {
  text-decoration: none;
}
.header-right a:active {
  text-decoration: none;
}
</style>
