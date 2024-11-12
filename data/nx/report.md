```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Tasks run for command: nx run-many -t build -p account author bbs bps dashboard event fb index … │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
├────────┬─────────────────────────────────────────────────────────┬──────────┬────────────────────┤
│ Status │                          Task                           │ Duration │    Cache Status    │
├────────┼─────────────────────────────────────────────────────────┼──────────┼────────────────────┤
│   ✔    │ wiki:build                                              │   33s    │     Cache Miss     │
│   ✔    │ tool:build                                              │   28s    │     Cache Miss     │
│   ✔    │ search:build                                            │   12s    │     Cache Miss     │
│   ✔    │ pvp:build                                               │   25s    │     Cache Miss     │
│   ✔    │ macro:build                                             │   32s    │     Cache Miss     │
│   ✔    │ fb:build                                                │   30s    │     Cache Miss     │
│   ✔    │ dashboard:build                                         │   24s    │     Cache Miss     │
│   ✔    │ bbs:build                                               │   30s    │     Cache Miss     │
│   ✔    │ account:build                                           │   10s    │     Cache Miss     │
│   ✔    │ author:build                                            │   17s    │     Cache Miss     │
│   ✔    │ bps:build                                               │   26s    │     Cache Miss     │
│   ✔    │ event:build                                             │   17s    │     Cache Miss     │
│   ✔    │ index:build                                             │   25s    │     Cache Miss     │
│   ✔    │ publish:build                                           │   31s    │     Cache Miss     │
│   ✔    │ pvx:build                                               │   43s    │     Cache Miss     │
│   ✔    │ tinymce:build                                           │    2s    │     Cache Miss     │
│   ✔    │ topic:build                                             │   18s    │     Cache Miss     │
└────────┴─────────────────────────────────────────────────────────┴──────────┴────────────────────┘
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   Nx Cloud Task Runner Report                                    │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
├────────┬────────────────────────────────────────┬────────┬───────────────────────────────────────┤
│ 17     │ Successful Tasks                       │ 100%   │ Success Percentage                    │
│ 0      │ Failed Tasks                           │ 0%     │ Failure Percentage                    │
├────────┼────────────────────────────────────────┼────────┼───────────────────────────────────────┤
│ 0      │ Cached Tasks                           │ 0%     │ Cache Hit Percentage                  │
│ 17     │ Total Executed Tasks                   │ 2m 23s │ Run Duration                          │
├────────┴────────────────────────────────────────┴────────┴───────────────────────────────────────┤
│                      See run details: https://cloud.nx.app/runs/t1SP8igvw3                       │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```