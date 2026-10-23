# AI Cost Lens preview refresh

Homepage and Tools directory now use the accepted simple comparison interface and a shared real screenshot. The existing colors, layout, animation, links, and tool order are retained.

The image was captured from AI Cost Lens source commit `dbae5be1b5c57cf639ba574dc4ea877fe5eada99`, accepted by all eight release checks and merged as `7f2bb1770d930cf8013af646ef30bc5b3c2ecfda`. It is a crop of the actual comparison card; no controls, labels, or figures were recreated.

## Reproduce the screenshot

Choose Compare two options, enter Plan A and Plan B, and use these invented inputs:

| Input | Plan A | Plan B |
| --- | ---: | ---: |
| Monthly tool charge | $80 | $40 |
| Outputs checked | 20 | 20 |
| Usable outputs | 18 | 16 |
| Review/fixing minutes | 60 | 120 |

Use 100 monthly tasks, $30/hour, a 75% minimum usable rate, and the explicit tool-approval checkbox. The result is $230 versus $340 including estimated time value, 90 versus 80 projected usable results, and $2.56 versus $4.25 per usable result. This is an invented monthly estimate, not a client result or demonstrated saving.

The original 1363×936 screenshot was retained as `ai-cost-lens-usable-result-source-20261022.jpg` during review. The published crop is `public/images/ai-cost-lens-usable-result-preview.jpg`, 1193×538 pixels. The website window labels it Example data on both pages; alt text describes the result. Copy states the main job, what the visitor brings, and what they receive.

Further authentic provider export formats and physical devices remain additional tool coverage; the preview does not imply universal invoice compatibility.

## Website verification

All 78 existing website tests and the production build pass. The built-directory check passes category membership, colors, View all, centered actions, and image containment. The homepage was inspected at desktop and 390px phone width; the featured preview fits without horizontal overflow at 320, 375, 390, 414, 768, and 1024px. The Tools card was inspected at 390px with its image loaded and Example data label visible. These are browser viewport checks, not physical-device certification.

The development server now permits the exact `terminal.local` host required by the managed preview. Production routing and hosting access are unchanged.
