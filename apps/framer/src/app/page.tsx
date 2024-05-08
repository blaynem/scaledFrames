import FrameDebugger from './components/FrameDebugger/frameDebugger';
import Hero from './components/Hero/Hero';
import Layout from './components/Layout/Layout';
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
        <Hero></Hero>
      </div>
    </div>
  );
}
