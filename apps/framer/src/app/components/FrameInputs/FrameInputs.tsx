import { Button } from 'frog';
import styles from './FrameInputs.module.css';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

/* eslint-disable-next-line */
export interface FrameInputsProps {}

export function FrameInputs(props: FrameInputsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <input
        className="m-4 p-1 rounded-sm"
        type="text"
        placeholder="Name (For internal links)"
      />
      <input
        className="m-4 p-1 rounded-sm"
        type="text"
        placeholder="Image URL"
      />
      <input className="m-4 p-1 rounded-sm" type="text" placeholder="Price" />
      <button
        type="button"
        className="text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 me-2 mb-2"
      >
        <PlusCircleIcon className="h-5 w-5 mr-2" />
        Add Intent
      </button>
    </div>
  );
}

export default FrameInputs;
