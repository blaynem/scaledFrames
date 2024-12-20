import { createContext } from "react";
import { TFrameEditorContext } from "./types";

export const defaultState: TFrameEditorContext = {
  frames: [],
  selectedFrame: null,
  setFrameEditorContext: (frames, selectedFrame) => undefined,
};

export const FrameEditorContext = createContext<TFrameEditorContext>(defaultState);