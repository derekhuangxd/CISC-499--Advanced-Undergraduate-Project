
Highlight and Text Colour 
--------------------------

This extension provides a user friendly system to colour and highlight words in a markdown cell. It has a vast range of colours for highlighting, as well as text colour. The dropdown functionality creates a familiar look and feel and it is easy to use. The functionality works perfectly when used in an unrendered edit mode cell, and it has some small problems in the rendered version which are described below. The None button at the top of the dropdowns can be used to remove the colouring either for one highlighted item, by selecting the item, then clicking none. If nothing is selected and you click none, it will remove all the colouring (highlight and text colour) from the entire cell. 

Colours can all be modified in the unrendered markdown text if desired. They are simply HTML spans surrounding the coloured word(s). The highlight colours are encoded by the classes "r_hl" which stands for "red highlight"; and the text colours are encoded by the classes "r_tc" standing for "red text colour". 

The colours classes are simply: {red: r, orange: o, yellow: y, green: g, blue: b, purple: p}. 


Limitations Include: 
-------------------

1. Must select word from LEFT TO RIGHT.
2. If you have the exact same sentence twice it will highlight the first one.
3. Any markdown text with "< s" (no space) will break the funtion.
4. Cannot highlight across paragraphs or full paragraphs. Needs to be one paragraph at a time if you desire the whole thing to be highlighted, and must be done in edit mode.
5. You CANNOT highlight or colour over something already modified. 
6. To unhighlight or uncolour, need to select over the text EXACTLY where the highlighting starts and ends. 

Highlighting and Colouring in edit mode will always work. To uncolour, you can always use edit mode and delete the spans manually. 

For the rendered cell colour function, the function works by selecting the desired part to colour along with the remainder of the sentence, so that it can compare the full sentence string to the text in the cell. This usually solves the problem of finding the right word(s) to colour. However, if you are colouring at the end of a sentence, and the desired word or phrase is written above ALSO at the end of a sentence, it will colour the previous one. For the most part, this won't be a problem, and can be fixed easily by selecting the text in the UNRENDERED edit version of the cell. 

Conclusion:
-----------

If the highlighting doesn't find what it wants to, just go into edit mode and it will work there instead. Please keep in mind the Left to Right problem, that will cause problems. 

