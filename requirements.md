## Subsections Page

**Background**
* Currently, the /user page has a vertical collection of cards in it. I want one of these cards to hold a countdown timer in it. 
* I want everything related to this countdown timer to be contained within the component that goes inside of this card. 
* I need a fourth tool call to fulfill the requirements of this assignment, so I want the countdown timer to be initiated with a tool call. 

**Steps**
1. Create a new page that contains a vertical list that can contain the different subsections and their associated masteries. 
  * Create a new card component (an instance of the one that I made). 
  * Create a countdown timer and a generic date/time selector in the card. 
  * The card header should say "Time Until Exam". 
  * Make a function that can be called to start the live countdown timer. 
  * Make a tool call that can call this function. It should be able to take in the time the user selected and call the function that starts the timer. 
  * Wire everything together, so that the user can pick a time, and it initiates a tool call that automatically sets (or resets) the timer. 

**Rules**
* Add all styles inside of a css module in this component's folder. 
* Only use tailwind styles in this css module. 
* Do not create unnecessary markdown docs or unnecessary comments. 
* DO not make the logic in this page unnecessarily complex, do it simply. 
* There should not be many lines of code for this, and lines of code should be simple and easy to understand. 
