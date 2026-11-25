// Soft, progressive blur along the top edge so content melts under the header
// instead of being cut off by a hard line. Pure CSS, see .gradual-blur in globals.css.
export function GradualBlur() {
  return (
    <div className="gradual-blur" aria-hidden>
      <i />
      <i />
      <i />
      <i />
    </div>
  );
}
