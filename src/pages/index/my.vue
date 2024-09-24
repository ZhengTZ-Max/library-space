<script setup>
import { CheckCircleFilled } from "@ant-design/icons-vue";
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
const state = reactive({
  rightNavs: [
    { label: "常用预约", link: "c-appointments" },
    { label: "座位预约记录", link: "seat-record" },
  ],
  isShowDrawer: false,
});

const formState = reactive({
  studentId: "",
  name: "",
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const onShowDrawer = () => {
  state.isShowDrawer = true;
};

const onHideDrawer = () => {
  state.isShowDrawer = false;
};

const isRightActiveNav = (link) => {
  return route.path?.includes(link);
};

const onChangeNav = (item) => {
  console.log(item, router);
  router.replace(`/my/${item?.link}`);
};
</script>
<template>
  <div class="my">
    <div class="userInfo">
      <div class="useHelp clickBox">
        <img class="helpSvg" src="@/assets/my/help.svg" alt="" />
        <p class="helpTxt">使用与帮助</p>
        <img class="rightIcon" src="@/assets/my/rightIcon.svg" alt="" />
      </div>
      <div class="info">
        <h1 class="userName">Test001</h1>
        <div class="status">
          <CheckCircleFilled style="color: #4cc911; font-size: 18px" />
          <span style="margin-left: 6px">20240922</span>
        </div>

        <div class="infoItem" style="border-top: 1px solid #f5f5f5">
          <div class="itemLabel">手机号</div>
          <div class="itemRight">
            <span>15201112740</span>
            <img class="activeBtn" src="@/assets/my/edit.svg" alt="" />
          </div>
        </div>
        <div class="infoItem">
          <div class="itemLabel">邮箱</div>
          <div class="itemRight">
            <span>15201112740</span>
            <img class="activeBtn" src="@/assets/my/edit.svg" alt="" />
          </div>
        </div>
        <div class="infoItem">
          <div class="itemLabel">学工号</div>
          <div class="itemRight">15201112740</div>
        </div>
        <div class="infoItem">
          <div class="itemLabel">部门/专业</div>
          <div class="itemRight">15201112740</div>
        </div>
        <div class="infoItem">
          <div class="itemLabel">当前状态</div>
          <div class="itemRight">15201112740</div>
        </div>
        <div class="infoItem">
          <div class="itemLabel">卡有效期</div>
          <div class="itemRight">15201112740</div>
        </div>
        <div class="infoItem">
          <div class="itemLabel">微信</div>
          <div class="itemRight">
            <span>z4824614</span>
            <span class="wxBind activeBtn">解绑</span>
          </div>
        </div>

        <div class="actionBot">
          <a-button
            shape="round"
            block
            style="margin-right: 20px; color: #868686"
            >退出登录</a-button
          >

          <a-button
            type="primary"
            shape="round"
            ghost
            block
            @click="onShowDrawer"
            >修改密码</a-button
          >
        </div>
      </div>
    </div>
    <div class="rightCon">
      <div class="rightNavBox">
        <template v-for="item in state.rightNavs" :key="item.link">
          <div
            class="clickBox navItem"
            :class="{ activeNav: isRightActiveNav(item.link) }"
            @click="onChangeNav(item)"
          >
            {{ item.label }}
          </div>
        </template>
        <!-- <div class="clickBox navItem">座位预约记录</div>
        <div class="clickBox navItem">空间预约记录</div>
        <div class="clickBox navItem">活动预约记录</div> -->
      </div>
      <div class="routerCon">
        <router-view />
      </div>
    </div>
  </div>

  <a-drawer
    title="修改密码"
    :open="state.isShowDrawer"
    @close="onClose"
    :footer="null"
    width="600px"
  >
    <a-form
      :model="formState"
      layout="horizontal"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item label="学工号：" name="studentId">
        <a-input
          v-model:value="formState.studentId"
          placeholder="请输入学工号"
        />
      </a-form-item>
      <a-form-item label="姓名：" name="name">
        <a-input v-model:value="formState.name" placeholder="请输入您的姓名" />
      </a-form-item>
      <a-form-item label="原密码：" name="oldPassword">
        <a-input-password
          v-model:value="formState.oldPassword"
          placeholder="请输入原密码"
        />
      </a-form-item>
      <a-form-item label="新密码：" name="newPassword">
        <a-input-password
          v-model:value="formState.newPassword"
          placeholder="请输入新密码"
        />
      </a-form-item>
      <a-form-item label="确认密码：" name="confirmPassword">
        <a-input-password
          v-model:value="formState.confirmPassword"
          placeholder="请再次输入新密码"
        />
      </a-form-item>
    </a-form>
    <template #extra>
      <a-button class="cancel-button" @click="onHideDrawer">取消</a-button>
      <a-button type="primary" class="confirm-button" @click="onSubmit"
        >确认</a-button
      >
    </template>
  </a-drawer>
</template>

<style scoped lang="less">
.my {
  height: 100%;
  padding: 20px;
  background-color: #eef1f7;
  display: flex;

  .userInfo {
    display: flex;
    flex-direction: column;
    width: 30%;
    min-width: 400px;
    max-width: 620px;

    .useHelp {
      height: 90px;
      background: #fff;
      border-radius: 10px;
      display: flex;
      align-items: center;
      padding: 15px 40px 15px 24px;
      .helpSvg {
        width: 60px;
        height: 60px;
      }
      .rightIcon {
        width: 9px;
        height: 16px;
      }
      .helpTxt {
        margin-left: 20px;
        flex: 1;
        font-size: 20px;
        color: #404040;
      }
    }

    .info {
      margin-top: 20px;
      background: #fff;
      border-radius: 10px;
      height: 100%;
      flex: 1;
      padding: 34px 40px;

      .userName {
        padding: 0 10px;
        font-size: 20px;
        margin-bottom: 11px;
      }
      .status {
        padding: 0 10px;
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #616161;
        margin-bottom: 26px;
      }
      .infoItem {
        padding: 16px 10px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid;
        border-color: #f5f5f5;
        font-size: 16px;
        color: #616161;

        .itemLabel {
          flex: 1;
        }

        .itemRight {
          display: flex;
          align-items: center;
          img {
            margin-left: 8px;
          }
          .wxBind {
            font-size: 16px;
            color: #4b90ff;
            margin-left: 10px;
          }
        }
      }

      .actionBot {
        margin-top: 50px;
        padding: 0 20px;
        display: flex;
      }
    }
  }

  .rightCon {
    margin-left: 20px;
    flex: 1;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    .rightNavBox {
      display: flex;
      .navItem {
        padding: 16px 30px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 10px 10px 0px 0px;
        font-size: 16px;
        color: rgba(32, 32, 32, 0.4);
        margin-right: 2px;
      }
      .activeNav {
        background: #ffffff;
        font-size: 16px;
        color: #1a49c0;
      }
    }
    .routerCon {
      flex: 1;
      background: #fff;
      border-radius: 0 10px 10px 10px;
    }
  }
}

.cancel-button,
.confirm-button {
  width: 80px;
  height: 30px; 
  font-size: 14px;
  border-radius: 4px;
  text-align: center;
  padding: 0; /* 移除默认内边距 */
}

.cancel-button {
  margin-right: 10px;
  background-color: #f0f0f0;
  border-color: #d9d9d9;
  color: #9fa0a7;
}

.confirm-button {
  margin-left: 10px;
}
:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-form-item-label) {
  text-align: left !important;
  padding-right: 8px;
}
:deep(.ant-form-item-label > label) {
  font-weight: bold;
}

:deep(.ant-input-affix-wrapper) {
  width: 100%;
}
</style>
