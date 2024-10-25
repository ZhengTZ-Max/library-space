<script setup>
import { ref, reactive, computed, watch,onMounted } from "vue";
import { useStore } from "vuex";
import { getActivityRecordList } from "@/request/activity-record";

const store = useStore();
const onCheckedForLocation = ref(true);

const state = reactive({
  activeKey: "1",
  currentPage: 1,
  pageSize: 10,
  total: 0,
  data: [],
  isShowDrawer: false,
  selectedRecord: "",
});

const onShowDrawer = (record) => {
  state.isShowDrawer = true;
  state.selectedRecord = record;
};
const onHideDrawer = () => {
  state.isShowDrawer = false;
  state.selectedRecord = "";
};

const images = [
  "https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570",
  "https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570",
  "https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570",
];
const currentIndex = ref(0);
// const currentImage = computed(() => images[currentIndex.value]);

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % images.length;
};

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + images.length) % images.length;
};

const columns = [
  {
    title: "活动海报",
    dataIndex: "image",
    key: "image",
  },
  {
    title: "活动名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "地点",
    dataIndex: "location",
    key: "location",
  },
  {
    title: "时间",
    dataIndex: "time",
    key: "time",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "操作",
    key: "action",
  },
];

const columnsForDraft = [
  {
    title: "活动海报",
    dataIndex: "image",
    key: "image",
  },
  {
    title: "活动名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "上次编辑时间",
    dataIndex: "time_last",
    key: "time_last",
  },
  {
    title: "操作",
    key: "action",
  },
];

const data = [
  {
    key: "1",
    image:
      "https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570",
    name: "xxx学院-xxx活动",
    location: "图书馆-2F-外文特藏阅览室",
    time: "2024-06-01 ~ 2024-06-02",
    status: "等待审核",
    user: "VIP082 (202307082)",
    reservationTime: "2023-11-28 17:42",
    startTime: "2023-11-29 16:00",
    endTime: "2023-11-29 18:00",
    checkInTime: "2023-11-29 15:58",
    time_last: "2023-11-28 17:42",
    introduction: "活动介绍",
  },
  {
    key: "2",
    image:
      "https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570",
    name: "xxx学院-xxx活动",
    location: "图书馆-2F-外文特藏阅览室",
    time: "2024-06-01 ~ 2024-06-02",
    status: "进行中",
    user: "VIP082 (202307082)",
    reservationTime: "2023-11-28 17:42",
    time_last: "2023-11-28 17:42",
    introduction: "活动介绍",
  },
  {
    key: "3",
    image:
      "https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570",
    name: "xxx学院-xxx活动",
    location: "图书馆-2F-外文特藏阅览室",
    time: "2024-06-01 ~ 2024-06-02",
    status: "已结束",
    user: "VIP082 (202307082)",
    reservationTime: "2023-11-28 17:42",
    time_last: "2023-11-28 17:42",
    introduction: "活动介绍",
  },
  {
    key: "4",
    image:
      "https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570",
    name: "xxx学院-xxx活动",
    location: "图书馆-2F-外文特藏阅览室",
    time: "2024-06-01 ~ 2024-06-02",
    status: "报名成功",
    user: "VIP082 (202307082)",
    reservationTime: "2023-11-28 17:42",
    time_last: "2023-11-28 17:42",
    introduction: "活动介绍",
  },
];

const statusClass = computed(() => {
  switch (state.selectedRecord.status) {
    case "进行中":
      return "status-ongoing";
    case "已结束":
      return "status-ended";
    case "等待审核":
      return "status-pending";
    case "报名成功":
      return "status-success";
    default:
      return "status-default";
  }
});

const dates = ["2024-02-19", "2024-02-20", "2024-02-21", "2024-02-22"];
const times = ["08:00~10:00", "10:00~12:00", "13:00~15:00"];

onMounted(() => {
  fetch();
});

const fetch = async () => {
  try { 
    let params = {
      ilk: state.activeKey,
      page: state.currentPage,
      limit: state.pageSize,
    };
    const res = await getActivityRecordList(params);
    if (res?.code === 0) {
      state.data = res?.data?.data || [];
      state.total = res?.data?.total || 0;
    }
  } catch (error) {
    console.log(error);
  }
};

// tab 切换
const onChangeTab = (key) => {
  state.activeKey = key;
  state.currentPage = 1;
  fetch();
  console.log(key);
};

</script>

<template>
  <div class="record">
    <a-tabs
      v-model:activeKey="state.activeKey"
      size="middle"
      @change="onChangeTab"
    >
      <a-tab-pane key="1" tab="申请记录"></a-tab-pane>
      <a-tab-pane key="2" tab="报名记录"></a-tab-pane>
      <a-tab-pane key="3" tab="草稿箱"></a-tab-pane>
    </a-tabs>

    <div class="table" v-if="state.activeKey !== 'draft'">
      <a-table :columns="columns" :data-source="data">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'image'">
            <a-image
              :src="record.image || 'default-poster-url.jpg'"
              :width="100"
              :preview="false"
            />
          </template>
          <template v-if="column.key === 'status'">
            <span>
              <a-tag
                class="custom-tag"
                :color="
                  record.status === '报名成功'
                    ? 'success'
                    : record.status === '进行中'
                    ? 'processing'
                    : record.status === '等待审核'
                    ? 'warning'
                    : 'default'
                "
              >
                {{ record.status }}
              </a-tag>
            </span>
          </template>

          <template v-if="column.key === 'action'">
            <template v-if="record.status === '等待审核'">
              <span>
                <a class="red" type="primary" @click="onShowDrawer(record)"
                  >取消</a
                >
                <a-divider type="vertical" />
                <a type="primary" @click="onShowDrawer(record)">修改</a>
              </span>
            </template>
            <template v-else>
              <span>
                <a type="primary" @click="onShowDrawer(record)">查看</a>
              </span>
            </template>
          </template>
        </template>
      </a-table>
    </div>

    <div class="table" v-if="state.activeKey === 'draft'">
      <a-table :columns="columnsForDraft" :data-source="data">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'image'">
            <a-image
              :src="record.image || 'default-poster-url.jpg'"
              :width="100"
              :preview="false"
            />
          </template>
          <template v-if="column.key === 'action'">
            <span>
              <a type="primary" @click="onShowModal(record)">编辑</a>
            </span>
          </template>
        </template>
      </a-table>
    </div>

    <a-drawer
      :open="state.isShowDrawer"
      @close="onHideDrawer"
      :closable="false"
      :footer="null"
      width="600px"
    >
      <div class="drawer-title">
        <div class="title-text">
          <div class="indicator_title"></div>
          <span class="text">活动详情</span>
        </div>
        <img src="@/assets/close.svg" alt="" />
      </div>
      <a-divider />
      <div class="drawer-content">
        <div
          class="content-top"
          v-if="
            (state.activeKey === 'apply' &&
              state.selectedRecord.status !== '等待审核') ||
            state.activeKey === 'register'
          "
        >
          <Carousel>
            <template v-slot:content>
              <div v-for="i in 3">
                <img
                  class="image"
                  src="https://img0.baidu.com/it/u=695429082,110886343&fm=253&fmt=auto&app=138&f=JPEG?w=1354&h=570"
                  alt=""
                />
              </div>
            </template>
          </Carousel>
          <div class="controls">
            <div
              class="toggleLang"
              :class="{ toggleLangPc: store.state.systemMode == 'pc' }"
            >
              <div class="langItem langActive activeBtn">图片</div>
              <div class="langItem activeBtn">视频</div>
            </div>
            <div class="share-btn">
              <img
                src="@/assets/rectangle_transaction.svg"
                alt=""
                class="background-image"
              />
              <span class="share-text">分享</span>
            </div>
          </div>
        </div>

        <div
          v-if="
            state.activeKey === 'apply' &&
            state.selectedRecord.status !== '等待审核'
          "
        >
          <div class="content-details">
            <div class="info-item status">
              <span class="label">活动状态：</span>
              <span :class="statusClass">{{
                state.selectedRecord.status
              }}</span>
            </div>
            <div class="info-item">
              <span class="label">活动名称：</span>
              <span class="value">XXX学院-校园辩论赛决赛</span>
            </div>
            <div class="info-item">
              <span class="label">活动日期：</span>
              <span class="value">2024-02-19 ~ 2024-02-21</span>
            </div>
            <div class="info-item">
              <span class="label">活动时间：</span>
              <span class="value">08:00-12:00, 13:00-17:00</span>
            </div>
            <div class="info-item">
              <span class="label">可报名人数：</span>
              <span class="value">30</span>
            </div>
            <div class="info-item">
              <span class="label">活动地点：</span>
              <span class="value">嘉德馆-5F-501大型空间</span>
            </div>
            <div class="info_item_description">
              <span class="label_description">活动介绍：</span>
              <div class="value-wrapper">
                <p class="value">
                  这是一段活动介绍，这是一段活动介绍这是一段活动介绍这是一段活动介绍这是一段活动介绍，这是一段活动介绍。
                </p>
              </div>
            </div>
            <div class="attachment-section">
              <div class="label">审批附件：</div>
              <div class="file-item">
                <!-- <img src="@/assets/doc-icon.png" alt="DOC" class="file-icon" /> -->
                <span class="file-name">文件名XXX.docx</span>
              </div>
            </div>
            <div class="attachment-section">
              <div class="label">活动策划案：</div>
              <div class="file-item">
                <!-- <img src="@/assets/pdf-icon.png" alt="PDF" class="file-icon" /> -->
                <span class="file-name">文件名XXX.pdf</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="state.activeKey === 'register'">
          <div class="content-details">
            <div class="info-item status">
              <span class="label">活动状态：</span>
              <span :class="statusClass">{{
                state.selectedRecord.status
              }}</span>
            </div>
            <div class="info-item">
              <span class="label">活动名称：</span>
              <span class="value">XXX学院-校园辩论赛决赛</span>
            </div>
            <div class="schedule-row">
              <span class="label">活动日期：</span>
              <div class="date-options">
                <div
                  v-for="(date, index) in dates"
                  :key="date"
                  :class="['date-option', { selected: index === 0 }]"
                >
                  {{ date }}
                </div>
              </div>
            </div>
            <div class="schedule-row">
              <span class="label">活动时间：</span>
              <div class="time-options">
                <div
                  v-for="(time, index) in times"
                  :key="time"
                  :class="['time-option', { selected: index === 0 }]"
                >
                  {{ time }}
                </div>
              </div>
            </div>
            <div class="info-item">
              <span class="label">可报名人数：</span>
              <span class="value">30</span>
            </div>
            <div class="info-item">
              <span class="label">活动地点：</span>
              <span class="value">嘉德馆-5F-501大型空间</span>
            </div>
            <div class="info_item_description">
              <span class="label_description">活动介绍：</span>
              <div class="value-wrapper">
                <p class="value">
                  这是一段活动介绍，这是一段活动介绍这是一段活动介绍这是一段活动介绍这是一段活动介绍，这是一段活动介绍。
                </p>
              </div>
            </div>
            <div v-if="state.selectedRecord.status === '报名成功'">
              <a-button
                type="primary"
                shape="round"
                size="large"
                @click="onHideDrawer"
                >取消报名</a-button
              >
            </div>
          </div>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<style scoped lang="less">
.record {
  padding-left: 30px;
  position: relative;
}
.custom-tag {
  border-radius: 12px;
}
.table {
  margin-top: 10px;
}
:deep(.ant-table-thead > tr > th) {
  background-color: #f7f9fb;
  color: #4c687b;
}
.red {
  color: red;
}

.drawer-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title-text {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}

.indicator_title {
  width: 4px;
  height: 16px;
  background-color: #1890ff;
  margin-right: 8px;
  border-radius: 10px;
}

.text {
  color: #333; /* 文字颜色，可以根据需要调整 */
}

.content-top {
  position: relative;
  width: 100%;
  max-width: 400px;
  .image {
    width: 400px;
    height: 225px;
  }
}

.controls {
  position: absolute;
  width: 263px;
  bottom: 30px;
  left: 136px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .toggleLang {
    width: 130px;
    height: 28px;
    margin-bottom: 25px;
    padding: 4px;
    background: #333f6c;
    border-radius: 21px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .langItem {
      color: #868686;
      padding: 2px 16px;
      min-width: 60px;
      height: 28px;
    }
    .langActive {
      background: #707794;
      box-shadow: 0px 5px 10px 0px rgba(51, 102, 153, 0.1);
      border-radius: 17px 17px 17px 17px;
      font-weight: bold;
      font-size: 14px;
      color: #fff;
    }
  }
  .share-btn {
    position: relative;
    display: inline-block;
    cursor: pointer;
  }

  .background-image {
    display: block;
    width: 100%;
    height: auto;
  }

  .share-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #ffffff;
    font-size: 14px;
  }
}

.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;

  .nav-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
  }

  .indicators {
    display: flex;
    gap: 8px;
    margin: 0 16px;
  }

  .indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #ccc;
  }

  .indicator.active {
    background-color: #007bff;
  }
}
.content-details {
  padding-top: 40px;
  color: black;
  .status-ongoing {
    color: #1890ff;
  }
  .status-ended {
    color: #d9d9d9;
  }
  .status-pending {
    color: #faad14;
  }
  .status-success {
    color: #52c41a;
  }
  .status-default {
    color: #000000;
  }
  .info-item {
    margin-bottom: 20px;
    line-height: 1.5;
  }

  .label {
    font-weight: bold;
    color: #333;
    margin-right: 10px;
  }

  .info_item_description {
    display: flex;
    margin-bottom: 15px;
  }

  .label_description {
    flex-shrink: 0;
    font-weight: bold;
    color: #333;

    width: 70px; /* 调整标签的宽度 */
  }

  .value-wrapper {
    flex: 1;
  }

  .value {
    color: #666;
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
    line-height: 1.5;
  }

  .highlight {
    color: #1890ff;
  }

  .description {
    white-space: pre-wrap;
    display: flex;
    flex-direction: row;
  }

  .attachment-section {
    margin-top: 20px;
  }

  .file-item {
    display: flex;
    align-items: center;
    margin-top: 10px;
  }

  .file-icon {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }

  .file-name {
    color: #1890ff;
    text-decoration: underline;
    cursor: pointer;
  }

  .schedule-row {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }

  .label {
    flex-shrink: 0;
    width: 80px;
    font-weight: bold;
    color: #333;
  }

  .date-options,
  .time-options {
    display: flex;
    gap: 10px;
  }

  .date-option,
  .time-option {
    padding: 8px 16px;
    border: 1px solid #d9d9d9;
    background-color: #f5f5f5;
    color: #333;
    border-radius: 4px;
  }

  .date-option.selected,
  .time-option.selected {
    background-color: #e6f7ff;
    border-color: #91d5ff;
    color: #1890ff;
  }
}
</style>
