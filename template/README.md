Template Cell
=========
This extension allows user to insert and run a template cell after the current cell. 

## Description:
By clicking the pencil button, the notebook will insert a pre-set template cell below current cell. Template content need to be modified within "template/main.js". By clicking the box button, it will update the template content with the current cell.

## Limitations/open problems: 
- Default template content need to be changed within the source code file. 
- The update function only works within same notebook, and updated template will be removed after reloading.

## Installation:
First download this collection and cd to the folder:
In command/terminal:
```
git clone https://github.com/JennySUNNN/CISC499-jupyternotebook-extension.git
cd CISC499-jupyternotebook-extension
```
Next, install the extension you want:
e.g. 'template' extension
```
jupyter nbextension install template --user
```
Last, enable the extension:
```
jupyter nbextension enable template/main --user
```
