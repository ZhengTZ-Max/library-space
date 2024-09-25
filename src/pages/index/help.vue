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
            <div class="layout">
              <div class="header">场馆预约规则说明</div>

              <div class="rules">
                <p>
                  1.
                  读者预约当日或次日的研讨室,预约登录系统用户名为学号,密码为校园卡统一身份认证密码。
                </p>
                <p>
                  2. 预约时须填写必要的预约申请,研讨室需要提交其他参与人员学号。
                </p>
                <p>
                  3.
                  研讨室开放时间为每日8:00-22:00,各层研讨室每次预约最短1小时,最长4小时。
                </p>
                <p>4. 每人每日可预约使用研讨室一次。</p>
              </div>

              <div class="floor-plan">
                <!-- 这里放置图片 -->
                <img
                  src="https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570"
                  alt="楼层平面图"
                />
              </div>

              <div class="additional-rules">
                <p>
                  5.
                  预约成功后,开始时间前15分钟内可刷卡签到(之前没有其他预约者)。距离预约开始前15分钟,可取消预约。取消具体操作：点击"我的--研讨室预约"取消预约。
                </p>
                <p>
                  6.
                  预约成功后,全部成员须按时刷卡签到;研讨室至少需要3人刷卡签到;预约开始15分钟后,若成员刷卡签到人数未达研讨室最少使用人数,系统记录申请人违约一次,并且释放本次预约。违约三次后将被暂停使用图书馆的座位与空间的预约权限7天。
                </p>
                <p>
                  7.
                  读者进入研讨室后须先查看设备是否完好,有问题请及时联系工作人员（联系方式在预约网页"房间信息"或门口牌卡上查看）。否则,本次设备故障由预约人负责。
                </p>
                <p>
                  8.
                  研讨室使用完成后,使用者负责将室内物品及设备恢复使用前的状态,带走个人物品及废弃物,关好门窗,关闭电源及房门。
                </p>
              </div>
            </div>
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
