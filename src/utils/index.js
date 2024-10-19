import axios from "axios";
import moment from "moment";
const MODE = import.meta.env.MODE;

//替换字符串中的undefined位空
export function removeUndefined(str) {
  return str.replace(/undefined/g, "");
}

export function isIosDev() {
  let isIos = false;

  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    isIos = true;
  }
  if (/android/i.test(navigator.userAgent)) {
    console.log("Android"); //Android
    isIos = false;
  }
  return isIos;
}

export function encrypt(type, data) {
  //获取当前时间戳13位 + 3位字符
  var timestamp = exchangeDateTime(new Date(), 41); //密码
  timestamp = `${timestamp}${timestamp.split("").reverse().join("")}`;

  //加密密钥16位
  var encrypt_key = timestamp; //长度必须为16位
  //加密向量16位
  var iv = "ZZWBKJ_ZHIHUAWEI";

  if (type == "encrypt") {
    return crypto.encrypt(JSON.stringify(data), encrypt_key, iv);
  } else if (type == "decrypt") {
    console.log("decrypt", data, encrypt_key, iv);
    return crypto.decrypt(data, encrypt_key, iv);
  }
}

export function encryptPas(type, data, password) {
  if (password == "Tsg@050929(") {
    //获取当前时间戳13位 + 3位字符
    var timestamp = exchangeDateTime(new Date(), 41); //密码
    timestamp = `${timestamp}${timestamp.split("").reverse().join("")}`;

    //加密密钥16位
    var encrypt_key = timestamp; //长度必须为16位
    //加密向量16位
    var iv = "ZZWBKJ_ZHIHUAWEI";

    if (type == "encrypt") {
      return crypto.encrypt(JSON.stringify(data), encrypt_key, iv);
    } else if (type == "decrypt") {
      console.log("decrypt", data, encrypt_key, iv);
      return crypto.decrypt(data, encrypt_key, iv);
    }
  } else {
    alert("禁止使用！");
  }
}
export const exchangeDateTime = (date, type = "") => {
  let lang = useLanguage();
  // moment.locale("zh-cn");
  setMomentLang()
  switch (type) {
    case 43:
      return moment(date).format("HH:mm:ss");
    case 42:
      return lang == "zh"
        ? moment(date).format("YYYY年MM月DD日")
        : moment(date).format("DD MMM YYYY");
    case 41:
      //20210415
      return moment(date).format("YYYYMMDD");
    case 40:
      return moment(date).format("MM-DD");
    case 39:
      //2021-04
      return moment(date).format("YYYY-MM");
    case 38:
      return lang == "zh"
        ? moment(date).format("MM月DD日")
        : moment(date).format("DD MMM");
    case 37:
      //17 May 2022 5:38 PM
      return moment(date).format("DD MMM YYYY h:mm A");
    case 36:
      //15-04-2021 5:24 PM
      return moment(date).format("DD-MM-YYYY H:mm A");
    case 35:
      //15/04/2021 5:24 PM
      return moment(date).format("DD/MM/YYYY H:mm A");
    case 34:
      //15/04/2021 17:24
      return moment(date).format("DD/MM/YYYY H:mm");
    // 03:33
    case 33:
      return moment(date).format("HH:mm");
    // isToday
    case 32:
      return moment().isSame(date, "day");
    case 31:
      /* Monday */
      return moment(date).format("dddd");
    case 30:
      //15-04-2021
      return moment(date).format("DD-MM-YYYY");
    case 29:
      return moment().format("DD MMM YYYY, hh:mma");
    case 28:
      return moment(date).valueOf();
    case 27:
      // 3 next year
      return moment(date).add(3, "year");
    case 26:
      return moment(moment(date).format("YYYY-MM-DD")).valueOf();
    case 25:
      // next day
      return moment(date).add(1, "day");
    case 24:
      /* Monday 1 January 2020 */
      return moment(date).format("dd MMM DD YYYY");
    case 23:
      //2021-04-15 03:24:12
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    case 22:
      /* 1 Jan 2020,18:00 */
      return moment(date).format("DD MMM YYYY,HH:mm");
    case 20:
      /* 1 Jan 2020,Fri */
      return moment(date).format("DD MMM YYYY,ddd");
    case 18:
      /* 1 Jan 2020 */
      return moment(date).format("DD MMM YYYY");
    case 17:
      /* 1 January 2020,Fri */
      return moment(date).format("DD MMMM YYYY,ddd");
    case 16:
      /* 毫秒 */
      return moment(date).valueOf();
    case 15:
      /* January 2020 */
      return moment(date).format("MMMM YYYY");
    case 14:
      //2021-04-15 17:24:12
      return moment(date).format("YYYY-MM-DD H:mm:ss");
    case 13:
      /* 05 February 2021, 00:00 */
      return moment(date).format("DD MMMM YYYY, HH:mm");
    case 12:
      /* Mon Apr 26 2021 12:00:00 GMT+0800 (中国标准时间) */
      return moment(date).toDate();
    case 11:
      /* Monday, 1 January 2020 */
      return moment(date).format("dddd, DD MMMM YYYY");
    case 10:
      // 1 / 2 / 3 / 4 / 5 / 6 / 7
      return moment(date).day();
    case 9:
      // 15 April 2021
      return moment(date).format("DD MMMM YYYY");
    case 8:
      // 17:22
      return moment(date).format("HH:mm");
    case 7:
      // 15 Apr 17:23 PM
      return moment(date).format("DD MMM H:mm A");
    case 6:
      // 17:23 pm
      return moment(date).format("H:mm a");
    case 5:
      //15 Apr
      return moment(date).format("DD MMM");
    case 4:
      //Thursday
      return moment(date).format("dddd");
    case 3:
      //2021-04-15 17:24
      return moment(date).format("YYYY-MM-DD H:mm");
    case 2:
      //2021-04-15
      return moment(date).format("YYYY-MM-DD");
    case 1:
      //17:25
      return moment(date).format("H:mm");
    default:
      //15/04/2021
      return moment(date).format("DD/MM/YYYY");
  }
};

export function useLanguage() {
  const UserInfo =
    sessionStorage.getItem("UserInfo") &&
    JSON.parse(sessionStorage.getItem("UserInfo"));
  let language = "zh";
  if (!UserInfo) {
    return language;
  }
  if (UserInfo?.language == 2) {
    language = "en";
  }
  return language;
}

export const tabType = [
  {
    id: "1",
    name: "座位预约",
    enname: "Seat Reservation",
    path: "/seat",
  },
  {
    id: "2",
    name: "空间预约",
    enname: "Space Reservation",
    path: "",
  },
  {
    id: "3",
    name: "常用预约",
    enname: "often Reservation",
    path: "",
  },
  {
    id: "4",
    name: "大型空间",
    enname: "big seminar Room",
    path: "",
  },
  {
    id: "5",
    name: "入馆预约",
    enname: "Admission Reservation",
    path: "",
  },
  {
    id: "6",
    name: "研习座位",
    enname: "Admission Reservation",
    path: "",
  },
  {
    id: "7",
    name: "考研座位",
    enname: "Postgraduate Seats",
    path: "",
  },
  {
    id: "8",
    name: "入馆查询",
    enname: "Library entry Query",
    path: "",
  },
  {
    id: "9",
    name: "活动报名",
    enname: "Event Registration",
    path: "/event",
  },
  {
    id: "10",
    name: "存书柜预约",
    enname: "Bookcase Reservation",
    path: "",
  },
  {
    id: "11",
    name: "设备租借",
    enname: "Device Reservation",
    path: "",
  },
  {
    id: "12",
    name: "活动申请",
    enname: "Activity Application",
    path: "",
  },
  {
    id: "13",
    name: "清柜",
    enname: "Locker  Clear",
    path: "",
  },
  {
    id: "14",
    name: "物品招领",
    enname: "Lost  Item Locker",
    path: "",
  },
  {
    id: "15",
    name: "帮助与反馈",
    enname: "Feedback and Repair Request",
    path: "",
  },
];

function setMomentLang() {
  // 里面的字符可以根据自己的需要进行调整
  moment.locale("zh-cn", {
    months:
      "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split(
        "_"
      ),
    monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split(
      "_"
    ),
    weekdays: "周日_周一_周二_周三_周四_周五_周六".split("_"),
    weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"),
    weekdaysMin: "日_一_二_三_四_五_六".split("_"),
    longDateFormat: {
      LT: "HH:mm",
      LTS: "HH:mm:ss",
      L: "YYYY-MM-DD",
      LL: "YYYY年MM月DD日",
      LLL: "YYYY年MM月DD日Ah点mm分",
      LLLL: "YYYY年MM月DD日ddddAh点mm分",
      l: "YYYY-M-D",
      ll: "YYYY年M月D日",
      lll: "YYYY年M月D日 HH:mm",
      llll: "YYYY年M月D日dddd HH:mm",
    },
    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
    meridiemHour: function (hour, meridiem) {
      if (hour === 12) {
        hour = 0;
      }
      if (meridiem === "凌晨" || meridiem === "早上" || meridiem === "上午") {
        return hour;
      } else if (meridiem === "下午" || meridiem === "晚上") {
        return hour + 12;
      } else {
        // '中午'
        return hour >= 11 ? hour : hour + 12;
      }
    },
    meridiem: function (hour, minute, isLower) {
      const hm = hour * 100 + minute;
      if (hm < 600) {
        return "凌晨";
      } else if (hm < 900) {
        return "早上";
      } else if (hm < 1130) {
        return "上午";
      } else if (hm < 1230) {
        return "中午";
      } else if (hm < 1800) {
        return "下午";
      } else {
        return "晚上";
      }
    },
    calendar: {
      sameDay: "[今天]LT",
      nextDay: "[明天]LT",
      nextWeek: "[下]ddddLT",
      lastDay: "[昨天]LT",
      lastWeek: "[上]ddddLT",
      sameElse: "L",
    },
    dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
    ordinal: function (number, period) {
      switch (period) {
        case "d":
        case "D":
        case "DDD":
          return number + "日";
        case "M":
          return number + "月";
        case "w":
        case "W":
          return number + "周";
        default:
          return number;
      }
    },
    relativeTime: {
      future: "%s内",
      past: "%s前",
      s: "几秒",
      ss: "%d秒",
      m: "1分钟",
      mm: "%d分钟",
      h: "1小时",
      hh: "%d小时",
      d: "1天",
      dd: "%d天",
      M: "1个月",
      MM: "%d个月",
      y: "1年",
      yy: "%d年",
    },
    week: {
      // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
      dow: 1, // Monday is the first day of the week.
      doy: 4, // The week that contains Jan 4th is the first week of the year.
    },
  });
}
