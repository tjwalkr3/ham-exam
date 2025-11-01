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
Rubric items:
- CI/CD pipeline
- linting in pipeline

Features:
- API and React projects created
- Linting and testing are run in the pipeline on merge or push to main

#### Delivered
Rubric Items:
- [x] CI/CD pipeline
- [x] linting in pipeline
Features:
- [x] API and React projects created
- [x] Linting and testing are run in the pipeline on merge or push to main

### Nov 5
#### Estimates:
Rubric items:
- [x] Live production environment
- [ ] authentication and user account support
- [ ] authorized pages and public pages
- [ ] 4+ generic layout components

Features:
- [x] kubernetes deployment files for the app
- [ ] header at the top with sign-in/sign-out button and a spot to display the users' email address
- [ ] landing page with header and basic info about the app
- [ ] authenticated user page with header and a button to start a quiz
- [ ] set up oidc authentication, so that the user can sign in and sign out

#### Delivered
Rubric Items:
Features:

### Nov 8
#### Estimates:
Rubric items:
- [ ] Network Calls that read and write data
- [ ] tests run in pipeline, pipeline aborts if they fail

Features:
- [ ] a database schema that can store the questions, categories, users, and user data
- [ ] the questions have been loaded into the database
- [ ] tests which make the pipeline fail if they fail

#### Delivered
Rubric Items:
Features:

### Nov 12
#### Estimates:
Rubric items:
- [ ] 4+ generic layout component
- [ ] 3+ generic form input component

Features:
- [ ] reusable component for rendering the question
- [ ] reusable component for the whole page
- [ ] a page to hold the rendered questions

#### Delivered
Rubric Items:
Features:

### Nov 15
#### Estimates:
Rubric items:
- [ ] Network Calls that read and write data

Features:
- [ ] api can return the list of topics with associated levels of mastery
- [ ] api can return a list of questions in a given group
- [ ] api can return an explanation for a question that was answered incorrectly
- [ ] a tanstack query on the frontend that can call the list of topics endpoint
- [ ] a tanstack query on the frontend that can call the list of questions endpoint 
- [ ] a tanstack query on the frontend that can get the explanation for an incorrect answer

#### Delivered
Rubric Items:
Features:

### Nov 19
#### Estimates:
Rubric items:
- [ ] client side state stores (e.g. tanstack query or context)
- [ ] 10+ pages or views
- [ ] 1+ action(s) require user confirmation to perform
- [ ] 1+ action(s) automatically adjust the UI when performed

Features:
- [ ] a context with useStates in it that can store the section that is being studied and the quiz type (default to technician class)
- [ ] a custom function and associated tool call on the frontend that can start a new quiz (requires user confirmation before opening the quiz page)
- [ ] a popup modal that allows the user to confirm the LLM's section choice before linking them to the quiz

#### Delivered
Rubric Items:
Features:

### Nov 22
#### Estimates:
Rubric items:
- [ ] 1+ action(s) can be performed autonomously
- [ ] 1+ action(s) automatically adjust the UI when performed

Features:
- [ ] a custom function and associated tool call on the frontend that allows the ai to autonomously get the next question in the series (stops the loop when the user has reached 10 questions)
- [ ] a custom function and associated tool call that redirects the user to a report that is generated based on the results of the quiz (explains correct answers for questions tha were answered incorrectly)

#### Delivered
Rubric Items:
Features:

### Nov 25
#### Estimates:
Rubric items:
- [ ] 10+ pages/views via a router
- [ ] 

Features:
- [ ] an additional resources page to give the user more study materials
- [ ] A settings page where the user can set the current exam type (technician, general, and extra)

#### Delivered
Rubric Items:
Features:

### Dec 3
#### Estimates:
Rubric items:
- [ ] 
- [ ] 

Features:
- [ ] 
- [ ] 

#### Delivered
Rubric Items:
Features:

### Dec 6
#### Estimates:
Rubric items:
- [ ] 
- [ ] 

Features:
- [ ] 
- [ ] 

#### Delivered
Rubric Items:
Features:

