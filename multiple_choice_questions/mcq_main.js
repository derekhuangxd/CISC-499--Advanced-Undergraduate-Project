// main function for multiple choice question widget creator
// buttons in tool bar run functions add_mcq_code and hide_cell to add the code cell that creates widgets and furthermore hide the cell

define([
    'base/js/namespace',
    'base/js/events',
    'jquery',
    'require'
], function (
    Jupyter,
    events,
    $,
    requirejs) {
    

    // code that creates the radio button widget for multiple choice question
    // new line and tab in string input was a problem, so I had to go line by line to properly describe layout the code for correct python indentations
    runme = "# run me"
    l1 = "\nfrom ipywidgets import widgets, Layout, Box, GridspecLayout"
    l2 = "\ndef create_multipleChoice_widget(description, options, correct_answer):"
    l3 = "\n\tcorrect_answer_index = options.index(correct_answer)"
    l4 = "\n\tradio_options = [(words, i) for i, words in enumerate(options)]"
    l5 = "\n\talternativ = widgets.RadioButtons(options = radio_options, description = '', disabled = False,indent = False, align = 'center')"
    l6 = "\n\tdescription_out = widgets.Output()"
    l7 = "\n\tfeedback_out = widgets.Output()"
    l8 = "\n\twith description_out:"
    l9 = "\n\t\tprint(description)"
    l10 = "\n\tdef check_selection(b):"
    l11 = "\n\t\ta = int(alternativ.value)"
    l12 = "\n\t\tif a==correct_answer_index:"
    l13 = "\n\t\t\ts = 'correct!'"
    l14 = "\n\t\telse:"
    l15 = "\n\t\t\ts = 'Incorrect. The correct answer is: ' + correct_answer"
    l16 = "\n\t\twith feedback_out:"
    l17 = "\n\t\t\tfeedback_out.clear_output()"
    l18 = "\n\t\t\tprint(s)"
    l19 = "\n\t\treturn"
    l20 = "\n\tcheck = widgets.Button(description='check')"
    l21 = "\n\tcheck.on_click(check_selection)"
    l22 = "\n\treturn widgets.VBox([description_out, alternativ, widgets.HBox([check]), feedback_out], layout=Layout(display='flex',flex_flow='column',align_items='stretch',width='auto')) "
    mcq_code = runme+l1+l2+l3+l4+l5+l6+l7+l8+l9+l10+l11+l12+l13+l14+l15+l16+l17+l18+l19+l20+l21+l22;

    // default mcq function calls. Creator will change these to describe their questions
    intro = "\n# Use these function calls to create your multiple choice questions. \n# Number of options can be edited. Final parameter describes the correct answer and must match the string seen in the list"
    Q1 = "\nQ1 = create_multipleChoice_widget('1. Question', ['o1', 'o2', 'o3', 'o4'], 'o1')"
    Q2 = "\nQ2 = create_multipleChoice_widget('2. Question', ['o1', 'o2', 'o3', 'o4'], 'o1')"
    Q3 = "\nQ3 = create_multipleChoice_widget('3. Question', ['o1', 'o2', 'o3', 'o4'], 'o1')"
    Q4 = "\nQ4 = create_multipleChoice_widget('4. Question', ['o1', 'o2', 'o3', 'o4'], 'o1')"
    Q5 = "\nQ5 = create_multipleChoice_widget('5. Question', ['o1', 'o2', 'o3', 'o4'], 'o1')"
    Q6 = "\nQ6 = create_multipleChoice_widget('6. Question', ['o1', 'o2', 'o3', 'o4'], 'o1')"
    Q7 = "\nQ7 = create_multipleChoice_widget('7. Question', ['o1', 'o2', 'o3', 'o4'], 'o1')"
    Q8 = "\nQ8 = create_multipleChoice_widget('8. Question', ['o1', 'o2', 'o3', 'o4'], 'o1')"
    Q9 = "\nQ9 = create_multipleChoice_widget('9. Question', ['o1', 'o2', 'o3', 'o4'], 'o1')"
    Q10 = "\nQ10 = create_multipleChoice_widget('10. Question', ['o1', 'o2', 'o3', 'o4'], 'o1')"
    question_list = runme+intro+Q1+Q2+Q3+Q4+Q5+Q6+Q7+Q8+Q9+Q10; 


    // function that adds the code into the bottom of the notebook
    function add_mcq_code() {
        Jupyter.notebook.insert_cell_above('code').set_text(mcq_code); // Insert code cell
        Jupyter.notebook.select_prev();                                // select it
        for (var i=0; i<1000; i++)
            Jupyter.notebook.move_selection_down();                    // mode it to the bottom
        Jupyter.notebook.execute_cell();                               // run it
        Jupyter.notebook.insert_cell_above('code').set_text(question_list);  // Insert default questions
        Jupyter.notebook.select_prev();                                      // select it
        Jupyter.notebook.execute_cell();                                     // run it
    } 


    // function that runs the bottom two cells, then hides them
    function hide_cell() {
        var cell = IPython.notebook.get_selected_cell();  
        for (var i=0; i<1000; i++)
            Jupyter.notebook.select_next();    // Keep selecting the next cell until we get to the bottom
        Jupyter.notebook.execute_cell();       // you're on the last cell, run it
        var cell = IPython.notebook.get_selected_cell();  
        cell.element.toggleClass('hidden');    // hide it
        Jupyter.notebook.select_prev();        // select the one above (template questions)                           
        Jupyter.notebook.execute_cell();       // run it
        var cell = IPython.notebook.get_selected_cell();
        cell.element.toggleClass('hidden');    // hide it
    }

    // Add Button to the nav bar
    var createToolbarButton = function () {

        var btn = '<div class="btn-group" role="toolbar">\
        <button class="btn btn-default" id="add_mcq" href="#">\
        <img src="https://i.ibb.co/qCCpxYp/mcq.png" alt="mcq" width="22px">\
        </button>\
        <button class="btn btn-default" id="hide" href="#">\
        <i class="fa fa-minus-circle"></i></button>\
        </div>'
        $("#maintoolbar-container").append(btn);
        $("#add_mcq").on('click', function() {add_mcq_code();})
        $("#hide").on('click', function() {hide_cell();})
    };


    function load_ipython_extension() {
        createToolbarButton();
    }
    return {
        load_ipython_extension: load_ipython_extension
    };
});