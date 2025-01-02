<route>
  {
    meta: {
      showHead: false,
      showLeftBack:false,
      title:'menu_home',
      showTabbar:true
    }
  }
  </route>
<script setup>
import { reactive, onMounted, watch, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import moment from "moment";
import { DownOutlined } from "@ant-design/icons-vue";
import { showToast } from "vant";

import { exchangeDateTime } from "@/utils";

import {
  getLostStorage,
  getLostlocker,
  getLostInfo,
  sumbitLostStorage,
} from "@/request/collection";
import CollectionFilterCom from "@/components/CollectionCom/CollectionFilterCom.vue";
import Uploader from "@/components/Uploader.vue";
import ClearList from "@/components/CollectionCom/ClearList.vue";

const store = useStore();
const router = useRouter();
const route = useRoute();
const containerRef = ref();
const clearListRef = ref();

const state = reactive({
  quickMode: "1",
  quickModeList: [
    { value: "1", label: "物品招领" },
    { value: "2", label: "物品收取" },
    { value: "3", label: "清柜" },
  ],

  refresh: false,
  activeRow: {},

  lostlockerList: [],

  filterOptions: [],
  filterSearch: {
    date: "",
    library: "",
    floor: "",
    areaId: "",
  },

  searchDate: "",

  collectionFilterShow: false,
  collectionFilterDateShow: false,
  collectionInfoShow: false,

  showAreaSelect: false,
  filterClearOptions: [],
  areaSelectRow: {
    showType: "",
    library: "",
    floor: "",
    areaId: "",
  },
  areaForm: {
    deposit: {},
    collect: {},
  },
  depositFreeList: [],

  showClearRightCon: false,

  clearSelected: [],

  clearSelectedAll: false,
});

onMounted(() => {
  fetchFilter();
});

const onChangeAct = (i) => {
  state.activeRow = i;
  state.collectionInfoShow = true;
};

const fetchFilter = async () => {
  try {
    let res = await getLostStorage();
    state.filterOptions = res?.data?.storageList || [];
    state.filterClearOptions = res?.data?.storeList || [];
    state.depositFreeList = res?.data?.freeNum || [];

    fetchLibrary();
  } catch (e) {
    console.log(e);
  }
};

const fetchLibrary = async () => {
  try {
    let { date, areaId } = state.filterSearch;
    let params = {
      start: date && exchangeDateTime(date, 2),
      areaId,
      page: 1,
      size: 20,
    };

    let res = await getLostlocker(params);
    state.refresh = false;
    if (res.code != 0) {
      return false;
    }

    state.lostlockerList = res?.data?.list || [];
    state.searchDate = res?.data?.minDate && new Date(res?.data?.minDate);
    // getFloorArea();
  } catch (e) {
    console.log(e);
  }
};

const handleFilter = () => {
  let { library, floor, areaId } = state.filterSearch;
  let areaRows = findDataRows(state.filterOptions, { library, floor, areaId });
  let { library: libraryRow, floor: floorRow, areaId: areaRow } = areaRows;
  state.filterSearch.areaName = `${libraryRow?.name}-${floorRow?.name}-${areaRow?.name}`;

  fetchLibrary();
  state.collectionFilterShow = false;
};
const handleAreaSelect = () => {
  console.log(state.areaSelectRow);
  let { library, floor, areaId, showType } = state.areaSelectRow;

  let areaRows = findDataRows(
    showType == "deposit" ? state.filterClearOptions : state.filterOptions,
    { library, floor, areaId }
  );
  let { library: libraryRow, floor: floorRow, areaId: areaRow } = areaRows;

  state.areaForm[showType] = {
    library,
    floor,
    areaId,
    name: `${libraryRow?.name}-${floorRow?.name}-${areaRow?.name}`,
  };
  console.log(state.areaForm);
  state.showAreaSelect = false;
};

const onShowArea = (t) => {
  let { library, floor, areaId } = state.areaForm[t];
  console.log(state.areaForm[t]);
  state.areaSelectRow = {
    showType: t,
    library: library || "",
    floor: floor || "",
    areaId: areaId || "",
  };
  state.showAreaSelect = true;
};

const findDataRows = (data, ids) => {
  const result = {};
  let currentLevel = data;

  // 遍历每一层的 ID
  for (const [key, id] of Object.entries(ids)) {
    const found = currentLevel.find((item) => item.id === id);
    if (found) {
      result[key] = { id: found.id, name: found.name, enname: found.enname };
      currentLevel = found.child || []; // 进入下一层
    } else {
      break; // 如果某层未找到，停止查找
    }
  }

  return result;
};

const areaBoxFreeNum = () => {
  let { areaId } = state.areaForm?.deposit;
  let findRow = state.depositFreeList?.find((e) => e?.id == areaId);
  return findRow?.num || "";
};

const onSubmit = async () => {
  try {
    let params = {
      filePath: state.areaUploadImg,
      storageArea: state.areaForm?.deposit?.areaId,
      storeArea: state.areaForm?.collect?.areaId,
    };

    const res = await sumbitLostStorage(params);
    if (res.code != 0) {
      showToast({
        duration: 3000,
        message: res?.message || res?.msg,
      });
      return false;
    }
    showToast({
      message: res?.message || res?.msg,
    });

    state.areaSelectRow = {
      showType: "",
      library: "",
      floor: "",
      areaId: "",
    };
    state.areaForm = {
      deposit: {},
      collect: {},
    };
  } catch (e) {
    console.log(e);
  }
};

const fileUpload = (v) => {
  let fileList = v;
  if (fileList?.length) {
    state.areaUploadImg = fileList[0]?.response?.data?.file_path;
  } else {
    state.areaUploadImg = "";
  }
};

const onClearList = () => {
  clearListRef?.value?.onClearList();
};

const onClearSelected = () => {
  let list = clearListRef?.value?.getClearList();
  if (!list?.length) {
    return false;
  }
  state.clearSelectedAll = !state.clearSelectedAll;

  if (state.clearSelectedAll) {
    state.clearSelected = list?.map((e) => e?.id);
  } else {
    state.clearSelected = [];
  }
};

const onSelectedDate = (v) => {
  state.filterSearch.date = v;
  fetchLibrary();
  state.collectionFilterDateShow = false;
};
const onRefresh = () => {
  fetchLibrary();
};
</script>
<template>
  <div class="bookcase" ref="containerRef">
    <div class="cHeader">
      <div class="quickMode">
        <div
          v-for="item in state.quickModeList"
          :key="item.label"
          class="item activeBtn"
          :class="{ itemActive: item?.value == state.quickMode }"
          @click="state.quickMode = item?.value"
        >
          {{ item?.label }}
        </div>
      </div>
    </div>

    <div v-if="state.quickMode == 1" class="librarySlt">
      <div class="librarySearch">
        <div class="selector" @click="state.collectionFilterDateShow = true">
          <span v-if="state.filterSearch?.date" style="color: #202020">{{
            exchangeDateTime(state.filterSearch?.date, 2)
          }}</span>
          <span v-else>收物日期</span>

          <DownOutlined />
        </div>
        <div class="selector" @click="state.collectionFilterShow = true">
          <span
            class="ellipsis-1"
            v-if="state.filterSearch.areaName"
            style="color: #202020"
            >{{ state.filterSearch.areaName }}</span
          >
          <span v-else>收物地点</span>
          <DownOutlined />
        </div>
      </div>
      <div class="flexCon">
        <van-pull-refresh v-model="state.refresh" @refresh="onRefresh">
          <a-row
            v-if="state.lostlockerList?.length"
            style="padding: 0 12px; margin-top: 12px"
            :gutter="[0, 12]"
          >
            <template v-for="item in state.lostlockerList" :key="item?.id">
              <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                <div class="libraryItem cardItem" @click="onChangeAct(item)">
                  <div class="cardItemImgCon">
                    <a-image
                      @click.stop=""
                      class="cardItemImg"
                      :src="item?.thumb_imageUrl"
                    >
                    </a-image>
                    <div class="leftBadge basicsBadge">
                      {{ item?.lockerPremises }}
                    </div>
                  </div>
                  <div class="bottomItem">
                    <div class="title">
                      <span>{{ item?.name }}号柜：{{ item?.boxId }}格</span>
                      <span>{{ item?.lockerFloor }}</span>
                    </div>
                    <div class="details">
                      <span>{{ $t("V4_collection_date") }}</span>
                      {{ item?.insertDate }}
                    </div>
                    <div class="details">
                      <span>{{ $t("V4_collection_location") }}</span>
                      {{ item?.storageName }}
                    </div>
                  </div>
                  <!-- <div
                v-if="item?.id == state.activeIndex"
                class="action clickBoxT"
                @click="handleAppt(item)"
              >
                立即预约
              </div> -->
                </div>
              </a-col>
            </template>
          </a-row>
          <a-empty v-else style="padding-top: 12%" />
        </van-pull-refresh>
      </div>
    </div>

    <div v-if="state.quickMode == 2" class="collectionCon">
      <div class="selectorCon">
        <div class="selectorItem" @click="onShowArea('collect')">
          <div>收物地点</div>
          <div class="selector">
            <span v-if="state.areaForm?.collect?.name" style="color: #202020">{{
              state.areaForm?.collect?.name
            }}</span>
            <span v-else>请选择</span>
            <DownOutlined />
          </div>
        </div>
        <div class="selectorItem" @click="onShowArea('deposit')">
          <div>存放区域</div>
          <div class="selector">
            <span v-if="state.areaForm?.deposit?.name" style="color: #202020">{{
              state.areaForm?.deposit?.name
            }}</span>
            <span v-else>请选择</span>
            <DownOutlined />
          </div>
        </div>
        <div v-if="areaBoxFreeNum()" class="selectorItem">
          <div>剩余格口</div>
          <div class="selector">
            <span style="color: #202020">{{ areaBoxFreeNum() }}</span>
          </div>
        </div>
        <div class="selectorItem uploader">
          <div>上传图片</div>
          <div style="margin-top: 8px">
            <Uploader
              @onFileUpload="fileUpload"
              filePath="activity"
              :showUploadList="true"
              :maxCount="1"
              accept=".png, .jpg, .jpeg"
              list-type="picture-card"
            >
              <img src="@/assets/feedback_uploadimg.svg" alt="" />
            </Uploader>
          </div>
        </div>
      </div>

      <div class="bottomAct">
        <!-- <van-button
            round
            block
            type="default"
            @click="state.showAreaSelect = false"
          >
            {{ $t("cancel") }}
          </van-button> -->
        <van-button
          round
          block
          type="primary"
          @click="onSubmit"
          :disabled="
            !(state.areaForm?.deposit?.name && state.areaForm?.collect?.name) ||
            !state.areaUploadImg
          "
          >{{ $t("visitor_Confirm") }}</van-button
        >
      </div>
    </div>

    <div v-if="state.quickMode == 3" class="clearCon">
      <div class="clearList">
        <ClearList
          ref="clearListRef"
          v-model:clearSelected="state.clearSelected"
          v-model:selectedAll="state.clearSelectedAll"
        />
      </div>

      <div class="bottomAct">
        <div class="toggleAll" @click="onClearSelected">
          <img
            v-if="!state.clearSelectedAll"
            src="@/assets/collection/radioSlt.svg"
            alt=""
          />
          <img v-else src="@/assets/collection/radioSlted.svg" alt="" />
          全选
        </div>
        <!-- <van-button
            round
            block
            type="default"
            @click="state.showAreaSelect = false"
          >
            {{ $t("cancel") }}
          </van-button> -->
        <van-button
          round
          block
          type="primary"
          @click="onClearList"
          :disabled="!state.clearSelected?.length"
          >立即清柜</van-button
        >
      </div>
    </div>

    <van-popup
      v-model:show="state.collectionFilterShow"
      position="bottom"
      :style="{ height: '70%' }"
      destroy-on-close
    >
      <div class="drawerCon">
        <CollectionFilterCom
          v-if="state.filterOptions?.length"
          :data="state.filterOptions"
          :initSearch="state.filterSearch"
          type="area"
        />
        <div class="bottomAct">
          <van-button
            round
            block
            type="default"
            @click="state.collectionFilterShow = false"
          >
            {{ $t("cancel") }}
          </van-button>
          <van-button round block type="primary" @click="handleFilter">{{
            $t("visitor_Confirm")
          }}</van-button>
        </div>
      </div>
    </van-popup>

    <van-popup
      v-model:show="state.showAreaSelect"
      position="bottom"
      :style="{ height: '70%' }"
      destroy-on-close
    >
      <div class="drawerCon">
        <template v-if="state.showAreaSelect">
          <CollectionFilterCom
            v-if="
              state.areaSelectRow?.showType == 'collect' &&
              state.filterOptions?.length
            "
            :data="state.filterOptions"
            :initSearch="state.areaSelectRow"
            type="area"
          />
          <CollectionFilterCom
            v-else-if="
              state.areaSelectRow?.showType == 'deposit' &&
              state.filterClearOptions?.length
            "
            :data="state.filterClearOptions"
            :initSearch="state.areaSelectRow"
            type="area"
          />
        </template>
        <div class="bottomAct">
          <van-button
            round
            block
            type="default"
            @click="state.showAreaSelect = false"
          >
            {{ $t("cancel") }}
          </van-button>
          <van-button round block type="primary" @click="handleAreaSelect">{{
            $t("visitor_Confirm")
          }}</van-button>
        </div>
      </div>
    </van-popup>

    <a-modal
      width="50%"
      v-model:open="state.collectionInfoShow"
      title="扫码取物"
      okText=""
      :cancelText="$t('cancel')"
      :cancelButtonProps="{
        size: 'middle',
        style: {
          color: '#8C8F9E',
          background: '#F3F4F7',
          borderColor: '#CECFD5',
        },
      }"
      :okButtonProps="{
        size: 'middle',
        style: {
          display: 'none',
        },
      }"
      centered
    >
      <div class="qrInfo libraryItem">
        <div class="cardItemImgCon">
          <a-image class="cardItemImg" :src="state.activeRow?.imageUrl">
          </a-image>
          <!-- <div class="leftBadge basicsBadge">14213</div> -->
        </div>
        <div class="bottomItem">
          <div class="title">
            <span
              >{{ state.activeRow?.lockerName }}：{{
                state.activeRow?.boxId
              }}格</span
            >
          </div>
          <div class="details">
            <span>{{ $t("V4_collection_date") }}</span>
            {{ state.activeRow?.insertDate }}
          </div>
          <div class="details">
            <span>{{ $t("V4_collection_location") }}</span>
            {{ state.activeRow?.storageName }}
          </div>
        </div>
      </div>
    </a-modal>

    <a-drawer
      title="清柜"
      :width="960"
      :open="state.showClearRightCon"
      :body-style="{ paddingBottom: '80px' }"
      :footer-style="{ textAlign: 'right' }"
      @close="state.showClearRightCon = false"
      class="collectionClearDrawer"
    >
      <ClearList
        v-if="state.showClearRightCon"
        ref="clearListRef"
        v-model:clearSelected="state.clearSelected"
      />
      <template #extra>
        <a-space>
          <a-button size="m" @click="state.showClearRightCon = false"
            >Cancel</a-button
          >
          <a-button
            size="m"
            type="primary"
            :disabled="!state.clearSelected?.length"
            @click="onClearList"
            >立即清柜</a-button
          >
        </a-space>
      </template>
    </a-drawer>
  </div>
  <van-calendar
    switch-mode="month"
    v-model:show="state.collectionFilterDateShow"
    :min-date="state.searchDate"
    @confirm="onSelectedDate"
  />
</template>
<style lang="less" scoped>
.bookcase {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #fafafa;
  .cHeader {
    padding: 10px 14px 0 10px;
    border-bottom: 1px solid #f5f5f5;
    background-color: #ffffff;
  }
  .quickMode {
    display: flex;
    .item {
      padding-bottom: 10px;
      font-size: 15px;
      color: #616161;
      &:nth-child(2) {
        margin: 0 40px;
      }
      &.itemActive {
        color: #202020;
        border-bottom: 2px solid #1a49c0;
      }
    }
  }
  .header {
    padding: 20px 30px;
    color: #202020;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    .leftTit {
      font-size: 18px;
      img {
        width: 22px;
        height: 22px;
      }
      button {
        width: 160px;
      }
      .clearBtn {
        margin-left: 20px;
        background: rgba(26, 73, 192, 0.07);
        border: 1px solid rgba(26, 73, 192, 0.14);
        font-size: 14px;
        color: #1a49c0;
        img {
          width: 12px;
          height: 12px;
          margin-right: 4px;
          transform: translateY(-2px);
        }
      }
    }
    .rightAction {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      .quickDate {
        flex: 1;
        display: flex;
        justify-content: center;
      }
      .filters {
        margin-left: 20px;
        padding: 8px 16px;
        background: rgba(26, 73, 192, 0.07);
        border-radius: 18px 18px 18px 18px;
        border: 1px solid rgba(26, 73, 192, 0.14);
        font-size: 14px;
        color: #1a49c0;
        img {
          width: 14px;
          height: 14px;
          margin-right: 4px;
        }
      }
    }
  }

  .librarySlt {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
    .flexCon {
      flex: 1;
      width: 100%;
      overflow: hidden;
    }
    .van-pull-refresh {
      overflow: auto;
      height: 100%;
    }
    .libraryItem {
      position: relative;
      box-sizing: initial;
      display: flex;
      margin-bottom: 12px;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.03);
      border: none;
      .cardItemImgCon {
        margin-right: 14px;
        .cardItemImg {
          height: 100%;
        }
        :deep(.ant-image) {
          width: 96px;
          height: 96px;
        }
      }
    }
    .basicsBadge {
      padding: 3px 8px;
      background: #1a49c0;
      border-radius: 6px 0px 6px 0px;
      font-size: 12px;
      color: #ffffff;
    }
    .viewMore {
      display: flex;
      align-items: center;
      padding: 7px 10px 7px 22px;
      background: linear-gradient(
        254deg,
        #122f7a 0%,
        rgba(18, 47, 122, 0.3) 74%,
        rgba(18, 47, 122, 0) 100%
      );
      border-radius: 0px 6px 0px 6px;
      font-size: 14px;
      color: #ffffff;
      img {
        margin-left: 2px;
        width: 10px;
        height: 12px;
      }
    }
    .posBot {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 16px;
    }
    .bottomItem {
      padding: 10px 4px 10px 4px;

      .title {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        color: #616161;
        span {
          &:nth-child(1) {
            font-size: 16px;
            color: #202020;
          }
        }
      }

      .details {
        font-size: 14px;
        color: #202020;
        margin-top: 12px;
        span {
          color: #616161;
        }
      }
    }
    .action {
      position: absolute;
      left: -2px;
      width: calc(100% + 4px);
      transform: translateY(10%);
      padding: 9px 0;
      cursor: pointer;
      color: #fff;
      font-size: 14px;
      background: #1a49c0;
      border-radius: 0px 0px 10px 10px;
      text-align: center;
      box-sizing: initial;
      z-index: 1;
    }
  }

  .quickFloor {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 180px;
    background: linear-gradient(135deg, #f0f2f7 0%, #ffffff 100%);
    border-radius: 20px;
    box-shadow: 8px 10px 14px #e7ecf7;

    &:hover {
      background: rgba(0, 0, 0, 0.08);
    }

    .floorNum {
      font-weight: 400;
      font-size: 36px;
      color: #1a49c0;
      transform: skewX(-12deg);
    }
    .floorTotal {
      font-size: 18px;
      color: #616161;
      span {
        &:nth-child(1) {
          color: #f28800;
        }
      }
    }
  }

  .collectionCon {
    flex: 1;
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    .selectorCon {
      flex: 1;
    }
    .selectorItem {
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border: 1px solid #f5f5f5;
      font-size: 14px;
      color: #616161;
      &.uploader {
        flex-direction: column;
        align-items: flex-start;
      }
    }
    .selector {
      padding: 4px 11px;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      color: rgba(0, 0, 0, 0.25);

      font-size: 14px;
      span {
        &.anticon {
          transform: rotate(-90deg);
          margin-left: 4px;
        }
      }
      &:hover {
        border-color: var(--primary-color);
      }
    }
  }
  .clearCon {
    flex: 1;
    display: flex;
    flex-direction: column;
    .clearList {
      flex: 1;
    }
  }

  .librarySearch {
    padding: 10px 14px;
    width: 100%;
    display: flex;
    align-items: center;
    background-color: #fff;
    .selector {
      flex: 1;
      border: 1px solid #d9d9d9;
      padding: 4px 11px;
      border-radius: 20px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      margin-right: 12px;
      font-size: 14px;
      color: rgba(32, 32, 32, 0.3);
      &:last-child {
        margin-right: 0;
      }
      span {
        color: rgba(0, 0, 0, 0.25);
      }
      &:hover {
        border-color: var(--primary-color);
      }
    }
  }
}

.filterCon {
  padding: 24px 0;
  height: 100%;
  overflow: auto;
  .filterFilter {
    margin-bottom: 24px;
    background: rgba(97, 97, 97, 0.05);
    border-radius: 0px 0px 0px 0px;
    padding: 2px 10px;
  }
  .fiterItem {
    user-select: none;
    padding: 0 20px;
    margin-bottom: 40px;
    .ant-checkbox-group,
    .ant-radio-group {
      width: 100%;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  .ant-input,
  .ant-input-affix-wrapper {
    border-radius: 40px;
  }

  .ant-checkbox-group {
    column-gap: 36px;
    row-gap: 20px;
  }

  .ant-radio-group {
    display: inline-flex;
    column-gap: 36px;
    row-gap: 20px;
  }
}
.qrInfo {
  margin: 40px;
  display: flex;
  align-items: center;
  .cardItemImgCon {
    width: 220px;
    margin-right: 80px;
  }
  .bottomItem {
    padding: 10px 4px 10px 4px;

    .title {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      color: #616161;
      span {
        &:nth-child(1) {
          font-size: 16px;
          color: #202020;
        }
      }
    }

    .details {
      font-size: 14px;
      color: #202020;
      margin-top: 12px;
      span {
        color: #616161;
      }
    }
  }
}
.collectionDrawer {
  .selector {
    border: 1px solid #d9d9d9;
    padding: 4px 11px;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    color: #d9d9d9;

    span {
      color: rgba(0, 0, 0, 0.25);
    }
    &:hover {
      border-color: var(--primary-color);
    }
  }
}
.drawerCon {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.bottomAct {
  background-color: #fff;
  padding: 12px 12px 28px 12px;
  display: flex;
  justify-content: space-between;
  & button {
    &:nth-child(1) {
      margin-right: 12px;
    }
  }

  .toggleAll {
    min-width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: #616161;
    img {
      margin-right: 6px;
    }
  }
}
</style>
