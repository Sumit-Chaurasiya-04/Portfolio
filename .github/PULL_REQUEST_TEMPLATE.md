## Summary

Describe the change and the reasoning behind it.

## Changes
- Cleaned CSS syntax and style consistency
- Updated `assets/resume.pdf` (user-provided)
- Added accessible case-study modal and focus trap
- Minor JS interaction polish (theme toggle, project tilt, back-to-top)
- Added CI workflow (stylelint, html-validate, node syntax check)
- Added linting configs and package.json for reproducible checks

## How to test
- Run the project locally: open `index.html` in a browser
- Confirm theme toggle works and persists
- Open a project "Case Study" and test keyboard-only navigation (Tab/Shift+Tab, Esc to close)
- Download Resume from the Resume section

## Checklist
- [ ] Code builds / lints (CI)
- [ ] Modal keyboard accessibility verified
- [ ] Resume link works and downloads
- [ ] No visual regressions on desktop and mobile

## Notes
If anything needs to be reverted or split into smaller PRs, please comment below.
