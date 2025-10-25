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
9. **History** - A list of all of the past quizzes you've taken, along with the date and time that each quiz was taken. 
10. **Question Browser** - Browse the official list of questions, sorted by topic. 
