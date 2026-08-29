import React from "react";
import { Thumbnail } from "./shared/thumbnail.tsx";

/**
 * The three reel posters. Each states its own reel's claim — a viewer scrolling
 * past all three should see three different arguments, not three crops of one.
 */
export const Reel1Thumb: React.FC = () => (
  <Thumbnail portrait kicker="TASCAM MODEL SERIES"
    hero={"ONE\nPREAMP.\nTHREE\nPATHS."}
    note="Four consoles. The same architecture." image="model-12-0" />
);

export const Reel2Thumb: React.FC = () => (
  <Thumbnail portrait kicker="MODEL 2400 · MODEL 12"
    hero={"BIGGEST\nAND\nSMALLEST."}
    note="Both control the DAW they feed." image="model-2400" />
);

export const Reel3Thumb: React.FC = () => (
  <Thumbnail portrait kicker="TASCAM STUDIO BRIDGE"
    hero={"NO\nPREAMPS\nAT ALL."}
    note="24 in, 24 out. That is the feature." image="studio-bridge-1" />
);
