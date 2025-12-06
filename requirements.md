## Subsections Page

**Background**
* Currently, in this app, I can allow a user to start a quiz based on an algorithm with the start quiz button, but there is no option to start a quiz manually. 
* There is currently an API endpoint that allows the user to get a list of masteries for all subsections in their current license class. I have also creates a hook that calls this endpoint called useSubsectionMasteries. 

**Steps**
1. Create a new page that contains a vertical list that can contain the different subsections and their associated masteries. 
  * Each subsection and its mastery level should be in a small, skinny card that stretches horizontally. 
  * Inside of this card, on desktop, there should be a simple progress bar with a percentage in front of it that is aligned to the right side of the card. The name of the subsection should be aligned to the left side of the card. 
  * On mobile, the name of the subsection should go above the progress bar and they should both be aligned left. 
2. Use the useSubsectionMasteries to get the list of subsections. 
3. There should be a loop that renders these cards for the collection of subsections. 
4. When one of these cards is clicked, it should link to the quiz for that particular subsection. 
5. There should be a route (subsections) added for this page. 
6. A menu entry for this page should be added to the side bar. 

**Rules**
* Add all styles inside of a css module in this page's folder. 
* Only use tailwind styles in this css module. 
* Do not create unnecessary markdown docs or unnecessary comments. 
* DO not make the logic in this page unnecessarily complex, do it simply. 
