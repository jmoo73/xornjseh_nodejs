const days = [
   'Sunday',
   'Monday',
   'Tuesday',
   'Wednesday',
   'Thursday',
   'Friday',
   'Saturday',
];

const months = [
   'Jan',
   'Feb',
   'Mar',
   'Apr',
   'May',
   'Jun',
   'Jul',
   'Aug',
   'Sep',
   'Oct',
   'Nov',
   'Dev',
];

const sixDays = [
   'Monday',
   'Tuesday',
   'Wednesday',
   'Thursday',
   'Friday',
   'Saturday',
];

const colors = [
   'Tigertot',
   'White',
   'Yellowstr',
   'Yellow',
   'Greenstr',
   'Green',
   'Bluestr',
   'Blue',
   'Redstr',
   'Red',
   'Blackstr',
   'Bodon',
   'Black',
];

function makeDateString(current) {
   return (
      current.getMonth() +
      1 +
      '/' +
      current.getDate() +
      '/' +
      current.getFullYear() +
      ' ' +
      days[current.getDay()]
   );
}

const now = new Date();
const date = now.getMonth() + 1 + '/' + now.getDate() + '/' + now.getFullYear();
const thisYear = now.getFullYear();

function weekDates(current) {
   let week = [];
   // Starting Monday not Sunday So, MTWTFS .  NO SAUNDAY is included. //
   // On Sunday, coming M-S are listed.
   current.setDate(current.getDate() - current.getDay() + 1);
   for (let i = 0; i < 6; i++) {
      week.push(makeDateString(current));
      current.setDate(current.getDate() + 1);
   }
   return week;
}

function makeDateStringNoDay(current) {
   return (
      current.getMonth() +
      1 +
      '/' +
      current.getDate() +
      '/' +
      current.getFullYear()
   );
}

function makeMonthlyDataList() {
   let attendance = []; // data list to return. 3 months!

   for (let i = 2; i >= 0; i--) {
      let id = 0;
      let monthlyList = [];
      let now = new Date();
      // now is set to the first day of i months prior.
      now.setMonth(now.getMonth() - i);
      now.setDate(1);
      let month = now.getMonth();

      if (now.getDay() !== 0) {
         // if not Sunday, set it to Sunday.
         now.setDate(now.getDate() - now.getDay());
      }
      while (true) {
         if (now.getMonth() === month) {
            monthlyList.push({
               id,
               date: makeDateStringNoDay(now),
               day: days[now.getDay()],
               attendance: [],
               needDataFetch: true,
               test: false,
               start: false,
            });
            id++;
         } else if (now.getMonth() < month) {
            // for last days of prev month.
            monthlyList.push({
               id,
               date: makeDateStringNoDay(now),
               day: days[now.getDay()],
               attendance: [],
               needDataFetch: false,
               test: false,
               start: false,
            });
            id++;
         } else if (now.getDay() !== 0 || id < 6 * 7) {
            monthlyList.push({
               id,
               date: makeDateStringNoDay(now),
               day: days[now.getDay()],
               attendance: [],
               needDataFetch: false,
               test: false,
               start: false,
            });
            id++;
         } else break;
         now.setDate(now.getDate() + 1);
      }
      attendance.push([months[month], monthlyList]); // 3-letter month.
   }
   return attendance;
}

module.exports = {
   date,
   thisYear,
   months,
   days,
   sixDays,
   colors,
   makeMonthlyDataList,
   weekDates,
};
