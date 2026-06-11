import type { DemoProfile, HomeFeed, Schoolmate, Signal } from "@/types/demo";

const DAY_MS = 24 * 60 * 60 * 1000;

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * DAY_MS).toISOString();
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * DAY_MS).toISOString();
}

export const demoProfile: DemoProfile = {
  id: "me_public_demo",
  displayName: "지민",
  schoolName: "크러시고",
  grade: 2
};

export const demoSchoolmates: Schoolmate[] = [
  {
    id: "u_haeun",
    displayName: "하은",
    handle: "haeun_02",
    className: "2학년 3반"
  },
  {
    id: "u_minseo",
    displayName: "민서",
    handle: "minseo.zip",
    className: "2학년 1반"
  },
  {
    id: "u_yejun",
    displayName: "예준",
    handle: "yejun.today",
    className: "2학년 5반"
  }
];

export function createInitialFeed(): HomeFeed {
  const receivedSignals: Signal[] = [
    {
      id: "received_1",
      role: "receiver",
      targetName: "익명의 친구",
      targetHandle: "hidden",
      message: "급식 줄에서 자주 마주치는 사람이 보냈어요.",
      hint: "같은 학년이고 수요일 동아리를 같이 해요.",
      status: "active",
      createdAt: daysAgo(1),
      expiresAt: daysFromNow(5)
    },
    {
      id: "received_2",
      role: "receiver",
      targetName: "익명의 친구",
      targetHandle: "hidden",
      message: "오늘 발표하는 모습이 멋있었다고 해요.",
      hint: null,
      status: "active",
      createdAt: daysAgo(2),
      expiresAt: daysFromNow(2)
    }
  ];

  const sentSignals: Signal[] = [
    {
      id: "sent_1",
      role: "sender",
      targetName: "하은",
      targetHandle: "haeun_02",
      message: "복도에서 웃는 모습이 좋아서 마음을 보냈어요.",
      hint: "서로 마음을 보내면 매치 화면이 열립니다.",
      status: "active",
      createdAt: daysAgo(3),
      expiresAt: daysFromNow(1)
    }
  ];

  return {
    receivedSignals,
    sentSignals,
    tokenBalance: 3
  };
}
