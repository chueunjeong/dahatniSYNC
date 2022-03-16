//학생 체크리스트
export class StudentChecklist {
  classId: string;
  userId: string;
  code: string;
  checklistId: string;
  hide: boolean;
  state: string;
  description: string;
  created: number;
  updated: number;

  constructor(classId: string, userId: string, code: string, checklistId: string) {
    this.classId = classId;
    this.userId = userId;
    this.code = code;
    this.checklistId = checklistId;
    this.hide = false;
    this.state = '';
    this.description = '';
    this.created = +new Date();
    this.updated = +new Date();
  }
}

//학생 과제
export class StudentProject {
  classId: string;
  userId: string;
  projectId: string;
  code: string;
  hide: boolean;
  project_hide: boolean;
  repeat: boolean;
  repeatType?: string;
  repeatData?: RepeatData[];
  state: string;
  borderState: string;
  cookie: number;
  score: string;
  reject: string;
  feedback: string;
  studentBody: string;
  fileUrls: any[];
  created: number;
  updated: number;
  //생성자
  constructor(
    classId: string,
    userId: string,
    projectId: string,
    code: string,
    repeat: boolean,
    repeatType: string = '',
    repeatData: RepeatData[] = [],
    borderState: string = '',
  ) {
    this.classId = classId;
    this.userId = userId;
    this.projectId = projectId;
    this.code = code;
    this.hide = false;
    this.project_hide = false;
    this.repeat = repeat;
    this.repeatType = repeatType;
    this.repeatData = repeatData;
    this.state = '';
    this.borderState = borderState;
    this.cookie = 0;
    this.score = '';
    this.reject = '';
    this.feedback = '';
    this.studentBody = '';
    this.fileUrls = [];
    this.project_hide = false;
    this.created = +new Date();
    this.updated = +new Date();
  }
}

//반복 과제
export class RepeatData {
  open: boolean;
  reject: string;
  state: string;
  score: string;
  cookie: number;
  feedback: string;
  studentBody: string;
  fileUrls: any[];
  alertDate: number;
  created: number;
  updated: number;

  //생성자
  constructor(open: boolean, alertDate: number = null) {
    this.open = open;
    this.reject = '';
    this.state = '';
    this.score = '';
    this.cookie = 0;
    this.feedback = '';
    this.studentBody = '';
    this.fileUrls = [];
    this.alertDate = alertDate;
    this.created = +new Date();
    this.updated = +new Date();
  }
}

//학생 뱃지
export class StudentBadge {
  classId: string;
  userId: string;
  code: string;

  badges: boolean[];
  created: number;
  updated: number;
  constructor(classId: string, userId: string, code: string) {
    this.classId = classId;
    this.userId = userId;
    this.code = code;

    const badges: boolean[] = new Array(6);
    badges.fill(false);
    this.badges = badges;
    this.created = +new Date();
    this.updated = +new Date();
  }
}

//뱃지
export class Badge {
  imgUrl: string;
  title: string;
  type: string;
  manualTarget: string;
  autoTarget: number;
  desc: string;
  created: number;
  updated: number;
  constructor(
    imgUrl: string = '',
    title: string = '',
    type: string = '',
    manualTarget: string = '',
    autoTarget: number = 0,
    desc: string = '',
  ) {
    this.imgUrl = imgUrl;
    this.title = title;
    this.type = type;
    this.manualTarget = manualTarget;
    this.autoTarget = autoTarget;
    this.desc = desc;
    this.created = +new Date();
    this.updated = +new Date();
  }
  static ManualInstance(imgUrl: string, title: string, manualTarget: string, desc: string = '') {
    const newBadge: Badge = new Badge(imgUrl, title, 'manual', manualTarget, 0, desc);
    return newBadge;
  }
  static AutoInstance(imgUrl: string, title: string, autoTarget: number = 0, desc: string = '') {
    return new Badge(imgUrl, title, 'auto', '', autoTarget, desc);
  }
}

//학급 뱃지
export class ClassBadge {
  classId: string;
  userId: string;
  badges: Badge[];
  created: number;
  updated: number;
  constructor(classId: string, userId: string) {
    this.classId = classId;
    this.userId = userId;

    const badgeList: Badge[] = new Array(6);
    badgeList.fill(new Badge());
    this.badges = badgeList;
    this.created = +new Date();
    this.updated = +new Date();
  }
}
