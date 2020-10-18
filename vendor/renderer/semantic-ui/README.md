# customized semantic-ui

Sqlectron uses a slightly modified version of semantic-ui. These edits are relatively minor,
and allow it to play nicely with the react / local modal.

Any changes can be easily found by searching for `>>> SQLECTRON CHANGE`. The edits are specifically
listed below:

**IMPORTANT** In case of editing semantic-ui to bring in a new version (or otherwise), these changes
will have to be re-applied!

## JS

The semantic-ui js has some customizations:

- observeChanges method ignores changes for "Select" class

## CSS

This semantic-ui css has some customizations:

- Commented import of Lato fonts from Google because we use local fonts.
