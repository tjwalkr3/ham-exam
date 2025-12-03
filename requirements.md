## Sending Images with my question correctness explanations

**Background:**
* In my app, if I get a question wrong, it currently sends a request to the AI, giving it the choice to respond to the user with a tool call that is used to display an explanation of why the question was answered incorrectly. 
* In the Ham radio license exam, several questions have associated images. These images are diagrams that contain information that is necessary for the user to be able to answer the question. 
* Currently, my app has no way of displaying these images.

**Steps:**
* In a python script, create a list of tuples that match question names to image URLs. This should be done for all three license classes, which have the following corresponding pages (each page contains all of the questions and images necessary to map images for an entire license class).
    * https://hamexam.org/view_pool/18-Technician
    * https://hamexam.org/view_pool/19-General
    * https://hamexam.org/view_pool/20-Extra
* In the same python script, create a new folder at the root of the repo called figures and download all of the images into this folder. 
* In the same Python script, create a new column called figure in the question table of the schema.sql file (it should be the last column in this table). This column will contain the file name of the image that goes with that question (if the question has one). 
* In the same Python script, add the file name (retrieved from the url in the list of tuples from step 1) to all of the questions in the question table that have figures associated with them. 
* After this, modify the zod object in the frontend and backend that represents a question so that it has a figure field (a string). 
* Make sure that the folder of images is copied into the nginx container for the frontend. 
* Now make it so that the component that represents a question can get this image and display it right above the question text. This should take minimal code. 
* Stop here and await further instructions about how to send the image to the LLM. 

**Rules:**
* Do not write any unnecessary markdown files or unnecessary comments. 
* Try to keep the code files short, around 100 lines (this is not a hard limit, just a reminder to be brief, not verbose). 