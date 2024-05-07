import FrameDebugger from '../components/FrameDebugger/frameDebugger';
import './page.module.css';

export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  return (
    <div className="page">
      <div className="wrapper">
        <div style={{ display: 'flex', height: '100vh' }}>
          <div
            className="flex-item column1"
            style={{ padding: '20px', flex: '0 0 20%' }}
          >
            <h1> Welcome to Framer! </h1>
          </div>
          <div
            className="flex-item column2"
            style={{ padding: '20px', flex: '0 0 30%' }}
          >
            <h1> Welcome to Framer! </h1>
          </div>
          <div
            id="welcome"
            className="flex-item column3"
            style={{ padding: '20px', flex: '0 0 50%' }}
          >
            <FrameDebugger></FrameDebugger>
          </div>
        </div>
      </div>
    </div>
  );
}
