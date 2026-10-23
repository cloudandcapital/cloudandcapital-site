Please audit Cloud Cost Guard and its new companion guide as a first-time visitor. Use the real controls. No edits or publishing.

Tool: https://guard.cloudandcapital.com/
Guide: https://cloudandcapital.com/insights/using-cloud-cost-guard
Directory: https://cloudandcapital.com/tools
Source: https://github.com/cloudandcapital/cloud-cost-guard
Source reviewed for the guide: 4d35b115c8b5179158087cb285896f8791544cd1. Check the current version before reporting an old issue.

Cloud & Capital is Diana's finance/tool-building business. The tools should help someone do something useful with their own information. Our voice is casual and easy to understand. Keep the calm beige, sage and clay design. The important question is: "Great, but what do I do with this result?"

Start cold as someone who wants to review THEIR OWN AWS, Azure or Google Cloud spending. That is the main product, not a demo dashboard. Can you find the exact file to export, upload it and get a useful result? The guide now starts with your own bill and explains the actual provider routes. It no longer asks visitors to download two made-up bills first.

This is the priority readiness question: current code reads supported FOCUS columns or the simple template. AWS/Azure have documented FOCUS CSV instructions; generic Google Cloud exports need preparation. Don't infer full provider compatibility from a simple invented fixture. Compare the parser against representative official export layouts, versions, timestamp formats, credits/taxes, blank account-level service names, multipart deliveries and compression. Where you cannot test an actual delivered format, mark it unverified. Is the upload experience easy enough, and are unsupported files explained without fabricating results?

Diana's broader release requirement is coverage of the major providers' real downloads with minimal setup. Use the provider-input-coverage-2026-10-23.md brief alongside this audit. Start with AWS, Azure and Google Cloud, and distinguish native tested imports, files needing mapping, manual entry and unsupported/unverified formats. This is an audit of the own-bill product, not just the sample arithmetic.

Use these public, fictional CSVs for a repeatable arithmetic check after evaluating the own-bill flow. They remain QA fixtures, not a required visitor workflow. Do not upload private information:

- Current (September): https://cloudandcapital.com/examples/cloud-cost-guard/current-example.csv
- Previous (August): https://cloudandcapital.com/examples/cloud-cost-guard/previous-example.csv

Select September under Your current bill and August under An earlier bill, then choose Review my bill. This uploaded example is different from the separate Try an example dashboard. Please keep those modes distinct.

Independently verify the arithmetic from the files before comparing with this expected result: September net $1,310.13; August net $996.60; increase $313.53, or 31.5%; API compute increase $240.03. September has 30 days and August has 31. Exact unrounded values are 1310.125, 996.6, 313.525 and 240.025. Are totals, credits, rounding, dates and period-length warnings clear and consistent? Does anything imply that a higher bill proves waste, savings, or a known cause?

Try the current CSV alone, then the comparison. Check Findings and Lumen's What changed? answer. Can you identify one next investigation, the person to involve, and what records to check? Does the guide let someone go directly from their own export to that result, with the optional sample clearly secondary? Do service totals adding up get confused with a complete invoice? Do unavailable AI/software/utilization sections honestly explain their limits?

Test supported input and a few useful edge cases with made-up files: empty/invalid input, a missing required column, negative credits, mixed currencies, duplicated parts, overlapping periods, edit/reset/clear, and a reload. Read the published format/limit rules before choosing expected behavior. The tool supports FOCUS or its simple template; it does not promise to read every AWS/Azure CSV, a PDF, Excel, or compressed export directly. Don't run load tests or upload large files.

Download Printable report, Evidence JSON and a normalized CSV. Do they preserve the actual result and its provenance? If you can make a real PDF, inspect its pages and clipping. If you cannot, say so; don't substitute an estimated page count. Check desktop, a narrow phone view, keyboard navigation, labels, loading/errors, long names, and whether download/copy actions really work.

Check uploaded-mode privacy against source and actual network requests where available. Uploaded Lumen uses prepared local report answers. The separate sample dashboard's AI chat has a different disclosure. Don't treat a disclosure alone as proof, and distinguish observed traffic from source-only conclusions.

Compare with two credible public alternatives or official provider cost-analysis workflows. Use primary sources. Focus on who would use this small upload-based tool, its useful differences, and any small missing capability that would materially help. Separate optional ideas from launch defects; don't prescribe a huge platform rebuild.

Return a clear readiness verdict and prioritized findings. For each bug: page/section, exact reproduction, expected versus actual behavior, evidence, and the smallest useful fix. Separate hands-on results, source-only findings, suggestions, and things you could not test. Prioritize provider import friction over example polish. The Guard app has a separate active owner; this review should inform that work rather than make concurrent app changes.
