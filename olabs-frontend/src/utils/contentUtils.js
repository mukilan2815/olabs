export const renderContent = (content, isList = false) => {
  if (content === null || content === undefined) {
    return "No content available.";
  }

  if (typeof content === "object") {
    if (content.content) {
      return renderContent(content.content, isList); // Recursively render content
    }
    if (content.description) {
      return (
        <p>
          {content.description}
          {content.elements && Array.isArray(content.elements) && (
            <ul>
              {content.elements.map((element, index) => (
                <li key={index}>{renderContent(element)}</li>
              ))}
            </ul>
          )}
        </p>
      );
    }
    if (content.title) {
      return (
        <>
          <h4>{content.title}</h4>
          {content.formulae && (
            <p>
              <strong>Formula:</strong> {content.formulae}
            </p>
          )}
          {content.text && <p>{content.text}</p>}
          {content.elements && Array.isArray(content.elements) && (
            <ul>
              {content.elements.map((element, index) => (
                <li key={index}>{renderContent(element)}</li>
              ))}
            </ul>
          )}
        </>
      );
    }
    if (Array.isArray(content)) {
      return (
        <ol>
          {content.map((item, index) => (
            <li key={index}>{renderContent(item)}</li>
          ))}
        </ol>
      );
    }
    if (content.elements) {
      if (Array.isArray(content.elements)) {
        return (
          <ul>
            {content.elements.map((element, index) => (
              <li key={index}>{renderContent(element)}</li>
            ))}
          </ul>
        );
      }
      return JSON.stringify(content.elements); // Fallback for complex objects
    }
    if (content.instructions || content.interface_elements) {
      return (
        <>
          {content.instructions && (
            <>
              <h4>Instructions</h4>
              <ol>
                {content.instructions.map((instr, index) => (
                  <li key={index}>{renderContent(instr)}</li>
                ))}
              </ol>
            </>
          )}
          {content.interface_elements && (
            <>
              <h4>Interface Elements</h4>
              <ul>
                {content.interface_elements.map((element, index) => (
                  <li key={index}>{renderContent(element)}</li>
                ))}
              </ul>
            </>
          )}
        </>
      );
    }
    if (content.chapters) {
      return (
        <>
          <h4>Video Chapters</h4>
          <ol>
            {content.chapters.map((chapter, index) => (
              <li key={index}>{renderContent(chapter)}</li>
            ))}
          </ol>
          {content.description && <p>{renderContent(content.description)}</p>}
        </>
      );
    }
    try {
      return JSON.stringify(content, null, 2); // Pretty print for debugging
    } catch () {
      return "Complex object that cannot be displayed directly";
    }
  }

  // Handle strings and numbers directly
  return String(content);
};
