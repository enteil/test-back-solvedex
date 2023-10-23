import moment from "moment";
export const Serializer = (data) => {
  let result = {};
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      let parts = key.split(".");
      let temp = result;
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          temp[part] = data[key];
        } else {
          temp[part] = temp[part] || {};
          temp = temp[part];
        }
      });
    }
  }
  return result;
};

export const transformDataTeacherSchedule = (data) => {
  return data.map((item) => {
    const start = moment(item.dayOfWeek, "dddd")
      .set({
        hour: parseInt(item.startTime.split(":")[0], 10),
        minute: parseInt(item.startTime.split(":")[1], 10),
        second: 0,
        millisecond: 0,
      })
      .toDate();

    const end = moment(item.dayOfWeek, "dddd")
      .set({
        hour: parseInt(item.endTime.split(":")[0], 10),
        minute: parseInt(item.endTime.split(":")[1], 10),
        second: 0,
        millisecond: 0,
      })
      .toDate();

    return {
      start,
      end,
      title: `${item["subject.name"]} (${item["group.name"]})`,
    };
  });
};
