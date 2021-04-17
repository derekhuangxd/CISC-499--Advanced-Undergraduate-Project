// file ShortAnswerQuestion/main.js

define([
    'base/js/namespace',
    'base/js/events',
    'require',
    'jquery'

], function (
    Jupyter,
    events,
    requirejs,
    $
) { 
    "use strict"

    /**
     * create_question function set the current selected cell to a question cell
     * add a group of cells after it.
     */
    function create_question() { 
        var questionCell = Jupyter.notebook.get_selected_cell();
        addGroup(questionCell)
    }

    var idx = 0;
    /**
     * addGroup function insert an answerCell and a solutionCell below the questionCell.
     * Add a solution button to answerCell.
     * Add tags element to answer and solution.
     * @param {*} questionCell 
     */
    function addGroup(questionCell) {
        idx += 1;

        var solutionCell = Jupyter.notebook.insert_cell_below('code');
        var answerCell = Jupyter.notebook.insert_cell_below('code');

        questionCell.metadata.groupNum = idx;
        answerCell.metadata.groupNum = idx;
        solutionCell.metadata.groupNum = idx;

        questionCell.metadata.type = 'question';
        answerCell.metadata.type = 'answer';
        solutionCell.metadata.type = 'solution';

        questionCell.element.addClass("question");
        answerCell.element.addClass("answer");
        solutionCell.element.addClass("solution");
        
        addAnsElement(answerCell,solutionCell);
        addSolElement(solutionCell);
    }

    /**
     * addAnsElement function adds tag and solution button to answerCell
     * @param {*} answerCell 
     * @param {*} solutionCell 
     */
    function addAnsElement(answerCell, solutionCell) {

        answerCell.element.prepend([
            '<div class="answerTag">',
            '   <h5>Answer: (Please input your answer here)</h5>',
            '</div>',
        ].join('\n'));

        //append a solution button
        answerCell.element.append([
            '<table class="question-btn-group">',
            '   <tr>',
            '        <th>',
            '            <button type="button" class="showSolutionBtn">Solution</button>',
            '       </th>',
            '   </tr>',
            '</table>'
        ].join('\n'));

        $(".showSolutionBtn").click(function () {
            showSolution(solutionCell, answerCell);
        });
    }

    /**
     * addSolElement function adds tag to solutionCell
     * @param {*} solutionCell 
     */
    function addSolElement(solutionCell) {
        solutionCell.element.prepend([
            '<div class="solutionTag">',
            '   <h5>Solution:</h5>',
            '</div>'
        ].join('\n'));
    }

    /**
     * showSolution function is the event when the solution button is clicked.
     * @param {*} solutionCell 
     * @param {*} answerCell 
     */
    function showSolution(solutionCell, answerCell) {
        if (solutionCell.metadata.groupNum === answerCell.metadata.groupNum){
            solutionCell.element.toggleClass('hidden');
        }

        // if the solution is_hidden, when user clicks the show solution button, it will run the answer cell automatically for users.
        if (solutionCell.metadata.is_hidden) {
            Jupyter.notebook.execute_cell(answerCell);
        };
        solutionCell.metadata.is_hidden = ! solutionCell.metadata.is_hidden;
        
    }

    /**
     * when the notebook page get refreshed or reloaded
     */
    function refreshPage() {
        Jupyter.notebook.get_cells().forEach(
            function (cell) {
                if (cell.metadata.type == "answer"){
                    var nextCell = Jupyter.notebook.get_next_cell(cell);
                    if (nextCell.metadata.type == "solution"){
                        addAnsElement(cell,nextCell)
                        addSolElement(nextCell)
                        nextCell.element.addClass('hidden',cell.metadata.is_hidden == true)
                    }
                }
            })
    }


    /********* Main Function *********/
    function load_ipython_extension() {
        // add css file
        $('<link rel="stylesheet" type="text/css">')
            .attr('href', requirejs.toUrl('./main.css'))
            .appendTo('head');

        // refresh/reload 
        events.on("notebook_loaded.Notebook", refreshPage);
        if (Jupyter.notebook !== undefined && Jupyter.notebook._fully_loaded) {
            refreshPage();
        }

        // register the button action 
        var buttonAction = Jupyter.keyboard_manager.actions.register({
            help: 'Turn into Short Answer Question Cell',
            icon: 'fa-question-circle',
            handler: create_question
        }, 'turn-to-sa-question-cell', 'Short Answer Question');

        // add the button to toolbar 
        Jupyter.toolbar.add_buttons_group([buttonAction]);
    };

    return {
        load_ipython_extension: load_ipython_extension
    };
});
    
    