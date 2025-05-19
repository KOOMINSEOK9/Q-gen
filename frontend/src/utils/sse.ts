import { useTestPaperCreationStore } from '@/stores/testPaperCreationStore';
import { toast } from 'react-toastify';

let eventSource: EventSource | null = null;

export const connectSSE = (userId: number) => {
  if (eventSource) {
    eventSource.close();
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  eventSource = new EventSource(`${baseUrl}/api/sse/${userId}`);

  // 시험지 생성 관련 이벤트
  eventSource.addEventListener('testpaper created', (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      if (
        data &&
        data.testPaperId &&
        (data.status === 'COMPLETED' || data.status === 'FAILED')
      ) {
        useTestPaperCreationStore
          .getState()
          .removeCreatingTestPaper(Number(data.testPaperId));
        if (data.status === 'COMPLETED') {
          toast.success('시험지 생성이 완료되었습니다!');
        } else if (data.status === 'FAILED') {
          toast.error('시험지 생성에 실패했습니다.');
        }
      }
    } catch (e) {
      // 파싱 에러 무시
    }
  });

  // 하트비트 이벤트
  eventSource.addEventListener('heartbeat', (event: MessageEvent) => {
    // 필요하다면 마지막 하트비트 시간 기록 등 추가 가능
  });

  eventSource.onerror = (err) => {
    eventSource?.close();
  };

  return eventSource;
};

export const disconnectSSE = () => {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
};
