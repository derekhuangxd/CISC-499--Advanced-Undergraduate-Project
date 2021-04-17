// file template/main.js

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
    
    //default template 
    var d = new Date();
    var modifiedDate = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();

    //////////////* Define the template HERE: *///////////////////////////////// 

    //option: 'code', 'markdown'
    var cellType = 'markdown';  
    //change your template content here
    var template = "## Chapter 1 \n #### " + modifiedDate + "\n ###### (This is a default template)"

    //////////////////////////////////////////////////////////////////////////////


    /**
     * The action that updated the selected cell as template content
     */
    var storeTemplateContent = function(){
        var cell = Jupyter.notebook.get_selected_cell(); //the selected cell
        cellType = cell.cell_type;
        template = cell.get_text();
        
        // Jupyter.notebook.get_cells().forEach(
        //     function (c) {
        //         if (c.metadata.is_template){ //delete current template cell if a template cell already exist
        //             Jupyter.notebook.delete_cell()
        //         }
        //     }
        // )

        // // insert a new template cell and hide it (so can make use of it next time when refresh the page)
        // Jupyter.notebook.insert_cell_below(cellType).set_text(template);
        // Jupyter.notebook.select_next();
        // var templateCell = Jupyter.notebook.get_selected_cell();

        // templateCell.metadata.is_template = true;

        // templateCell.element.addClass("hidden");

    };
    

    /**
     * The action that add template content after the selected cell.
     * If it is a new notebook contains only one empty cell, template cell will replace the current empty one.
     */
    var addTemplateCell = function () {

        // Jupyter.notebook.get_cells().forEach(
        //     function (c) {
        //         if (c.metadata.is_template) {
        //             cellType = c.cellType;
        //             template = c.get_text();
        //         }
        //     }
        // )

        Jupyter.notebook.insert_cell_below(cellType).set_text(template);

        if (cellType == "markdown") { 
            Jupyter.notebook.select_next();
            Jupyter.notebook.execute_cell();
            // Jupyter.notebook.select_next();
        }
        else {
            Jupyter.notebook.select_next();
        }
    };

    // var refresh = function () {
    //     Jupyter.notebook.get_cells().forEach(
    //         function (cell) {
    //             if (cell.metadata.is_template) {
    //                 cell.element.addClass("hidden")
    //             }
    //         }
    //     )
    // }

    // Add Button to the toolbar
    var createToolbarButton = function () {

        Jupyter.toolbar.add_buttons_group([
            // register 'store template content' button
            Jupyter.keyboard_manager.actions.register({
                'help': 'Store current cell as template',
                'icon': 'fa-archive',
                'handler': storeTemplateContent
            }, 'store-template-content', 'Store Template'),

            // register 'add template cell' button 
            Jupyter.keyboard_manager.actions.register({
                'help': 'Add template cell',
                'icon': 'fa-pencil',
                'handler': addTemplateCell
            }, 'add-template-cell', 'Add Template cell')
        ])
    };

    /********* Main Function *********/
    function load_ipython_extension() {

        createToolbarButton();
    }
    return {
        load_ipython_extension: load_ipython_extension
    };
});


