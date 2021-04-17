MCQ Creator Cell
=========
Adds a button with the functionality that adds a new cell with code that allows you to create multiple choice questions. 


How to Use:
-----------------
1. The professor clicks the Add MCQ button. 
2. At the bottom of the notebook, two code cells appear:
		- the function create_multipleChoice_widget()
		- code cell with 10 question templates they can use
3. The professor is to replace the question templates with their own code
4. Throughout the notebook, the professor can add Q1, Q2, etc. in code cells
5. When students open the notebook, they must click the minus circle button. This has a "run and hide" functionality. When clicked, it runs the last two code cells in the notbook, and hides them. 
6. As student go through the notebook, they can run the question cells which will be individual cells throughout the notebook that say Q1, Q2, etc. 


Limitations:
----------------
1. Options cannot be multi-line
2. For the "run and hide" button, the two code cells must remain at the bottom of the notebook
3. Notebook can't have more than 1000 cells :P