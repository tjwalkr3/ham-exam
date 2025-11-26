# Question component tool-calling

## Background information
* This is an app that is a ham radio study help. 
* Currently, I have the ability to start a quiz. 
* There is a carousel that holds a collection of components (one for each question). 
* Whenever the user gets a question right, it lights up in green, when wrong, it light up red. 
* The questions are fetched by the backend from a database, and mastery points associated with a question are tracked in the database (changed after each question is answered). 

## Steps
**Step 1:** 
* add a function in the frontend that can be called with a string argument to display an explanation under a question

**Step 2:**
* add a tool call for the newly created method in step 1
  * this tool call should include the question that was asked, along with all of the answer choices
  * it should also include the answer that was chosen by the user
  * every time a user answers a question, a request is sent to the AI
  * the AI should be given the choice of whether or not it should call the function from step 1
  * the system prompt should tell it only to call the function if the user answered incorrectly, otherwise, do nothing at all
  * the explanation of why the user is wrong should be in plain text (not markdown), and it should only be 1-2 sentences. 
  * Only modify code in the tool calls file and the Component that represents a question. 

**Step 3:**
* there should be a small spinner that appears while the AI is deciding what to do
* It should go away once the AI decides what to do (whether it does nothing, or offers an explanation of why the user is wrong)
* If it makes more sense (from a clean-code standpoint, you may extract a spinner component, because spinners are already being used in the app in multiple places). 

## Rules
1. Do not implement more than the functionality I've outlined in this document. 
2. Do not create unnecessary markdown documentation or comments. 
3. Keep the code you're writing simple, sleek, and easy to understand (including the styles). 