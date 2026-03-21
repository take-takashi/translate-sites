## ADDED Requirements

### Requirement: CLI can translate a single page into Japanese Markdown
The system SHALL provide a CLI that accepts one URL, processes the referenced page, and produces a Japanese Markdown document as output.

#### Scenario: Single URL input is processed
- **WHEN** a user runs the CLI with one valid page URL
- **THEN** the system MUST execute page retrieval, content extraction, Markdown conversion, translation, and file output as a single workflow

#### Scenario: A representative mise-en-place page is processed
- **WHEN** a user runs the CLI with a representative `mise-en-place` documentation URL such as `https://mise.jdx.dev/getting-started.html`
- **THEN** the system MUST produce one Japanese Markdown output for that page without requiring site-specific manual preprocessing

### Requirement: CLI extracts article-focused content before translation
The system SHALL isolate the primary page content before translation so that navigation, footer, and other surrounding chrome are not treated as the main body.

#### Scenario: Page includes non-content chrome
- **WHEN** the retrieved HTML contains navigation menus, footer links, and a primary content section
- **THEN** the system MUST use the primary content section as the translation source instead of translating the full page chrome

### Requirement: CLI preserves Markdown structure during translation
The system SHALL preserve document structure when converting and translating content, including headings, links, lists, and code blocks.

#### Scenario: Structured content is converted and translated
- **WHEN** the extracted page content contains headings, links, lists, or code blocks
- **THEN** the generated Markdown MUST retain those structures after translation

#### Scenario: mise-en-place installation guide includes code blocks
- **WHEN** the input page is a `mise-en-place` installation or getting-started document containing shell command examples
- **THEN** the generated Markdown MUST preserve code block boundaries and command text structure while translating surrounding explanatory text

### Requirement: CLI stores output with source traceability
The system SHALL save the generated Markdown to a file that retains the original source URL in the output content or metadata.

#### Scenario: Markdown output is saved
- **WHEN** the CLI completes a successful translation
- **THEN** the saved Markdown file MUST include the source URL and be written under the configured output location

#### Scenario: Output retains source traceability for mise-en-place pages
- **WHEN** the CLI saves a translated `mise-en-place` page
- **THEN** the output MUST retain the original `mise.jdx.dev` source URL in content or metadata so the page can be re-fetched later

### Requirement: CLI reports processing failures without partial success being hidden
The system SHALL surface a clear error when any stage of retrieval, extraction, translation, or saving fails.

#### Scenario: A pipeline stage fails
- **WHEN** any processing stage returns an error
- **THEN** the CLI MUST report the failure to the caller and MUST NOT silently claim success
