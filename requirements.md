## Sending Images with my question correctness explanations

**Background:**
* In my app, the frontend can send tools backend. The backend takes these tools and gives them to the ai server. The AI server can then make a tool call, send it back to the frontend, and an actual function on the frontend can be called to vary the UI in some way. 
* I want a way for the tool calls for a specific user to be logged in a table in the database, and I want the user to be able to access them on a page in my website. 

**Steps:**
1. Create a table in the database that is directly attached to the user table. It will have 3 columns: user_id, timestamp, and toolcall_description. 
2. I want you to create a service called toolCallService in the services folder of the server. This service will contain two functions: one that adds tool call entries to the database, and another that returns all of the tool call entries in the database for a specific user. 
    * The function that stores tool calls takes in the object that contains the tool call that came from the AI. It creates a string that says what function was called and what the argument to that function was. This is the summary of the tool call. It gets the current timestamp. It makes an entry in the database for the current user with this message summary and timestamp. 
    * The function that returns all of the tool calls just makes a simple query to the database and returns all of the tool calls for that user. 
3. Make it so that the function that stores tool calls is called whenever the AI returns a tool call, so that every tool call that the AI makes is logged. 
4. Make a zod object that represents the tool call log on the backend and the frontend. 
5. Make an endpoint that calls the function that gets all of the tool calls. 
4. Make a query on the frontend that can call the endpoint in the backend that returns all of the tool calls for a user. 
4. Make a page in its own folder on the frontend called AIToolCallLogs.tsx, along with its own css module called AiToolCallLogs.module.css. Make it so that this page displays the tool calls for a user. When I navigate to this page, it should fetch all of the tool calls. 
    * Each tool call should be displayed in its own little card horizontally on desktop. When the page shrinks, it should rearrange the info in the tool call to put some of it above because the screen is narrower. These should be compact becasuse there will be many. 

**Rules:**
* Do not write any unnecessary markdown files or unnecessary comments. 
* Try to keep the code files short, around 100 lines (this is not a hard limit, just a reminder to be brief, not verbose). 
* DO these things with the minimal amount of code possible. I want this code to be simple and maintainable. 
* Use only tailwind css in the modules. Add classes like elsewhere in the app, but only add a minimal number of them to make the page look good and follow the design of the rest of the app. 