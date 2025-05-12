import { useState, useEffect, useRef } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import BoldIcon from '@/assets/icons/bold.svg?react';
import ItalicIcon from '@/assets/icons/italic.svg?react';
import ListIcon from '@/assets/icons/list.svg?react';
import TrashIcon from '@/assets/icons/trash.svg?react';
import debounce from 'lodash.debounce';
import { patchNoteMemo } from '@/apis/note/note';

interface MemoProps {
  testId: number;
  initialMemo: string | null;
}

function memoToEditorState(memo: string | null) {
  if (!memo) return EditorState.createEmpty();
  try {
    // draft-js raw string
    return EditorState.createWithContent(convertFromRaw(JSON.parse(memo)));
  } catch {
    // plain text fallback
    return EditorState.createEmpty();
  }
}

function editorStateToMemo(editorState: EditorState) {
  const content = editorState.getCurrentContent();
  if (!content.hasText()) return '';
  return JSON.stringify(convertToRaw(content));
}

const Memo = ({ testId, initialMemo }: MemoProps) => {
  const [editorState, setEditorState] = useState(() =>
    memoToEditorState(initialMemo)
  );
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const latestTestId = useRef(testId);

  // testId 바뀌면 editorState 초기화
  useEffect(() => {
    setEditorState(memoToEditorState(initialMemo));
    latestTestId.current = testId;
  }, [testId, initialMemo]);

  // 디바운스 저장 함수
  const debouncedSave = useRef(
    debounce(async (testId: number, memo: string) => {
      setStatus('saving');
      await patchNoteMemo(testId, memo);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 1000);
    }, 1000)
  ).current;

  // editorState 변경 시 자동 저장
  useEffect(() => {
    if (!editorState) return;
    const memo = editorStateToMemo(editorState);
    if (latestTestId.current && memo !== undefined) {
      debouncedSave(latestTestId.current, memo);
    }
  }, [editorState]);

  const handleClear = () => {
    if (window.confirm('메모를 삭제하시겠습니까?')) {
      setEditorState(EditorState.createEmpty());
    }
  };
  const handleBold = () =>
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  const handleItalic = () =>
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
  const handleList = () =>
    setEditorState(
      RichUtils.toggleBlockType(editorState, 'unordered-list-item')
    );

  return (
    <div className='bg-white rounded-3xl p-6 shadow-sm flex flex-col h-full relative'>
      <div className='flex items-center justify-between mb-2'>
        <div className='text-lg font-bold'>문제별 노트</div>
      </div>
      <div className='flex items-center gap-6 mb-2'>
        <button
          type='button'
          className='text-gray-700 hover:text-[#754AFF] text-lg cursor-pointer'
          onClick={handleBold}
        >
          <BoldIcon />
        </button>
        <button
          type='button'
          className='text-gray-700 hover:text-[#754AFF] text-lg cursor-pointer'
          onClick={handleItalic}
        >
          <ItalicIcon />
        </button>
        <button
          type='button'
          className='text-gray-700 hover:text-[#754AFF] text-lg cursor-pointer'
          onClick={handleList}
        >
          <ListIcon />
        </button>
        <div className='flex-1' />
        <button
          type='button'
          className='text-gray-700 text-lg hover:text-red-600 cursor-pointer'
          onClick={handleClear}
        >
          <TrashIcon />
        </button>
      </div>
      <div className='border-b border-gray-700 mb-2' />
      <div className='flex-1 text-sm w-full min-w-0 break-words'>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          placeholder={`나만의 해설이나 메모를 기록해보세요.`}
        />
        <style>{`
          .public-DraftEditor-content {
            width: 100%;
            min-width: 0;
            word-break: break-word;
            overflow-wrap: break-word;
            white-space: pre-wrap;
            box-sizing: border-box;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Memo;
