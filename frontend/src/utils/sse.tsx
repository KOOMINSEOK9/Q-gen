import React from 'react';
import { useTestPaperCreationStore } from '@/stores/testPaperCreationStore';
import { toast } from 'react-toastify';

// SSE 연결 인스턴스를 전역에서 관리
let eventSource: EventSource | null = null;

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
            toast.success(
              getToastContent(title, '시험지 생성이 완료되었습니다!')
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
