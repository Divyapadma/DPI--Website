/** Barely-visible fixed noise texture over the whole viewport — see .grain-overlay in globals.css. */
export default function GrainOverlay() {
  return <div className="grain-overlay grain-texture" aria-hidden="true" />;
}
