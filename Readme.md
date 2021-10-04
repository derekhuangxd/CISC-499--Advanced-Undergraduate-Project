# Jupyter Notebook Extensions For Teaching and Learning
![image](https://user-images.githubusercontent.com/55966810/135778838-a3c08c8f-f5b6-46ea-9878-524969f1872d.png)
- Implemented **6 Extensions** for Jupyter Notebook
- Group Project for Advanced Undergrauate Project course

Programming Environment
--------------------------
- HTML
- CSS
- JavaScript


Group Members:
--------------------------
- Derek Huang
- Jenny Sun
- Andrea Mitchell

## Installation:
Make sure you have **Jupyter Notebook** and **Git** installed first. 

In command/terminal:

First download this collection and cd to the folder: 
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
If already installed the nbextension configurator, can also enable/disable the extensions in the nb extension dashboard tab:
![image](https://user-images.githubusercontent.com/67336024/115161900-2c98f300-a06e-11eb-8637-f6c1987e1b3b.png)

List of all extension installment convenient copy paste:
```
jupyter nbextension install template --user
jupyter nbextension install ShortAnswerQuestion --user
jupyter nbextension install multiple_choice_questions --user
jupyter nbextension install highlight_and_colour --user
jupyter nbextension install move_to_top_bottom --user
jupyter nbextension install annotate_text --user
```

```
jupyter nbextension enable template/main --user
jupyter nbextension enable ShortAnswerQuestion/main --user
jupyter nbextension enable multiple_choice_questions/mcq_main --user
jupyter nbextension enable highlight_and_colour/highlight_and_colour --user
jupyter nbextension enable move_to_top_bottom/main --user
jupyter nbextension enable annotate_text/main --user
```
