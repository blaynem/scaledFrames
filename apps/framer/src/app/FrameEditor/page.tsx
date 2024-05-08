import FrameDebugger from '../components/FrameDebugger/frameDebugger';
import FrameInputs from '../components/FrameInputs/FrameInputs';
import FramePreviewContainer from '../components/FramePreview/FramePreviewContainer';
import Layout from '../components/Layout/Layout';
import './page.module.css';

export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  return (
    <Layout>
      <div className="page">
        <div className="wrapper">
          <div
            className="divide-x bg-gray-100 border-gray-200 border-2 rounded-md"
            style={{ display: 'flex', height: '100vh' }}
          >
            <div
              className="flex-item column1 border-right"
              style={{ padding: '20px', flex: '0 0 20%' }}
            >
              <FramePreviewContainer />
            </div>
            <div
              className="flex-item column2"
              style={{ padding: '20px', flex: '0 0 30%' }}
            >
              <FrameInputs />
            </div>
            <div
              className="flex-item column3"
              style={{ padding: '20px', flex: '0 0 50%' }}
            >
              <FrameDebugger frameId={'1'}></FrameDebugger>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
