<template>
  <div>
    <div class="yuki-count-down">{{ mainText }}</div>
    <div class="yuki-count-down">{{ getHolidayInfo() }}</div>

    <a-button type="primary" class="db mt10" @click="showDiv = !showDiv"
      >点击显示/隐藏</a-button
    >
    <div v-show="showDiv">
      <div v-for="index in 2">
        <h1>请编辑你的{{ dataMap[index].title }}</h1>
        <a-button type="primary" @click="addItem(dataMap[index].list)"
          >新增</a-button
        >
        <a-table
          class="mt20"
          :dataSource="dataMap[index].list"
          :columns="columns"
          :pagination="false"
        >
          <template #bodyCell="{ record, column }">
            <template v-if="column.key === 'operation'">
              <a-button
                v-show="isEdit && record.isEdit"
                type="text"
                primary
                @Click="saveRow(record)"
                >保存</a-button
              >
              <a-button
                type="text"
                danger
                @Click="deleteRow(dataMap[index].list, record)"
                >删除</a-button
              >
            </template>
            <template v-if="column.dataIndex === 'date' && isEdit">
              <div>
                <a-date-picker
                  v-model:value="record.date"
                  placeholder="请选择日期"
                  valueFormat="YYYY-MM-DD"
                />
              </div>
            </template>
            <template v-if="column.dataIndex === 'title' && isEdit">
              <div>
                <a-input
                  v-model:value="record.title"
                  placeholder="请输入事件"
                ></a-input>
              </div>
            </template>
          </template>
        </a-table>
      </div>
      <div class="yuki-get-off-time">
        <h1>请编辑你的下班时间</h1>
        <a-time-picker :value="getOffTime" value-format="HH:mm:ss" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Button as aButton,
  Table as aTable,
  DatePicker as aDatePicker,
  Input as aInput,
  TimePicker as aTimePicker,
  message,
} from 'ant-design-vue';
// components: { aButton, aTable, aDatePicker, aInput, aTimePicker },
// components: { aButton, aTable, aDatePicker, aInput, aTimePicker },
import type { Ref } from 'vue';
import { onMounted, reactive, ref } from 'vue';

// const showDiv = reactive({ showDiv: false })
let showDiv: Ref<boolean> = ref(false);
let mainText: Ref<string> = ref('');
let isEdit: Ref<boolean> = ref(false);
let getOffTime: string = '18:00:00';
let newDays: { date: string; title: string } = reactive({
  date: '',
  title: '',
});
let columns = reactive([
  {
    title: '日期',
    dataIndex: 'date',
    width: '150px',
  },
  {
    title: '事件',
    dataIndex: 'title',
  },
  {
    title: '操作',
    key: 'operation',
    width: '60px',
  },
]);
let holidays: Ref<{ date: string; title: string }[]> = ref([
  {
    date: '2023-04-05',
    title: '清明节(1天)',
  },
  {
    date: '2023-04-29',
    title: '劳动节(5天)',
  },
  {
    date: '2023-05-12',
    title: '《王国之泪》发售',
  },
  {
    date: '2023-06-22',
    title: '端午节(3天)',
  },
  {
    date: '2023-09-29',
    title: '中秋国庆双节(8天)',
  },
]); // 初始化数组
let workDays: Ref<{ date: string; title: string }[]> = ref([
  {
    date: '2023-04-23',
    title: '劳动节调班',
  },
  {
    date: '2023-05-06',
    title: '劳动节调班',
  },
  {
    date: '2023-10-07',
    title: '中秋国庆双节调班',
  },
  {
    date: '2023-10-08',
    title: '中秋国庆双节调班',
  },
  {
    date: '2023-02-11',
    title: '2月月初周六加班',
  },
  {
    date: '2023-03-04',
    title: '3月月初周六加班',
  },
  {
    date: '2023-04-01',
    title: '4月月初周六加班',
  },
  {
    date: '2023-05-06',
    title: '5月月初周六加班',
  },
  {
    date: '2023-06-03',
    title: '6月月初周六加班',
  },
  {
    date: '2023-07-01',
    title: '7月月初周六加班',
  },
  {
    date: '2023-08-05',
    title: '8月月初周六加班',
  },
  {
    date: '2023-09-02',
    title: '9月月初周六加班',
  },
  {
    date: '2023-10-07',
    title: '10月月初周六加班',
  },
  {
    date: '2023-11-04',
    title: '11月月初周六加班',
  },
  {
    date: '2023-12-02',
    title: '12月月初周六加班',
  },
]);
let dataMap: Record<string, any> = reactive({
  1: { list: holidays.value, title: '法定节假日' },
  2: { list: workDays.value, title: '额外工作日' },
});
onMounted(() => {
  let oldData = localStorage.getItem('dataMap');
  if (oldData) {
    let arr = JSON.parse(oldData) || [];
    holidays.value = arr[1]?.list || [];
    workDays.value = arr[2]?.list || [];
  }
  dataMap = {
    1: { list: holidays.value, title: '法定节假日' },
    2: { list: workDays.value, title: '额外工作日' },
  };

  getOffTimeInfo();
  setInterval(() => {
    getOffTimeInfo();
  }, 1000);
});
function deleteRow(list: Array<any>, item: { title: string }) {
  let index = list.findIndex(
    (day: { title: string }) => item.title === day.title
  );
  list.splice(index, 1);
  isEdit.value = false;
  localStorage.setItem('dataMap', JSON.stringify(dataMap));
}
function addItem(data: Array<any>) {
  if (!data[data.length - 1]?.title || !data[data.length - 1]?.date) return; // 最后一行为空时不添加新行
  data && data.push({ date: '', title: '', isEdit: true }); // 添加空行;
  isEdit.value = true; // 开启编辑状态
}
function saveRow(item: { title: string; date: string; isEdit?: boolean }) {
  if (!item.title || !item.date) return message.warning('请填写完整~'); // 为空时不保存
  isEdit.value = false;
  delete item.isEdit;
  localStorage.setItem('dataMap', JSON.stringify(dataMap));
}
function getOffTimeInfo() {
  const now = new Date();
  let todayOff = new Date();
  let dayOff = getOffTime.split(':');
  todayOff.setHours(+dayOff[0]);
  todayOff.setMinutes(+dayOff[1]);
  todayOff.setSeconds(+dayOff[2]);
  let diff = (todayOff.getTime() - now.getTime()) / 1000;
  let str = '';
  if (diff < 0) {
    //已经下班
    if (diff <= -600) {
      str += '\n依然为了老板努力加班的社畜，已加班:' + -diff;
    } else {
      str += '\n下班了！！！！快润';
    }
  } else {
    str += '\n今天的工作时间剩余: ' + diff;
    if (diff > 3600) {
      let h = Math.floor(diff / 3600);
      let m = Math.floor((diff - h * 3600) / 60);
      str +=
        '\n时间： ' + h + ' 时 ' + m + ' 分 ' + Math.floor(diff % 60) + ' 秒';
    } else {
      str +=
        '\n时间： ' +
        Math.floor(diff / 60) +
        ' 分 ' +
        Math.floor(diff % 60) +
        ' 秒';
    }
  }
  mainText.value = str;
  return str;
  // return '今天的工作时间剩余: 24236\n时间： 6 时 43 分 56 秒\n距离【清明节(1天)】6天\n距离【劳动节(5天)】30天\n 距离【《王国之泪》发售】43天\n距离【端午节(3天)】84天\n距离【中秋国庆双节(8天)】183天\n2023-04-01 , 4月月初周六加班, 你还不能放假哦\n不算当天, 距离【周末】2天';
}
function getHolidayInfo() {
  let currentDate = new Date();
  let day =
    currentDate.getFullYear() +
    '-' +
    (currentDate.getMonth() + 1) +
    '-' +
    currentDate.getDate();
  let content = '';
  holidays.value.forEach((element) => {
    if (new Date(day).getTime() > new Date(element.date).getTime()) {
      return;
    }

    let diffDay =
      (new Date(element.date).getTime() - new Date(day).getTime()) /
      3600 /
      24 /
      1000;
    diffDay = Math.floor(diffDay);
    if (diffDay == 0) {
      content +=
        '\n【不会吧不会吧，今天是' + element.title + '，你还在上班？？？】';
    } else {
      content += '\n距离【' + element.title + '】' + diffDay + '天';
    }
  });

  let weekDay = currentDate.getDay();
  let days = 6 - weekDay;
  // 计算下一个周六的日期
  let nextSaturday = new Date();
  nextSaturday.setDate(currentDate.getDate() + days);
  let saturday =
    nextSaturday.getFullYear() +
    '-' +
    String(nextSaturday.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(nextSaturday.getDate()).padStart(2, '0');
  let saturdayTime = nextSaturday.getTime();
  let diffSatDay = (saturdayTime - new Date(day).getTime()) / 3600 / 24 / 1000;
  diffSatDay = Math.floor(diffSatDay);
  diffSatDay--; // 不算今天

  workDays.value.forEach((element) => {
    if (element.date === saturday) {
      content += '\n' + saturday + ' , ' + element.title + ', 你还不能放假哦';
      diffSatDay++;
    }
  });

  content += '\n不算当天, 距离【周末】' + diffSatDay + '天';
  return content;
}
</script>
<style>
.yuki-count-down {
  white-space: pre-wrap;
}
</style>
