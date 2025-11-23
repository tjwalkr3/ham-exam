# Ham Exam
An amateur radio study site written in React and TypeScript. 

## Elevator Pitch
Ham Radio Study Buddy is an intelligent AI agent that helps aspiring amateur radio operators study for their license exams (Technician, General, Extra). The agent analyzes your performance, identifies weak areas, and facilitates targeted practice sessions. Using embeddings-based similarity search, it finds related questions to reinforce concepts, creates progress reports with actionable recommendations, and adapts the difficulty based on your performance.

## Contributors
* Thomas Jones

## Custom Functions
1. **Initiate quiz** - When the user clicks the button to start a quiz, the AI will decide which subtopics the user should study for the current quiz. 
2. **Get New Question** - When the user gets a question right, the LLM will take the mastery percentages and the amount of time since the last quiz for each question and get a new quiz question (within the given section) based on this information. 
3. **Get Similar Question** - When the user gets a question wrong, the LLM will use this function to pick a related quetion that can be used to reinforce their understanding of this topic. 
4. **Generate Mastery Report** - The LLM will take in data about the users' mastery of the different topics, and generate a report that contains the mastery level for these topics. 

## Additional Tasks
* Streaming Output - Stream the chatbot output to the terminal from the API for a more streamlined experience. 

## A list of new things I will need to do to accomplish your project (project risks from high to low)
* Dynamically generate a sequence of quiz questions, based on user actions. 
* Make a tool call that can get data from the database. 
* Do Zod schema validation for tool calls. 
* Create a header that shows up on all of the pages, and 
* Load data into a database from a JSON source and generate embeddings. 

## A list of the 10 pages/views you plan on implementing for your project
1. **Landing Page** (public) - Marketing and feature overview. 
2. **Logged-in User Page** - Overview of progress, button to start a quiz
3. **Start Quiz Confirmation Modal** - A popup modal that shows the user what subtopic the AI recommends studying, and a button to confirm that we want to start this quiz. 
4. **Quiz Page** - Active practice quiz interface w/ reusable question component & an explanation of why you got a question wrong if you did get it wrong. 
5. **Quiz Results** - Detailed results of the active quiz with AI explanations of incorrectly answered questions. 
6. **Settings** - User preferences, exam type selection, study goals
7. **Dashboard** - View your progress towards your study goals.
8. **Resource Library** - Additional study materials and external resources
9. **Agent History** - A history of all of the agentic actions that have been taken, organized into a vertical timeline with the most recet at the top. 
10. **Question Browser** - Browse the official list of questions, sorted by topic. 



## Project Schedule
### Oct 29
#### Estimates:
Rubric Items:
- [x] CI/CD pipeline
- [x] linting in pipeline
Features:
- [x] API and React projects created
- [x] Linting and testing are run in the pipeline on merge or push to main

### Nov 1
#### Estimates:
Rubric items:
- [x] Live production environment
- [x] authentication and user account support
- [x] authorized pages and public pages
- [x] create 2/4 generic layout components

Features:
- [x] kubernetes deployment files for the app
- [x] generic header component at the top with sign-in/sign-out button and a spot to display the users' username
- [x] set up oidc authentication, so that the user can sign in and sign out

### Nov 5
#### Estimates:
Rubric items:
- [x] authorized pages and public pages
- [x] 4+ generic layout components (I created two additional generic components)

Features:
- [x] landing page with header and basic info about the app
- [x] authenticated user page with header and a button to start a quiz
- [x] popup modal that confirms that a user wants to start a quiz
- [x] generic layout component that represents a quiz question

### Nov 8
#### Estimates:
Rubric items:
- [x] Network Calls that read and write data
- [x] tests run in pipeline, pipeline aborts if they fail

Features:
- [x] a database schema that can store the questions, categories, users, and user data
- [x] all the questions have been loaded into the database
- [x] tests which make the pipeline fail if they fail

### Nov 12
#### Estimates:
Rubric items:
- [x] 4+ generic layout component (added one generic layout component)
- [x] 3+ generic form input component (added one generic form input component)
- [x] Client side state stores (e.g. tanstack query or context)
- [x] Authentication and user account support

Features:
- [x] turn the component that renders multiple questions into a generic carousel component
- [x] add an API endpoint that adds points to a question's mastery count, based on whether a user has answered the question correctly
- [x] make the quiz question itself a generic form component that goes inside of the generic carousel component (it should have a button to check your answer inside of it, and this should make a request to the new mastery endpoint)
- [x] add a page that is shown at the end of a quiz that displays your score
- [x] set up server-side authentication to make it so that only authenticated users can send requests to the server

### Nov 15
#### Estimates:
Rubric items:
- [x] 10+ pages or views (add one page to the app)
- [ ] Tool call: 1+ action(s) require user confirmation to perform

Features:
- [x] Add a view that provides an overview of what you did correctly after a quiz submission
- [x] Add a zod object that represents a tool call that can be used to pass a tool call from the client to the server
- [ ] Add a function and associated tool call that allows the AI to select a subsection for the current quiz to use
- [ ] Make the tool call set the subsection of the quiz correctly

### Nov 19
#### Estimates:
Rubric items:
- [x] client side state stores (e.g. tanstack query or context)
- [x] extra credit: use browser storage
- [x] 10+ pages or views
- [x] Tool call: 1+ action(s) require user confirmation to perform

Features:
- [x] create a settings page that allows the user to select the license class
- [x] create a function that can retrieve and store the license class in browser storage
- [x] a context that can hold the license class that is being studied
- [x] a custom function and associated tool call on the frontend that can select a subsection to start a quiz on
- [x] frontend can start a new quiz, based on the AI feedback
- [x] a popup modal that allows the user to confirm the LLM's section choice before linking them to the quiz

### Nov 22
#### Estimates:
Rubric items:
- [x] Technology: Error handling (both on api requests and render errors)
- [x] Technology: Toasts / global notifications or alerts
- [x] 10+ pages/views via a router (Add 1 page)
- [x] 1+ actions that can be performed autonomously

Features:
- [x] Add an error boundary in main.tsx. 
- [x] Make a toast appear on every API and Rendering error in the frontend
- [x] an additional resources page to give the user more study materials
- [x] change the mastery values to be between 0 and 5 for each question
- [x] Add a tool call that automatically generates a progress report for each license class on the home screen when the user loads it (it will loop for each license class, calling the mastery endpoint and summing it up for each license class)

### Nov 25
#### Estimates:
Rubric items:
- [ ] 1+ action(s) can be performed autonomously
- [ ] streaming generation in the UI

Features:
- [ ] add a function in the frontend that can be called with a string argument to display an explanation of why an answer is incorrect
- [ ] add a tool call for this method that takes in the question object and the (incorrect) answer that the user gave
- [ ] modify the question component to display an explanation of why the user's answer is incorrect
- [ ] implement streaming generation from the backend to the frontend and use it on one of the pages that gets an AI response

### Dec 3
#### Estimates:
Rubric items:
- [ ] 1+ action(s) automatically adjust the UI when performed
- [ ] 

Features:
- [ ] 
- [ ]

### Dec 6
#### Estimates:
Rubric items:
- [ ] 
- [ ] 

Features:
- [ ]
- [ ]
