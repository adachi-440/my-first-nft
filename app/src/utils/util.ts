import { stage1 } from '../images/index';

export const pickUpImage = (stage: number) => {
  switch (stage) {
    case 1:
      return stage1;
    case 2:
      return stage1;
    case 3:
      return stage1;
    case 4:
      return stage1;
    case 5:
      return stage1;
    case 6:
      return stage1;
    case 7:
      return stage1;
    case 8:
      return stage1;
    default:
      break;
  }
};

export const convertStageToPlanet = (stage: number) => {
  switch (stage) {
    case 1:
      return 'Mercury';
    case 2:
      return 'Venus';
    case 3:
      return 'Earth';
    case 4:
      return 'Mars';
    case 5:
      return 'Jupitar';
    case 6:
      return 'Saturn';
    case 7:
      return 'Earth';
    case 8:
      return 'Earth';
    default:
      break;
  }
};
