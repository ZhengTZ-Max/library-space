<route>
  {
    meta: {
      showHead: false,
      showTabbar:true
    }
  }
  </route>
<script setup>
import { reactive, computed, onMounted } from "vue";
import { OutLogin } from "@/utils";
import { useStore } from "vuex";
import { getMyInfo } from "@/request/my";

const store = useStore();
const lang = computed(() => store.state.lang);

const state = reactive({
  rightNavs: [
    {
      label: "常用预约",
      link: "c-appointments",
      icon: "@/assets/my/mobile_profile_item.svg",
    },
    {
      label: "座位预约记录",
      link: "seat-record",
      icon: "@/assets/my/mobile_seat.svg",
    },
    {
      label: "空间预约记录",
      link: "area-record",
      icon: "@/assets/my/mobile_area.svg",
    },
    {
      label: "帮助与反馈",
      link: "help-feedback",
      icon: "@/assets/my/mobile_help.svg",
    },
  ],

  userInfo: {},
});

onMounted(() => {
  fetchMyInfo();
});
const fetchMyInfo = async () => {
  try {
    const res = await getMyInfo();
    if (res.code === 0) {
      state.userInfo = res.data || {};
      if (state.userInfo.name) {
        store.dispatch("setUserName", res.data.name);
      }
    }
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

const handleOut = () => OutLogin();

const toggleLang = () => {
  if (lang.value == "zh") {
    store.dispatch("updateLang", "en");
  } else {
    store.dispatch("updateLang", "zh");
  }
};
</script>
<template>
  <div class="profile">
    <div class="profile_header">
      <div class="profile_header_top">
        <div class="profile_header_top_left">
          <div class="user_name">{{ state.userInfo.name }}</div>
          <div class="user_id">{{ state.userInfo?.id }}</div>
        </div>
        <div class="profile_header_top_right">
          <img
            src="@/assets/my/mobile_change_language.svg"
            @click="toggleLang"
            alt=""
          />
        </div>
      </div>
    </div>
    <div class="profile_content">
      <div class="profile_content_broder">
        <div class="profile_content_item" @click="goToLink('/mo/...')">
          <img src="@/assets/my/mobile_profile_item.svg" alt="" />
          <div class="profile_content_item_text">常用预约</div>
          <img src="@/assets/my/rightIcon.svg" alt="" />
        </div>
        <a-divider />
        <div class="profile_content_item" @click="goToLink('/mo/...')">
          <img src="@/assets/my/mobile_seat.svg" alt="" />
          <div class="profile_content_item_text">座位预约记录</div>
          <img src="@/assets/my/rightIcon.svg" alt="" />
        </div>
        <a-divider />
        <div class="profile_content_item" @click="goToLink('/mo/...')">
          <img src="@/assets/my/mobile_area.svg" alt="" />
          <div class="profile_content_item_text">空间预约记录</div>
          <div class="profile_content_item_text_right">邀请待确认</div>
          <img src="@/assets/my/rightIcon.svg" alt="" />
        </div>
        <a-divider />
        <div class="profile_content_item" @click="goToLink('/mo/...')">
          <img src="@/assets/my/mobile_help.svg" alt="" />
          <div class="profile_content_item_text">帮助与反馈</div>
          <img src="@/assets/my/rightIcon.svg" alt="" />
        </div>
      </div>
      <div class="profile_content_broder">
        <div class="profile_content_item" @click="goToLink('/mo/...')">
          <img src="@/assets/my/mobile_my_info.svg" alt="" />
          <div class="profile_content_item_text">个人信息</div>
          <img src="@/assets/my/rightIcon.svg" alt="" />
        </div>
        <a-divider />
        <div class="profile_content_item" @click="goToLink('/mo/...')">
          <img src="@/assets/my/mobile_change_password.svg" alt="" />
          <div class="profile_content_item_text">修改密码</div>
          <img src="@/assets/my/rightIcon.svg" alt="" />
        </div>
      </div>
      <div class="profile_footer">
        <button class="footer-button" @click="goToLink('/mo/...')">
          微信解绑
        </button>
        <div class="divider"></div>
        <button class="footer-button" @click="handleOut">退出登录</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.profile {
  position: relative;
  height: 100%;
  background: #fafafa;
  .profile_header {
    height: 185px;
    background: linear-gradient(
      to bottom,
      rgba(26, 73, 192, 1),
      rgba(26, 73, 192, 0.7)
    );
    border-radius: 0 0 30px 30px;
    .profile_header_top {
      display: flex;
      align-items: top;
      justify-content: space-between;
      padding: 25px 15px;
      .profile_header_top_left {
        .user_name {
          font-size: 16px;
          color: rgba(255, 255, 255, 1);
          font-family: AliHeavy;
        }
        .user_id {
          font-size: 14px;
          color: #e9edf9;
        }
      }
    }
  }
  .profile_content {
    position: absolute;
    left: 12px;
    right: 12px;
    top: 112px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .profile_content_broder {
      background: #ffffff;
      border-radius: 8px;
      margin-bottom: 10px;

      .profile_content_item {
        display: flex;
        justify-content: left;
        padding: 15px;

        .profile_content_item_text {
          flex: 1;
          margin-left: 10px;
        }
        .profile_content_item_text_right {
          color: rgba(247, 34, 34, 1);
          margin-right: 10px;
        }
      }
    }
    .profile_footer {
      margin-top: 30px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      border: 1px solid rgba(231, 231, 231, 1);
      border-radius: 22px; /* 圆角效果 */

      .footer-button {
        background: none;
        border: none;
        color: #999; /* 按钮文字颜色 */
        padding: 10px 20px;
        cursor: pointer;
        font-size: 16px;
      }

      .divider {
        width: 1px; /* 分隔线宽度 */
        height: 30px; /* 分隔线高度 */
        background-color: #e0e0e0; /* 分隔线颜色 */
      }
    }
  }
}

.ant-divider-horizontal {
  margin: 0 !important;
}
</style>
