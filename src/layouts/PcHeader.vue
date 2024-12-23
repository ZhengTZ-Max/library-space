<script setup>
import { reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { OutLogin } from "@/utils";

const router = useRouter();
const route = useRoute();
const store = useStore();
const lang = computed(() => store.state.lang);
const categoryList = computed(() => store.state.categoryList);
// const systemMode = computed(() => store.state.systemMode);

import BookRules from "@/components/BookRules.vue";

const state = reactive({
  navList: [
    {
      label: "首页",
      link: "home",
      langKey: "menu_home",
    },
    {
      label: "我的",
      link: "my",
      langKey: "menu_mycenter",
    },
    {
      label: "规则",
      link: "rule",
      langKey: "menu_rules",
    },
  ],
  quickValue: undefined,
  showRules: false,
});

const isActiveNav = (link) => {
  return route.path?.includes(link);
};
const onChangeNav = (item) => {
  if (item?.link == "rule") {
    state.showRules = true;
  } else {
    router.push(`/${item?.link}`);
  }
};

const handleChange = (id) => {
  let row = categoryList?.value?.find((e) => e?.id == id);
  router.push(row?.path);

  // if (systemMode == "mobile") {
  //   router.push(`/mo${row?.path}`);
  // } else {
  // }
};
const handleOut = () => OutLogin();

const toggleLang = (type) => {
  store.dispatch("updateLang", type);
};
</script>
<template>
  <header class="PcHeader">
    <div class="navl">
      <div class="navItem activeBtn">
        <img
          v-if="lang == 'en'"
          @click="toggleLang('zh')"
          src="@/assets/languageToggle.svg"
          alt=""
        />
        <img
          v-else
          @click="toggleLang('en')"
          src="@/assets/languageToggle.svg"
          alt=""
        />
      </div>
      <div
        v-for="item in state.navList"
        :key="item.link"
        class="navItem activeBtn"
        :class="{ activeLink: isActiveNav(item.link) }"
        @click="onChangeNav(item)"
      >
        {{ $t(item?.langKey) }}
      </div>
    </div>
    <div class="navr">
      <!-- <div class="navItem">我的</div> -->
      <div class="navItem quickSelect">
        <a-select
          v-model:value="state.quickValue"
          @change="handleChange"
          size="small"
          popupClassName="popupQuickSlt"
          placeholder="快速选择"
          :virtual="false"
        >
          <a-select-option v-for="item in categoryList" :value="item.id">
            <!-- <img src="@/assets/home/quickSelectIcon_01.svg" alt="" /> -->
            <img :src="item?.icon" alt="" />
            {{ item.name }}
          </a-select-option>
        </a-select>
      </div>
      <div class="navItem activeBtn" @click="handleOut">
        <img src="@/assets/loginout.svg" alt="" />
      </div>
    </div>
  </header>
  <BookRules v-if="state.showRules" v-model:isShow="state.showRules" />
</template>

<style lang="less" scoped>
.PcHeader {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0 40px;
  width: 100%;
  height: 90px;
  background: #1a49c0;
  font-size: 16px;
  color: #ffffff;

  .navl {
    flex: 1;
    display: flex;
    align-items: center;
    .navItem {
      padding-bottom: 6px;
      margin-right: 70px;
      cursor: pointer;
    }
    .activeLink {
      border-bottom: 2px solid #98b5ff;
    }
  }
  .navr {
    display: flex;
    align-items: center;
    .navItem {
      cursor: pointer;
    }
    .quickSelect {
      margin-right: 40px;
      width: 180px;
      padding: 9px 16px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 21px;

      :deep(.ant-select) {
        display: block;
        .ant-select-selector {
          background-color: transparent !important;
          border: none;
          .ant-select-selection-item {
            color: #fff;
            display: flex;
            align-items: center;
            img {
              margin-right: 6px;
              filter: invert(0) brightness(6);
            }
          }
        }
        .ant-select-selection-placeholder {
          color: #ffffffa0 !important;
        }
        .ant-select-arrow {
          color: #fff;
        }
      }
    }
  }
}
</style>

<style lang="less">
.popupQuickSlt {
  background-color: rgb(76, 109, 204);

  .ant-select-item {
    padding: 12px;
    color: #fff;
    img {
      filter: invert(0) brightness(6);
    }
  }
  .ant-select-item-option-selected {
    color: rgb(255 255 255) !important;
    font-weight: 600;
    background-color: rgba(0, 0, 0, 0.14) !important;
  }
}
</style>
