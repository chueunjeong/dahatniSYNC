import { StudentProject } from "./class";

//과제 상태(숙제 결정)
export const decideNewProjectStatusColor = (
  posListByProjectId: StudentProject[]
) => {
  let newProjectStatusColor = "";

  const checkPosListByProjectId: StudentProject[] = posListByProjectId.filter(
    (pos: StudentProject) => pos.state == "check"
  );
  if (checkPosListByProjectId.length === 0) {
    const blankPosListByProjectId: StudentProject[] = posListByProjectId.filter(
      (pos: StudentProject) => pos.state == ""
    );

    if (blankPosListByProjectId.length === 0) newProjectStatusColor = "gray";
    else newProjectStatusColor = "yellow";
  } else newProjectStatusColor = "red";
  return newProjectStatusColor;
};

//과제 보더 상태(숙제 보더 결정)
export const decideNewProjectBorderColor = (
  posListByProjectId: StudentProject[]
) => {
  let newProjectBorderColor = "";
  const yellowPosListByProjectId: StudentProject[] = posListByProjectId.filter(
    (pos: StudentProject) => pos.borderState == "yellow"
  );
  if (yellowPosListByProjectId.length === 0) newProjectBorderColor = "gray";
  else newProjectBorderColor = "yellow";
  return newProjectBorderColor;
};
