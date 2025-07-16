import React from 'react';
import { useTestPaperCreationStore } from '@/stores/testPaperCreationStore';
import { toast } from 'react-toastify';

// SSE 연결 인스턴스를 전역에서 관리
let eventSource: EventSource | null = null;

// 마지막으로 사용한 workBookId를 저장
let lastWorkBookId: number | null = null;

// workBookId 저장 함수 (Generate.tsx에서 호출할 예정)
export const saveWorkBookId = (id: number) => {
  lastWorkBookId = id;
};

function getToastContent(title: string, message: string): React.ReactNode {
  return (
    <div>
      <div style={{ fontWeight: 700 }}>{title}</div>
      <div>{message}</div>
    </div>
  );
}

export const connectSSE = (userId: number) => {
  // 이미 연결되어 있으면 기존 인스턴스 반환
  if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
    return eventSource;
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const sseUrl = `${baseUrl}/api/sse/${userId}`;

  try {
    eventSource = new EventSource(sseUrl);

    // 'testpaper created' 이벤트 리스너
    eventSource.addEventListener('testpaper created', (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (
          data &&
          data.testPaperId &&
          (data.status === 'COMPLETED' || data.status === 'FAILED')
        ) {
          // Zustand store 갱신
          useTestPaperCreationStore
            .getState()
            .removeCreatingTestPaper(Number(data.testPaperId));

          // List 페이지에 시험지 목록 새로고침 알림
          window.dispatchEvent(new Event('refreshTestPapers'));

          // 토스트 메시지 표시
          const title = data.title || '제목 없음';
          if (data.status === 'COMPLETED') {
            // 1. 이벤트 데이터에서 workBookId 확인
            // 2. 글로벌 변수 lastWorkBookId 확인
            // 3. URL에서 추출 시도

            // workBookId 추출 시도
            let targetWorkBookId = null;

            // 1. 데이터에서 확인
            if (data.workBookId) {
              targetWorkBookId = data.workBookId;
            }
            // 2. 글로벌 변수 확인
            else if (lastWorkBookId) {
              targetWorkBookId = lastWorkBookId;
            }
            // 3. URL에서 추출
            else {
              const match = window.location.pathname.match(/\/generate\/(\d+)/);
              if (match && match[1]) {
                targetWorkBookId = parseInt(match[1], 10);
              }
            }

            toast.success(
              getToastContent(title, '시험지 생성이 완료되었습니다!'),
              {
                onClick: () => {
                  // 시험지 목록 페이지로 이동
                  if (targetWorkBookId) {
                    window.location.href = `/list/${targetWorkBookId}`;
                  } else {
                    // 문제집 ID를 찾지 못한 경우 기본 목록으로
                    window.location.href = '/list';
                  }
                },
                style: { cursor: 'pointer' },
              }
            );
          } else if (data.status === 'FAILED') {
            toast.error(getToastContent(title, '시험지 생성에 실패했습니다.'));
          }
        }
      } catch (e) {}
    });

    eventSource.onerror = (err) => {
      if (eventSource && eventSource.readyState === EventSource.CLOSED) {
        eventSource = null;
      }
    };

    return eventSource;
  } catch (error) {
    eventSource = null;
    return null;
  }
};

export const disconnectSSE = () => {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
};
