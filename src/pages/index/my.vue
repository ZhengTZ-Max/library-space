<script setup>
import { CheckCircleFilled } from "@ant-design/icons-vue";
import { reactive, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import { getMyInfo, updatePassword, updateMyInfo } from "@/request/my";
import { wx_removeOpenid } from "@/request/login";
import { showConfirmDialog } from "vant";
import { OutLogin } from "@/utils";

const store = useStore();
const router = useRouter();
const route = useRoute();
const categoryList = computed(() => store.state.categoryList);

const state = reactive({
  categoryList: [],
  rightNavs: [
    // { id: "3", label: "常用预约", link: "c-appointments" },
    // { id: "1", label: "座位预约记录", link: "seat-record" },
    // { id: "2", label: "空间预约记录", link: "area-record" },
    // { id: "6", label: "活动预约记录", link: "activity-record" },
    // { id: "10", label: "存书柜预约记录", link: "book-locker" },
    // { id: "14", label: "失物招领", link: "lostAndFound" },
    { id: "3", label: "often_reservation", link: "c-appointments" },
    { id: "1", label: "Seat_Reservation_Record", link: "seat-record" },
    { id: "2", label: "Space_Reservation_Record", link: "area-record" },
    { id: "6", label: "Activity_Appointmen_Record", link: "activity-record" },
    { id: "10", label: "Bookcase_Appointment_Record", link: "book-locker" },
    { id: "14", label: "失物招领", link: "lostAndFound" },
  ],
  isShowDrawer: false,
  userInfo: {},
  filterRightNavs: [],
  isEditEmailAndMobile: false,
  isEditMobile: false,
  isEditEmail: false,

  email: "",
  mobile: "",
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

const onHelp = () => {
  router.push("/help");
};
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
  if (state.filterRightNavs.length > 0) {
    router.replace(`/my/${state.filterRightNavs[0].link}`);
  }
};

onMounted(() => {
  fetchMyInfo();
});

watch(
  () => state.userInfo?.language,
  (v) => {
    if (v) {
      // toggleLang(v === "1" ? "zh" : "en");
    }
  }
);
watch(
  () => state.userInfo?.id,
  (v) => {
    if (v) {
      formState.studentId = v;
    }
  }
);
watch(
  () => state.userInfo?.name,
  (v) => {
    if (v) {
      formState.name = v;
    }
  }
);
watch(
  () => categoryList.value,
  (v) => {
    if (v) {
      state.categoryList = v;
      filterCategoryList();
    }
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

const toggleLang = (type) => {
  store.dispatch("updateLang", type);
};

const userStatusText = computed(() => {
  switch (state.userInfo?.status) {
    case "0":
      return "注销";
    case "1":
      return "正常";
    case "2":
      return "挂失";
    case "3":
      return "临时禁止";
    default:
      return "未知状态";
  }
});

const onSubmit = async () => {
  try {
    if (
      !formState.studentId ||
      !formState.name ||
      !formState.oldPassword ||
      !formState.newPassword ||
      !formState.confirmPassword
    ) {
      message.error("请填写完整信息");
      return;
    }

    if (formState.newPassword !== formState.confirmPassword) {
      message.error("新密码和确认密码不一致");
      return;
    }
    const passwordPattern =
      /^(?=[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%.*?&])[A-Za-z\d@$!%.*?&]{8,12}$/;
    if (!passwordPattern.test(formState.newPassword)) {
      message.error(
        "密码必须在8-12位之间,首位为大写字母,且包含大小写字母、数字和特殊字符(@$!%.*?&)"
      );
      return;
    }

    let params = {
      card: formState.studentId,
      Oldpassword: formState.oldPassword,
      password: formState.newPassword,
      repassword: formState.confirmPassword,
    };

    const res = await updatePassword(params);
    if (res.code === 0) {
      message.success("修改成功");
      onHideDrawer();
    } else {
      message.error(res.msg);
    }
  } catch (error) {
    console.log(error);
  }
};

const onLogout = () => {
  OutLogin();
};

const onSaveMobile = () => {
  if (!state.mobile) {
    message.error("请输入手机号");
    return;
  }
  fetchUpdateMyInfo("mobile");
};

const onSaveEmail = () => {
  if (!state.email) {
    message.error("请输入邮箱");
    return;
  }
  fetchUpdateMyInfo("email");
};

const fetchUpdateMyInfo = async (type) => {
  try {
    let params = {};
    if (type == "mobile") {
      params = {
        mobile: state.mobile,
        email: state.userInfo.email,
      };
    } else if (type == "email") {
      params = {
        email: state.email,
        mobile: state.userInfo.mobile,
      };
    }
    const res = await updateMyInfo(params);
    if (res.code === 0) {
      message.success("修改成功");
      if (type == "mobile") {
        state.isEditMobile = false;
        state.userInfo.mobile = state.mobile;
        state.mobile = "";
      } else if (type == "email") {
        state.isEditEmail = false;
        state.userInfo.email = state.email;
        state.email = "";
      }
      store.dispatch("updateLoginInfo", state.userInfo);
    }
  } catch (error) {
    console.log(error);
  }
};

const unbindWx = () => {
  try {
    showConfirmDialog({
      title: $t('V4_prompt'),
      message: `是否确认解绑微信登录？`,
    })
      .then(async () => {
        const res = await wx_removeOpenid();

        if (res.code != 0) {
          message.error(res.message);
          return false;
        }
        message.success(res.message);

        // showToast({
        //   message: res.message,
        // });
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
  <div class="my">
    <div class="userInfo">
      <div class="useHelp clickBox" @click="onHelp">
        <img class="helpSvg" src="@/assets/my/help.svg" alt="" />
        <p class="helpTxt">{{ $t("user_assistance") }}</p>
        <img class="rightIcon" src="@/assets/my/rightIcon.svg" alt="" />
      </div>
      <div class="info">
        <h1 class="userName">{{ state.userInfo.name }}</h1>
        <div class="status">
          <CheckCircleFilled style="color: #4cc911; font-size: 18px" />
          <span style="margin-left: 6px">{{ state.userInfo?.id }}</span>
        </div>

        <div class="infoItem" style="border-top: 1px solid #f5f5f5">
          <div class="itemLabel">{{ $t("user_telphone") }}</div>
          <div v-if="!state.isEditMobile">
            <span>{{ state.userInfo?.mobile }}</span>
            <img
              class="activeBtn"
              src="@/assets/my/edit.svg"
              @click="state.isEditMobile = true"
              alt=""
            />
          </div>
          <div v-else>
            <div class="itemRight">
              <a-input
                :bordered="false"
                style="text-align: right"
                v-model:value="state.mobile"
                :placeholder="$t('Please_phone_number')"
              />
              <img
                @click="state.isEditMobile = false"
                class="activeBtn"
                src="@/assets/my/activity-record/comments_cancel.svg"
                alt=""
              />
              <img
                @click="onSaveMobile"
                class="activeBtn"
                src="@/assets/my/activity-record/comments_ok.svg"
                alt=""
              />
            </div>
          </div>
        </div>
        <div class="infoItem">
          <div class="itemLabel">{{ $t("user_email") }}</div>
          <div v-if="!state.isEditEmail">
            <span>{{ state.userInfo?.email }}</span>
            <img
              class="activeBtn"
              src="@/assets/my/edit.svg"
              @click="state.isEditEmail = true"
              alt=""
            />
          </div>
          <div v-else>
            <div class="itemRight">
              <a-input
                :bordered="false"
                style="text-align: right"
                v-model:value="state.email"
                :placeholder="$t('Please_Enter_Email')"
              />
              <img
                @click="state.isEditEmail = false"
                class="activeBtn"
                src="@/assets/my/activity-record/comments_cancel.svg"
                alt=""
              />
              <img
                @click="onSaveEmail"
                class="activeBtn"
                src="@/assets/my/activity-record/comments_ok.svg"
                alt=""
              />
            </div>
          </div>
          <!-- <div class="itemRight">
            
          </div> -->
        </div>
        <div class="infoItem">
          <div class="itemLabel">{{ $t("visitor_Student_ID") }}</div>
          <div class="itemRight">{{ state.userInfo?.id }}</div>
        </div>
        <div class="infoItem">
          <div class="itemLabel">{{ $t("dept") }}</div>
          <div class="itemRight">{{ state.userInfo?.deptName }}</div>
        </div>
        <div class="infoItem">
          <div class="itemLabel">{{ $t("status") }}</div>
          <div class="itemRight">{{ userStatusText }}</div>
        </div>
        <div class="infoItem">
          <div class="itemLabel">{{ $t("Card_Validity") }}</div>
          <div class="itemRight">{{ state.userInfo?.date }}</div>
        </div>
        <div v-if="state.userInfo?.open_id" class="infoItem lastItem">
          <div class="itemLabel">微信</div>
          <div class="itemRight">
            <span>z4824614</span>
            <span class="wxBind activeBtn" @click="unbindWx">解绑</span>
          </div>
        </div>

        <div class="actionBot">
          <a-button
            @click="onLogout"
            shape="round"
            block
            style="margin-right: 20px; color: #868686"
            >{{ $t("menu_out") }}</a-button
          >

          <a-button
            type="primary"
            shape="round"
            ghost
            block
            @click="onShowDrawer"
            >{{ $t("user_changepassword") }}</a-button
          >
        </div>
      </div>
    </div>
    <div class="rightCon">
      <div class="rightNavBox">
        <template v-for="item in state.filterRightNavs" :key="item.link">
          <div
            class="clickBox navItem"
            :class="{ activeNav: isRightActiveNav(item.link) }"
            @click="onChangeNav(item)"
          >
            {{ $t(item.label) ? $t(item.label) : item.label }}
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
    :title="$t('user_changepassword')"
    :open="state.isShowDrawer"
    @close="onClose"
    :closable="false"
    :footer="null"
    width="600px"
  >
    <a-form
      :model="formState"
      layout="horizontal"
      :label-col="{ span: 6, offset: 1 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-form-item :label="$t('visitor_Student_ID') + ':'" name="studentId">
        <a-input
          v-model:value="formState.studentId"
          :placeholder="$t('V4_please_enter_your_student_ID')"
        />
      </a-form-item>
      <a-form-item :label="$t('user_name') + ':'" name="name">
        <a-input v-model:value="formState.name" :placeholder="$t('user_inputname')" />
      </a-form-item>
      <a-form-item :label="$t('user_oldpassword') + ':'" name="oldPassword">
        <a-input-password
          v-model:value="formState.oldPassword"
          :placeholder="$t('user_inputoldpassword')"
        />
      </a-form-item>
      <a-form-item :label="$t('user_newpassword') + ':'" name="newPassword">
        <a-input-password
          v-model:value="formState.newPassword"
          :placeholder="$t('V4_please_enter_the_new_password')"
        />
      </a-form-item>
      <a-form-item :label="$t('user_conformpassword') + ':'" name="confirmPassword">
        <a-input-password
          v-model:value="formState.confirmPassword"
          placeholder="请再次输入新密码"
        />
      </a-form-item>
    </a-form>
    <template #extra>
      <a-button class="cancel-button" @click="onHideDrawer">{{ $t("cancel") }}</a-button>
      <a-button type="primary" class="confirm-button" @click="onSubmit"
        >{{ $t("visitor_Confirm") }}</a-button
      >
    </template>
  </a-drawer>
</template>

<style scoped lang="less">
.my {
  width: 100%;
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
      overflow-y: auto;

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
        justify-content: space-between;
        border-color: #f5f5f5;
        font-size: 16px;
        color: #616161;

        .itemLabel {
          width: 100px;
          // flex: 1;
        }

        .itemRight {
          justify-content: flex-end;
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

      .lastItem {
        border-bottom: none;
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
      overflow: hidden;
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
