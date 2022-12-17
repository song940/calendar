; (function (win, jq, undefined) {

  jq(function ($) {
    /**
     * [calendar helper]
     * @type {Object}
     */
    $.calendar = {
      leapYear: function (year) {
        return (year % 4 == 0); // basic rule
      },
      getDaysOfMonth: function (month, year) {
        // 设定每月的天数数组
        var ar = new Array(12);
        ar[0] = 31;              // January
        ar[1] = ($.calendar.leapYear(year)) ? 29 : 28;  // February
        ar[2] = 31;              // March
        ar[3] = 30;              // April
        ar[4] = 31;              // May
        ar[5] = 30;              // June
        ar[6] = 31;              // July
        ar[7] = 31;              // August
        ar[8] = 30;              // September
        ar[9] = 31;              // October
        ar[10] = 30;              // November
        ar[11] = 31;              // December
        return ar[month];
      },
      getDayNameOfWeek: function (dayOfWeek) {
        var weekDay = new Array(7);
        weekDay[0] = "一"
        weekDay[1] = "二"
        weekDay[2] = "三"
        weekDay[3] = "四"
        weekDay[4] = "五"
        weekDay[5] = "六"
        weekDay[6] = "日"
        return weekDay[dayOfWeek];
      },
      getMonthName: function (month) {
        //为月份名称设定数组
        var ar = new Array(12)
        ar[0] = "1月"
        ar[1] = "2月"
        ar[2] = "3月"
        ar[3] = "4月"
        ar[4] = "5月"
        ar[5] = "6月"
        ar[6] = "7月"
        ar[7] = "8月"
        ar[8] = "9月"
        ar[9] = "10月"
        ar[10] = "11月"
        ar[11] = "12月"
        return ar[month];
      },

    };
    /**
     * [date class]
     * @param  {[type]} year  [description]
     * @param  {[type]} month [description]
     * @param  {[type]} day   [description]
     * @return {[type]}       [description]
     */
    $.calendar.date = function (year, month, day) {
      var date = (day && (new Date(year, month - 1, day))) || new Date();
      var month = date.getMonth();
      var year = date.getFullYear();
      var day = date.getDate();
      return {
        getDate: function () {
          return date;
        },
        getYear: function () {
          return year;
        },
        getMonth: function () {
          return month + 1;
        },
        getDay: function () {
          return day;
        },
        getDayOfWeek: function () {
          var firstDayOfMonth = new Date(year, month, 1);
          return firstDayOfMonth.getDay();
        },
        getDaysOfMonth: function () {
          return $.calendar.getDaysOfMonth(month, year);
        }
      };
    };
    /**
     * [calendar jQuery Method]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    $.fn.calendar = function (options) {
      var date = new Date();
      //default options .
      options = $.extend({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        title: "",
        active: []
      }, options);


      //
      var date = new $.calendar.date(options.year, options.month, options.day);
      var days = date.getDaysOfMonth();
      var dayOfWeek = date.getDayOfWeek();
      var today = options.day;


      var table, caption, thead, tr, th, td;
      // create basic table structure
      table = document.createElement('table');
      table.setAttribute('data-date', date.getYear() + "-" + date.getMonth());
      //table.className = options.style;// table settings

      caption = document.createElement('caption');
      caption.innerText = options.title;

      table.appendChild(caption);

      // create first row of table to set column width and specify week day
      thead = document.createElement('thead');
      tr = document.createElement('tr');
      // create array of abbreviated day names
      for (var dayNum = 0; dayNum < 7; ++dayNum) {
        th = document.createElement('th');
        th.innerText = $.calendar.getDayNameOfWeek(dayNum);
        tr.appendChild(th);
      }
      thead.appendChild(tr);
      table.appendChild(thead);

      var i = 0, dayOfMonth = 1;
      for (var row = 0; row < Math.ceil((days + dayOfWeek - 1) / 7); row++) {
        tr = document.createElement('tr');

        for (var colDayOfWeek = 1; colDayOfWeek <= 7; colDayOfWeek++) {
          i++;
          td = document.createElement('td');
          if (i < dayOfWeek || dayOfMonth > days) {
            //nothing.
          } else {
            td.className += "normal";
            td.className += ((dayOfMonth == today) ? ' today' : '');
            td.className += $.inArray(dayOfMonth, options.active) == -1 ? '' : ' active';
            td.setAttribute('data-day', dayOfMonth);
            td.innerText = dayOfMonth;
            dayOfMonth++;
          }
          tr.appendChild(td);
        }
        table.appendChild(tr);
      }
      this.each(function (i, item) {
        $(item).html('').append(table);
      });
    };
  });

})(window, jQuery);