<template>
  <div class="help-page">
    <div class="back" @click="goBack">
      <img src="@/assets/header/back.svg" alt="" />
      <span class="back-text">返回上级页面</span>
    </div>

    <div class="content">
      <div class="menu">
        <div class="menu-title">使用帮助</div>
        <a-menu
          mode="vertical"
          :selectedKeys="[selectedKey]"
          @select="onSelect"
        >
          <template v-for="(item, index) in menuItems" :key="item.key">
            <div>
              <a-menu-item :key="item.key">
                <div class="menu-item-content">
                  <span>{{ item.title }}</span>
                  <a-radio
                    :checked="selectedKey === item.key"
                    @click.stop
                  ></a-radio>
                </div>
              </a-menu-item>
            </div>

            <a-menu-divider
              v-if="(index + 1) % 2 === 0 && index !== menuItems.length - 1"
            />
          </template>
        </a-menu>
      </div>

      <div class="display-area">
        <template v-if="selectedKey">
          <div v-if="selectedKey === '1'">
            <h3>预约系统使用指南</h3>
            <p>这里是预约系统的详细使用说明...</p>
          </div>
          <div v-else-if="selectedKey === '2'">
            <h3>场馆预约规则说明</h3>
            <p>这里是关于场馆预约的规则和注意事项...</p>
          </div>
          <div v-else-if="selectedKey === '3'">
            <h3>设备租借指南</h3>
            <p>这里是关于如何租借设备的详细说明...</p>
          </div>
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

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const selectedKey = ref("");
const menuItems = reactive([
  { key: "1", title: "预约系统使用指南" },
  { key: "2", title: "场馆预约规则说明" },
  { key: "3", title: "设备租借指南" },
  { key: "4", title: "帮助内容帮助内容XXX" },
  { key: "5", title: "帮助内容帮助内容XXXXX" },
  { key: "6", title: "帮助内容帮助内容XXX" },
  { key: "7", title: "帮助内容帮助内容XXX" },
  { key: "8", title: "帮助内容帮助内容XXXXX" },
]);

const onSelect = ({ key }) => {
  selectedKey.value = key;
};

const goBack = () => {
  router.go(-1);
};
</script>

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
</style>
