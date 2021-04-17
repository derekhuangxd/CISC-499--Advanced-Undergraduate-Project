/* 
--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------
---------------------------------------- functions -----------------------------------------------
--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------
*/



/* Function that preforms act of highlighting. Takes in the text to be highlighted along with the style that is the css class 
which will colour or highlight it the desired colour. Return the same text that is inputted with <spans> surrounding it. */
function highlight(text, style) {
    var internal_text = text.trim(); // trim so you don't highlight white spaces
    Jupyter.notebook.insert_cell_below('code',1000).set_text(internal_text+': \n\n');
    return text.replace(/(\S[\S\s]*\S)/,'<span class='+'"'+style+'"'+'>'+internal_text+'</span>') 
}

/* Function that replaces a word based in an index range. Takes in a start index, end index, a string, and a replacement string. 
It returns the string with the replacement string between the range i to j. */
function replaceAt(i, j, text, replacement) {
  var prefix = text.slice(0,i);
  var suffix = text.slice(j);
  return prefix + replacement + suffix; 
}

/* Counts the number of times that "<s" appears in the inputted text */
function countSpans(text) {
    var match_list = text.match(/<s/g); // text.match() returns an array of all the matches of the regex found in the text
    if (match_list == null) {
        return 0
    } 
    return match_list.length  // counting number of matches so return length
}


/* function that removes all the spans from inputted text string. Removes both the highlight spans and the text colour spans */
function removeSpans(text) {
    var text = text.replace(/<span class=(?:"y_hl")>/g, "");
    var text = text.replace(/<span class=(?:"y_tc")>/g, "");
    var text = text.replace(/<\/span>/g, "");
    return text;
}


/* Counts the number of spans that come before the starting index so that it can account for that offset of the index. Each span
statement has 26 characters which is why we are shifting over by 26*(number of spans found). This is done using a loop which starts 
at the given start value, and adds 26 characters based on whether it found a span or not. i+1 accounts for that we are searching for
a <s which is two characters long. */
function findCorrectIndex(cell_text, start){
    var i = start;
    prev = countSpans(cell_text.slice(0, i+1))  // prev is the number of spans before start index  
    if (prev != 0) {     // we have spans before, which means that we need to shift
        i = i + 26*prev  // start by shifting over 26*(number of spans we found initially)
        curr = countSpans(cell_text.slice(0, i+1))   // number of spans after range has been extended to account for previous spans
        while (prev != curr) {        // we found one or more new spans after shifting
            difference = curr - prev; // count how many new spans we found
            prev = countSpans(cell_text.slice(0, i+1))                     // recount number of spans at i
            curr = countSpans(cell_text.slice(0, i+1+(26*difference)))     // count how many spans after we have extended again
            i = i + 26*difference;    // shift i over
        }
        return start + 26*prev;       // prev tells you how many spans were found. offset index by 26 times that number

    } else {
        return start // no spans found before the start index, so no need to offset
    }
}

/* Function that manipulates the text while in command mode (rendered version of the cell). This is a challenge since it 
finds the desired text to highlight through window.getSelection, which doesn't give the index of the desired word, it just finds the 
string. */
function highlightInCmdMode(scheme) {
    var cell = IPython.notebook.get_selected_cell();

    var selectedText = window.getSelection();    // selection object to highlight
    var selected_word = selectedText.toString(); // string to highlight


    
    selectedText.modify("extend", "forward", "sentence");     // modify selection to extend it to the full sentence
    var selected_sentence = window.getSelection().toString(); // string sentence around string to highlight

    var cell_text = cell.get_text();                // string of text in cell
    var cell_text_clean = removeSpans(cell_text);   // remove all the spans in the text since otherwise it wouldn't match the selected sentence
    
    var start = cell_text_clean.indexOf(selected_sentence); // index of the selected sentence (first word is the part to highlight)   
    var start = findCorrectIndex(cell_text, start);         // adjust start index to account for the spans that were previously removed
    var end = start + selected_word.length;                 // end index is just the start index plus the length of selection to highlight

    var new_text = replaceAt(start, end, cell_text, highlight(selected_word,scheme));  // replace the cell_text with the selected word highlighed in the right spot!
    cell.set_text(new_text);  
    cell.render();
    return false;
}


/* Manipulate text in edit mode, simply highlight the word that was selected. Code mirror has built in getSelection and replaceSelection
methods that makes this really simple. */
function highlightInEditMode(scheme) {
    var cell = IPython.notebook.get_selected_cell()
    var cm = cell.code_mirror
    var selectedText = cm.getSelection()
    cm.replaceSelection(highlight(selectedText,scheme))
    return false;
}

/* Button found under highlights tab that says x none. If a highlighed word is selected, it will remove the spans around that specifc text.
if nothing is selected, it will remove all the highlights AND text colour from everything. */

function removeHighlights() {
    var cell = IPython.notebook.get_selected_cell();
    var cell_text = cell.get_text(cell_text);    
    var selectedText = window.getSelection().toString();

    if (selectedText.length == 0) {
        var new_text = removeSpans(cell_text); // nothing is selected, remove all the spans
    }
    else {
        var selectedTextEscaped = selectedText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var regex = new RegExp('<span class=(?:"y_hl")>'+selectedTextEscaped+'</span>');
        var new_text = cell_text.replace(regex, selectedText);   
    }
    cell.set_text(new_text);
    cell.render();
}

/* Button found under text colour tab that says x none. If a coloured word is selected, it will remove the spans around that specifc text.
if nothing is selected, it will remove all the highlights AND text colour from everything. */
function removeTextColour() {
    var cell = IPython.notebook.get_selected_cell();
    var cell_text = cell.get_text(cell_text);    
    var selectedText = window.getSelection().toString();

    if (selectedText.length == 0) {
        var new_text = removeSpans(cell_text); // nothing is selected, remove all the spans
    }
    else {
        var selectedTextEscaped = selectedText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var regex = new RegExp('<span class=(?:"y_tc")>'+selectedTextEscaped+'</span>');
        var new_text = cell_text.replace(regex, selectedText);   
    }
    cell.set_text(new_text);
    cell.render();
}


/* Buttons call this function to highlight and manipulate text colour */
function highlightText(scheme) {
    var cell = IPython.notebook.get_selected_cell();
    var rendered = cell.rendered; // has the cell been run or not (rendered == true means it has been run)
    if (rendered) { 
        highlightInCmdMode(scheme);
    }
    else {
        highlightInEditMode(scheme);
    }

}


/* 
--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------
--------------------------------- Create the Buttons ---------------------------------------------
--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------
*/

function build_toolbar () {

// hl for highlighter ----------------------------------------------------------------------------

var hl = '<div class="nina">\
<div class="btn-group" role="toolbar">\
<button class="btn btn-default" id="higlighter_menu" href="#">\
<i class="fa fa-comments"></i>\
</button>\
</div>\
<div id="submenu_hl" class="hl_dropdown_content">\
<button href="#" id="remove_highlights"><i class="fa fa-times" style="padding:2px;"></i>none</button>\
<button href="#" class="y_hl" id="b3"></button>\
</div>\
</div>'  

$("#maintoolbar-container").append(hl); // add highlight object to the tool bar
$("#submenu_hl").hide();  // initially hide the submenu

$("#higlighter_menu")
    .on('click', function() {
        $("#submenu_hl").toggle(); // When clicked it toggles between hide and show
    })
    .attr('title', 'Annotate Text (Add Comment)'); // description shown in little box


$("#b3").on('click', function() {highlightText("y_hl");$("#submenu_hl").hide();})


$("#remove_highlights")
    .on('click', function() {removeHighlights();$("#submenu_hl").hide();})
    .attr('title', 'Remove highlightings in selected cell');



} // end build_toolbar


//******************************* MAIN FUNCTION **************************
/*
define(["require",
    'base/js/namespace'
], function(require, Jupyter) {

    var security = require("base/js/security")

    var load_css = function(name) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl(name);
        document.getElementsByTagName("head")[0].appendChild(link);

    };

    //Load_ipython_extension
    var load_ipython_extension = require(['base/js/namespace'], function(Jupyter) {
        "use strict";
        if (Jupyter.version[0] < 3) {
            console.log("This extension requires Jupyter or IPython >= 3.x")
            return
        }

        console.log("[highlighter] Loading highlight_and_colour.css");
        load_css('./highlight_and_colour.css')



        build_toolbar();

        var _on_reload = true; 
    


       
        $([Jupyter.events]).on('status_started.Kernel', function() {

            //highlighter_init_cells();
            console.log("[highlighter] reload...");
            _on_reload = false;
        })

    }); //end of load_ipython_extension function

    return {
        load_ipython_extension: load_ipython_extension,
    };
}); //End of main function


console.log("Loading ./highlight_and_colour.js");

*/
define(["require",
    'base/js/namespace'
], function(require, Jupyter) {


		var load_css = function(name) {
	        var link = document.createElement("link");
	        link.type = "text/css";
	        link.rel = "stylesheet";
	        link.href = require.toUrl(name);
	        $("head")[0].appendChild(link); //document.getElementsByTagName("head")[0].appendChild(link);

    	};

    	load_css('./annotate_text.css')

    	build_toolbar();



    
    return {
        load_ipython_extension: load_ipython_extension
    };
});

