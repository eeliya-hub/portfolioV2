/**
 * Copy whose line breaks are written down rather than left to the browser.
 *
 * A sentence given as an array breaks where the array breaks — but only
 * where there is room for the lines as written. Below that, the parts run
 * together as ordinary prose and wrap wherever they land, because a break
 * chosen for a wide screen is a bad break on a narrow one. A plain string
 * is passed straight through, so nothing has to be converted to use this.
 *
 * The space between the parts is real text, not a CSS gap: it has to be
 * there for the run-together case, and it is harmless when each part is its
 * own line.
 */
export function Lines({ text }) {
  if (!Array.isArray(text)) return text;

  return (
    <span className="lines">
      {text.map((part, index) => (
        <span className="lines__part" key={part}>
          {index ? ' ' : null}
          {part}
        </span>
      ))}
    </span>
  );
}

export default Lines;
