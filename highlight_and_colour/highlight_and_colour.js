/* 
--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------
---------------------------------------- functions -----------------------------------------------
--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------
*/



/* Function that preforms act of highlighting. Takes in the text to be highlighted along with the style that is the css class 
which will colour or highlight it the desired colour. Return the same text that is inputted with <spans> surrounding it. */
function highlight(text, colour) {
    var internal_text = text.trim(); // trim so you don't highlight white spaces
    return text.replace(/(\S[\S\s]*\S)/,'<span class='+'"'+colour+'"'+'>'+internal_text+'</span>') 
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
    var text = text.replace(/<span class=(?:"r_hl"|"o_hl"|"y_hl"|"g_hl"|"b_hl"|"p_hl")>/g, "");
    var text = text.replace(/<span class=(?:"r_tc"|"o_tc"|"y_tc"|"g_tc"|"b_tc"|"p_tc")>/g, "");
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
function highlightInCmdMode(colour) {
    var cell = IPython.notebook.get_selected_cell();

    var selectedText = window.getSelection();    // selection object to highlight
    var selected_word = selectedText.toString(); // string to highlight
    
    selectedText.modify("extend", "forward", "sentence");     // modify selection to extend it to the full sentence
    var selected_sentence = window.getSelection().toString(); // string sentence around string to highlight

    var cell_text = cell.get_text();                // string of text in cell
    var cell_text_clean = removeSpans(cell_text);   // remove all the spans in the text since otherwise it wouldn't match the selected sentence
    
    var start = cell_text_clean.indexOf(selected_sentence); // index of the selected sentence (first word is the part to highlight)
    
    if (start == -1) { // if it doesn't find it (can't figure out why it sometimes doesn't)
        var new_text = cell_text.replace(selected_word, highlight(selected_word,colour)); // do it without properly aligning for correct word
                                                                                          // wont always work properly but it's better than nothing
    } else {
        var start = findCorrectIndex(cell_text, start);         // adjust start index to account for the spans that were previously removed
        var end = start + selected_word.length;                 // end index is just the start index plus the length of selection to highlight
        var new_text = replaceAt(start, end, cell_text, highlight(selected_word,colour));  // replace the cell_text with the selected word highlighed in the right spot!
    }
    cell.set_text(new_text);  
    cell.render();
    return false;
}


/* Manipulate text in edit mode, simply highlight the word that was selected. Code mirror has built in getSelection and replaceSelection
methods that makes this really simple. */
function highlightInEditMode(colour) {
    var cell = IPython.notebook.get_selected_cell();
    var cm = cell.code_mirror;
    var selectedText = cm.getSelection();
    cm.replaceSelection(highlight(selectedText,colour));
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
        var regex = new RegExp('<span class=(?:"r_hl"|"o_hl"|"y_hl"|"g_hl"|"b_hl"|"p_hl")>'+selectedTextEscaped+'</span>');
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
        var regex = new RegExp('<span class=(?:"r_tc"|"o_tc"|"y_tc"|"g_tc"|"b_tc"|"p_tc")>'+selectedTextEscaped+'</span>');
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
var hl = '<div class="new_buttons">\
<div class="btn-group" role="toolbar">\
<button class="btn btn-default" id="higlighter_menu" href="#">\
<img src="https://i.ibb.co/VC24v7f/Highlighter-Icon.png" alt="Highlighter-Icon" width="18px">\
</button>\
</div>\
<div id="submenu_hl" class="hl_dropdown_content">\
<button href="#" id="remove_highlights"><i class="fa fa-times" style="padding:2px;"></i>none</button>\
<button href="#" class="r_hl" id="b1"></button>\
<button href="#" class="o_hl" id="b2"></button>\
<button href="#" class="y_hl" id="b3"></button>\
<button href="#" class="g_hl" id="b4"></button>\
<button href="#" class="b_hl" id="b5"></button>\
<button href="#" class="p_hl" id="b6"></button>\
</div>\
</div>'  

$("#maintoolbar-container").append(hl); // add highlight object to the tool bar
$("#submenu_hl").hide();  // initially hide the submenu

$("#higlighter_menu")
    .on('click', function() {
        $("#submenu_hl").toggle(); // When clicked it toggles between hide and show
    })
    .attr('title', 'Highlight Selected Text'); // description shown in little box

$("#b1").on('click', function() {highlightText("r_hl");$("#submenu_hl").hide();})
$("#b2").on('click', function() {highlightText("o_hl");$("#submenu_hl").hide();})
$("#b3").on('click', function() {highlightText("y_hl");$("#submenu_hl").hide();})
$("#b4").on('click', function() {highlightText("g_hl");$("#submenu_hl").hide();})
$("#b5").on('click', function() {highlightText("b_hl");$("#submenu_hl").hide();})
$("#b6").on('click', function() {highlightText("p_hl");$("#submenu_hl").hide();})


$("#remove_highlights")
    .on('click', function() {removeHighlights();$("#submenu_hl").hide();})
    .attr('title', 'Remove highlightings in selected cell');


// tc for text colour  ------------------------------------------------------------------------------------

var tc = '<div class="new_buttons">\
<div class="btn-group" role="toolbar">\
<button class="btn btn-default" id="colour_menu" href="#">\
<img src="https://i.ibb.co/dDqJz9M/Text-Colour.png" alt="Text-Colour" width="18px">\
</button>\
</div>\
<div id="submenu_tc" class="hl_dropdown_content">\
<button href="#" id="remove_colour"><i class="fa fa-times" style="padding:2px;"></i>none</button>\
<button href="#" style="background-color:#f94144;" id="b12"></button>\
<button href="#" style="background-color:#f9844a;" id="b22"></button>\
<button href="#" style="background-color:#e9c46a;" id="b32"></button>\
<button href="#" style="background-color:#90be6d;" id="b42"></button>\
<button href="#" style="background-color:#4361ee;" id="b52"></button>\
<button href="#" style="background-color:#560bad;" id="b62"></button>\
</div>\
</div>'  

$("#maintoolbar-container").append(tc); // add text colour object to the tool bar
$("#submenu_tc").hide(); // initially hide the submenu

$("#colour_menu")
    .on('click', function() {
        $("#submenu_tc").toggle(); // When clicked it toggles between hide and show
    })
    .attr('title', 'Change Text Colour');

$("#b12").on('click', function() {highlightText("r_tc");$("#submenu_tc").hide();})
$("#b22").on('click', function() {highlightText("o_tc");$("#submenu_tc").hide();})
$("#b32").on('click', function() {highlightText("y_tc");$("#submenu_tc").hide();})
$("#b42").on('click', function() {highlightText("g_tc");$("#submenu_tc").hide();})
$("#b52").on('click', function() {highlightText("b_tc");$("#submenu_tc").hide();})
$("#b62").on('click', function() {highlightText("p_tc");$("#submenu_tc").hide();})

$("#remove_colour")
    .on('click', function() {removeTextColour();$("#submenu_tc").hide();})
    .attr('title', 'Remove text colour in selected cell');


} // end build_toolbar

//******************************* MAIN FUNCTION **************************


define(["require",
    'base/js/namespace'
], function(require, Jupyter) {


		var load_css = function(name) {
	        var link = document.createElement("link");
	        link.type = "text/css";
	        link.rel = "stylesheet";
	        link.href = require.toUrl(name);
	        $("head")[0].appendChild(link); 
    	};

    	load_css('./highlight_and_colour.css')

    	build_toolbar();




    
    return {
        load_ipython_extension: load_ipython_extension
    };
});

