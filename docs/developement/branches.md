```mermaid
---
title: Git flow
---
gitGraph
   commit
   branch vl3box-vi
   branch vl3box-preview
   branch vl3box
   branch jx3box
   checkout jx3box
   commit
   commit
   checkout vl3box
   merge jx3box
   commit
   commit
   checkout vl3box-preview
   merge vl3box
   commit
   checkout vl3box-vi
   merge vl3box-preview
   checkout jx3box
   commit
   commit
   checkout vl3box
   commit

```