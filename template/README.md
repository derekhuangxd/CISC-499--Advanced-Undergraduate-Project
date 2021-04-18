Template Cell
=========
This extension allows user to insert and run a template cell after the current cell. 

## Description:
Template content need to be modified within "template/main.js". 
Open the javascript file and find this area, change the template cell type and content: (please do not modifiy other code)
![image](https://user-images.githubusercontent.com/67336024/115163763-e5642f80-a078-11eb-871a-14cb90ef1185.png)

By clicking the pencil button, the notebook will insert a pre-set template cell below current cell. 
By clicking the box button, it will update the template content with the current cell.

## Limitations/open problems: 
- Default template content need to be changed within the source code file. 
- The update function only works within same notebook, and updated template will be removed after reloading.

