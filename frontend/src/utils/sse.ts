import { useTestPaperCreationStore } from '@/stores/testPaperCreationStore';
import { toast } from 'react-toastify';

let eventSource: EventSource | null = null;

export const connectSSE = (userId: number) => {
  console.log('🔥 connectSSE 함수 진입!', userId);
  if (eventSource) {
    eventSource.close();
  }

  eventSource = new EventSource(`http://localhost:8080/api/sse/${userId}`);
  console.log('🔥 EventSource 생성됨!');

  // 시험지 생성 관련 이벤트
  eventSource.addEventListener('testpaper', (event: MessageEvent) => {
    console.log('SSE 이벤트 수신:', event);
    try {
      const data = JSON.parse(event.data);
      console.log('SSE 파싱 데이터:', data);
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
  console.log('🔥 testpaper 이벤트 리스너 등록됨!');

  // 하트비트 이벤트
  eventSource.addEventListener('heartbeat', (event: MessageEvent) => {
    // 필요하다면 마지막 하트비트 시간 기록 등 추가 가능
    console.log('SSE heartbeat:', event.data);
  });
  console.log('🔥 heartbeat 이벤트 리스너 등록됨!');

  eventSource.onerror = (err) => {
    console.error('SSE 연결 에러:', err);
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
