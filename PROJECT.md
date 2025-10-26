# Agent Requirements
  * 4 custom functions (actions) that can be called
    * 1+ action(s) can be performed autonomously
    * 1+ action(s) require user confirmation to perform
    * 1+ action(s) automatically adjust the UI when performed
      * (e.g. navigates user to a new page or make a sidebar slide out)
  * structured output, validated with zod
  * agentic loop runs until the task is complete or user intervention is required
  * LLM decisions and actions are persisted and can be inspected by users

  * All agents must be ethical - no abusing web resources without the consent of the website owners

  * Unethical agents will be given a 0 on the project. If you are uncertain if a task counts as ethical, bring it up in class and we can discuss it as a class. (note that ethical and legal are distinct terms)*

## Additional Tasks

You must complete at least one of the following:

  * integrate a 3rd party MCP server
  * user configurable benchmarking tool
  * working with pictures
  * audio input from the user (tap to record -> auto-transcribe -> llm text input)
  * real time websocket communication
  * streaming generation in the UI x

## Technical Requirements

  * Deployed in production (public internet or class kuberentes cluster)
    * CI/CD pipeline
    * Unit tests run automatically
    * Linter runs automatically
  * Data persisted on server so access can happen from any client

## Technology Requirements

  * Global client-side state management
  * Toasts / global notifications or alerts
  * Error handling (both on api requests and render errors)
  * Network Calls
    * read data x
    * write data x
  * Developer type helping
  * 10+ pages/views via a router
  * CI/CD pipeline
    * Live production environment x
    * Automated testing and linting in the pipeline (abort build if fails) x
  * 3+ reusable form input components x
  * 2+ reusable layout components x
  * authentication and user account support x
    * authorized pages and public pages x

## Experience Requirements

Your site should be an organized and smooth experience (if you have questions about this, get feedback from your professor before the due date). Use spinners, disabled buttons, and css animations to make your site feel organized and clean. Your site's navigation should be accessible and lead the user to a "pit of success" as they use your features.

Your site must be mobile responsive. All pages must be easy to use in a mobile format. You must have 3+ instances where elements re-order themselves to fit in a smaller width.

## Scope Requirements

Your final project should be ~3 times larger than the Chat App assignment per person (if you are in a group of 2, the final should be 5-6 times larger). This means 3+ times as many interactions and features.

## Rubric

| Criteria | Points |
|---|---:|
| Project scope is 2-3 times larger than Inventory Management (per group member) | 30 pts |
| Technology: use local storage | 5 pts |
| Technology: Client side state stores (e.g. tanstack query or context) | 5 pts |
| Technology: Toasts / global notifications or alerts | 5 pts |
| Technology: Error handling (both on api requests and render errors) | 5 pts |
| Technology: Network Calls that read and write data | 5 pts | x
| Technology: Developer type helping (typescript) | 5 pts | x
| Technology: 10+ pages or views | 5 pts |
| Technology: CI/CD pipeline | 5 pts | x
| Technology: tests run in pipeline, pipeline aborts if they fail | 5 pts | x
| Technology: linting in pipeline | 5 pts | x
| Technology: 3+ generic form input components | 9 pts | x
| Technology: 4+ generic layout components | 12 pts | x
| Technology: authentication and user account support | 10 pts | x
| Technology: authorized pages and public pages | 5 pts | x
| Experience: all experiences mobile friendly | 5 pts |
| Experience: 3 instances where elements re-order themselves on smaller screens | 5 pts |
| Professional, organized and smooth experience | 20 pts |
| **Total** | **146 pts** |
