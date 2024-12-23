'use client';

import React, { useEffect, useState } from 'react';
import FrameDebugger from '../../components/FrameDebugger/frameDebugger';
import FrameInputs from '../../components/FrameInputs/FrameInputs';
import FramePreviewContainer from '../../components/FramePreview/FramePreviewContainer';
import Layout from '../../components/Layout/Layout';
import { TFrameEditorContext } from '../../lib/types';
import { getFrames } from '../../utils/utils';
import { ToastProvider } from '../../components/Toasts/ToastProvider';
import { FrameEditorContext, defaultState } from '../../lib/frame-context';

export default function Index({ params }: { params: { projectId: string } }) {
  const [frames, setFrames] = useState(defaultState.frames);
  const [selectedFrame, setSelectedFrame] = useState(
    defaultState.selectedFrame
  );

  useEffect(() => {
    const fetchFrames = async () => {
      const tempFrames = await getFrames(params.projectId);
      setSelectedFrame(tempFrames[0]);
      setFrames(tempFrames);
    };

    fetchFrames();
  }, [params]);

  const setFrameEditorContext = (
    newFrames: TFrameEditorContext['frames'],
    newSelectedFrame: TFrameEditorContext['selectedFrame']
  ) => {
    setFrames(newFrames);
    setSelectedFrame(newSelectedFrame);
  }
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */

  return (
    <Layout>
      <FrameEditorContext.Provider
        value={{ frames, selectedFrame, setFrameEditorContext }}
      >
        <ToastProvider>
          <div className="page from-blue-900 overflow-scroll" style={{ height: "calc(100vh - 68px)"}}>
            <div className="wrapper">
              <div
                className="flex divide-x bg-zinc-200 dark:bg-slate-900"
              >
                <div
                  className="flex-item column1 overflow-y-auto"
                  style={{ padding: '20px', flex: '0 0 20%' }}
                >
                  <FramePreviewContainer />
                </div>
                <div
                  className="flex-item column2 overflow-y-auto"
                  style={{ padding: '20px', flex: '0 0 30%' }}
                >
                  <FrameInputs />
                </div>
                <div
                  className="flex-item column3 overflow-y-auto flex flex-col items-center justify-center"
                  style={{ padding: '20px', flex: '0 0 50%' }}
                >
                  <FrameDebugger />
                </div>
              </div>
            </div>
          </div>
        </ToastProvider>
      </FrameEditorContext.Provider>
    </Layout>
  );
}

// Define the initial state for frames and selected frame
