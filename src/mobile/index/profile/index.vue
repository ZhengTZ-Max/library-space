<route>
  {
    meta: {
      showHead: false,
      showTabbar:true
    }
  }
  </route>
<script setup>
import { reactive, computed, onMounted, watch } from "vue";
import { OutLogin } from "@/utils";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { showConfirmDialog, showToast } from "vant";

import { getMyInfo } from "@/request/my";
import { wx_removeOpenid } from "@/request/login";
import OftenIcon from "@/assets/my/mobile_profile_list/often.svg";
import SeatRecordIcon from "@/assets/my/mobile_profile_list/seatRecord.svg";
import SpaceRecordIcon from "@/assets/my/mobile_profile_list/spaceRecord.svg";
import ActivityRecordIcon from "@/assets/my/mobile_profile_list/activityRecord.svg";
import BookLockerIcon from "@/assets/my/mobile_profile_list/bookLocker.svg";
import LostAndFoundIcon from "@/assets/my/mobile_profile_list/lostAndFound.svg";
import FeedBackIcon from "@/assets/my/mobile_profile_list/feedback.svg";
import MyInfoIcon from "@/assets/my/mobile_profile_list/myInfo.svg";
import ChangePasswordIcon from "@/assets/my/mobile_profile_list/changePassword.svg";

const store = useStore();
const lang = computed(() => store.state.lang);
const categoryList = computed(() => store.state.categoryList);
const router = useRouter();
const state = reactive({
  rightNavs: [
    {
      id: "3",
      label: "常用预约",
      link: "common",
      icon: OftenIcon,
    },
    {
      id: "1",
      label: "座位预约记录",
      link: "seat-record",
      icon: SeatRecordIcon,
    },
    {
      id: "2",
      label: "空间预约记录",
      link: "area-record",
      icon: SpaceRecordIcon,
    },
    {
      id: "6",
      label: "活动预约记录",
      link: "activity-record",
      icon: ActivityRecordIcon,
    },
    {
      id: "10",
      label: "存书柜预约记录",
      link: "book-locker",
      icon: BookLockerIcon,
    },
    {
      id: "14",
      label: "失物招领",
      link: "lostAndFound",
      icon: LostAndFoundIcon,
    },
    {
      id: "15",
      label: "帮助与反馈",
      link: "feedback",
      icon: FeedBackIcon,
    },
  ],

  userInfo: {},
  filterRightNavs: [],
  myInfoNavs: [
    {
      id: "16",
      label: "个人信息",
      link: "my-info",
      icon: MyInfoIcon,
    },
    {
      id: "17",
      label: "修改密码",
      link: "change-password",
      icon: ChangePasswordIcon,
    },
  ],
});
const filterCategoryList = () => {
  state.filterRightNavs = state.rightNavs
    .map((itemA) => {
      if (itemA.id != 6) {
        return {
          ...itemA,
          existsInB: categoryList.value.some((itemB) => itemB.id === itemA.id),
        };
      } else {
        return {
          ...itemA,
          existsInB: categoryList.value.some(
            (itemB) => itemB.id === "6" || itemB.id === "9"
          ),
        };
      }
    })
    .filter((item) => item.existsInB);
};

onMounted(() => {
  fetchMyInfo();
});
watch(
  () => categoryList.value,
  (v) => {
    state.categoryList = v;
    filterCategoryList();
  },
  { immediate: true }
);

const fetchMyInfo = async () => {
  try {
    const res = await getMyInfo();
    if (res.code === 0) {
      state.userInfo = res.data || {};
    }
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

const handleOut = () => OutLogin();

const toggleLang = (type) => {
  store.dispatch("updateLang", type);
};

const goToLink = (link) => {
  console.log(link);
  if (link == "common") {
    router.push(`/mo/common`);
  } else if (link == "feedback") {
    router.push(`/mo/feedback`);
  } else {
    router.push(`/mo/profile/${link}`);
  }
};

const unbindWx = () => {
  try {
    showConfirmDialog({
      title: `提示`,
      message: `是否确认解绑微信登录？`,
    })
      .then(async () => {
        const res = await wx_removeOpenid();

        if (res.code != 0) {
          showToast({
            message: res.message,
          });
          return false;
        }
        showToast({
          message: res.message,
        });
        // resetSubscribeList();
      })
      .catch(() => {
        // on cancel
      });
  } catch (e) {
    console.log(e);
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
          <div class="navItem activeBtn">
            <img
              v-if="lang == 'en'"
              @click="toggleLang('zh')"
              src="@/assets/my/mobile_change_language.svg"
              alt=""
            />
            <img
              v-else
              @click="toggleLang('en')"
              src="@/assets/my/mobile_change_language.svg"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
    <div class="profile_content">
      <div>
        <van-cell-group inset>
          <van-cell
            v-for="item in state.filterRightNavs"
            :key="item.id"
            :title="item.label"
            :icon="item.icon"
            size="large"
            is-link
            @click="goToLink(item.link)"
          />
        </van-cell-group>
      </div>

      <div class="profile_content_myInfo">
        <van-cell-group inset>
          <van-cell
            v-for="item in state.myInfoNavs"
            :key="item.id"
            :title="item.label"
            :icon="item.icon"
            size="large"
            is-link
            @click="goToLink(item.link)"
          />
        </van-cell-group>
      </div>

      <div class="profile_footer">
        <template v-if="state.userInfo?.open_id">
          <button class="footer-button" @click="unbindWx">微信解绑</button>
          <div class="divider"></div>
        </template>

        <button class="footer-button" style="width: 100%;" @click="handleOut">退出登录</button>
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
          // font-family: AliHeavy;
          font-weight: bold;
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

    .profile_content_myInfo {
      margin-top: 20px;
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
.van-cell-group--inset {
  margin: 0 !important;
}
:deep(.van-icon) {
  padding-top: 5px;
}
</style>
