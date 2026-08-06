# Measurement plan

## Purpose and funnel

Measurement answers a small set of product questions without recording the substance of anyone's decision. The primary funnel is:

1. A visitor selects a fixed, named call to action (`cta_click`).
2. A visitor starts Signal Audit or Interactive Lab (`tool_start`).
3. Interactive Lab reports whether its questions and brief stages succeeded (`lab_stage_result`).
4. A tool reaches its intended output (`tool_complete`).
5. A visitor uses a fixed output action such as copy, print, edit, reset, or retake (`tool_output_action`).

Starter-case selection is measured separately (`starter_scenario_selected`) so the team can compare the five prewritten entry points without collecting the starter text or a visitor's edited decision.

## Privacy boundary

`window.ccTrack()` accepts only six allowlisted event names, the exact property keys defined for each event, and finite allowlisted property values. Unknown events, missing or extra properties, and unknown values are rejected before GA4 is called. Click instrumentation reads only fixed `data-analytics-*` metadata from the clicked element.

Never send form or input values, questionnaire answers, decision text, evidence text, generated briefs, spend figures, URLs, page text, PII, company names, contract terms, or email addresses. Do not add identifiers, free-form labels, query strings, page-content capture, user IDs, or session-replay tooling to this implementation. Google Signals and ad-personalization signals are disabled in the GA4 configuration.

## GA4 configuration

Register these event-scoped custom dimensions:

- `destination`, `source`
- `tool`, `entry`
- `result`, `stage`
- `action`
- `scenario`

Mark `tool_complete` as the primary key event. Use `tool_start` and `cta_click` as funnel steps, not key events. Treat `lab_stage_result` as reliability telemetry and `tool_output_action` as post-completion usefulness telemetry.

## Weekly reporting

Review a seven-day window against the prior seven days and a trailing four-week baseline:

- CTA clicks by fixed source and destination
- Starts by tool and entry
- Completion rate: unique `tool_complete` events divided by `tool_start` events, by tool
- Interactive Lab questions and brief success rates
- Starter-case selections by scenario
- Output actions per completed tool

Flag material volume changes, falling completion rates, or stage failures for investigation. Report only aggregate event counts and rates. Do not attempt to identify individual visitors or reconstruct their decisions.
