import moment from 'moment';
import {DateFormate} from './constants.js';

export const filterTasks = (data, filterName) => {
  let filteredTasks = data;

  switch (filterName) {
    case `all`:
      filteredTasks = data;
      break;

    case `overdue`:
      filteredTasks = data.filter((it) => moment(it.dueDate).isBefore(moment().subtract(1, `day`)));
      break;

    case `today`:
      filteredTasks = data.filter((it) => moment(it.dueDate).format(DateFormate.TASK) === moment().format(DateFormate.TASK));
      break;

    case `favorites`:
      filteredTasks = data.filter((it) => it.isFavorite);
      break;

    case `repeating`:
      filteredTasks = data.filter((it) => [...Object.entries(it.repeatingDays)]
          .some((rec) => rec[1]));
      break;

    case `tags`:
      filteredTasks = data.filter((it) => [...it.tags].length);
      break;

    case `archive`:
      filteredTasks = data.filter((it) => it.isDone);
      break;
  }
  return filteredTasks;
};

export const filterByTag = (data, tag) => {
  return data.filter((it) => Array.from(it.tags).indexOf(tag) >= 0);
};
