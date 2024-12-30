
<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";

import { getHelpList } from "@/request/my";

const router = useRouter();
const selectedKey = ref("");
const state = reactive({
  menuItems: [],
  selectedItem: "",
});


onMounted(() => {
  fetchHelpList();
});

const fetchHelpList = async () => {
  try {
    let params = {
      "limit" : 10,
    };
    const res = await getHelpList(params);
    if (res.code === 0) {
      state.menuItems = res.data?.data || [];
    }
  } catch (e) {
    console.log(e);
  }
};

const onSelect = ({ item,key }) => {
  selectedKey.value = key
  state.selectedItem = item?.content;
};

const goBack = () => {
  router.go(-1);
};
</script>
<template>
  <div class="help-page">
    <div class="back" @click="goBack">
      <img src="@/assets/header/back.svg" alt="" />
      <span class="back-text">{{ $t("V4_back_to_the_previous_page") }}</span>
    </div>

    <div class="content">
      <div class="menu">
        <div class="menu-title">{{ $t("user_assistance") }}</div>
        <a-menu
          mode="vertical"
          :selectedKeys="[selectedKey]"
          @select="onSelect"
        >
          <template v-for="(item, index) in state.menuItems" :key="item?.id">
            <div>
              <a-menu-item :key="item?.id">
                <div class="menu-item-content">
                  <span>{{ item?.title }}</span>
                  <a-radio
                    :checked="selectedKey === item.id"
                    @click.stop
                  ></a-radio>
                </div>
              </a-menu-item>
            </div>

            <a-menu-divider
              v-if="(index + 1) % 2 === 0 && index !== state.menuItems.length - 1"
            />
          </template>
        </a-menu>
      </div>

      <div class="display-area">
        <template v-if="selectedKey">
          <div v-html="state.selectedItem"></div>
        </template>
        <template v-else>
          <div class="empty-state">
            <img
              src="https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570"
              alt="Empty state illustration"
            />
            <p>请选择左侧"使用帮助"内的文档</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>


<style scoped>
.help-page {
  padding: 20px;
}
.back {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;
}
.back-text {
  margin-left: 10px;
  color: blue;
}

.content {
  display: flex;
  background-color: #fff;
}

.menu {
  width: 350px;
  border-right: 1px solid #f0f0f0;
  padding: 20px 0;
}

.menu-title {
  background-color: #f7f9fb;
  color: #4c687b;
  font-size: 16px;
  font-weight: normal;
  padding: 15px 20px;
  margin: 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.menu-item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.display-area {
  flex: 1;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-state {
  text-align: center;
}

.empty-state img {
  width: 200px;
  margin-bottom: 20px;
}

.empty-state p {
  color: #999;
}

/* :deep(.ant-menu-item:first-child) {
  margin-top: 8px;
}

:deep(.ant-menu-item:last-child) {
  margin-bottom: 8px;
} */

:deep(.ant-menu-item) {
  height: auto;
  line-height: 1.5;
  padding: 12px 16px;
  margin-top: 4px;
  margin-bottom: 4px;
  font-size: 14px;
  color: black;
}
:deep(.ant-menu-item-selected) {
  background-color: #e6f7ff !important;
}

:deep(.ant-menu-item:hover) {
  background-color: #f0f0f0;
}

:deep(.ant-radio-wrapper) {
  margin-right: 0;
}

.header {
  font-size: 16px;
  font-weight: bold;

  margin-bottom: 20px;
}
.rules, .additional-rules {
  margin-bottom: 20px;
}

.rules p, .additional-rules p {
    color:#818181;
  margin: 12px;
}

.floor-plan {
  text-align: center;
  margin: 20px 0;
}

.floor-plan img {
  max-width: 100%;
  height: auto;
}
</style>
