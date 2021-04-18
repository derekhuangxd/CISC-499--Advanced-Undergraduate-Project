
// This is an extension - you can move to the very top or the very bottom cell


define([
    'base/js/namespace',
    'jquery',
    'require',
    'base/js/events'
], function(Jupyter, $, requirejs, events, rubberband) {
    "use strict";

    var load_extension = function() {
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register ({
                'help'   : 'Move to top cell',
                'icon'   : 'fa-arrow-circle-up',
                'handler': function () {
                    for (var i=0; i<1000; i++){
                        Jupyter.notebook.select_prev();
                    }
                    // The below two steps are to ensure the page would also scroll to top afterwards
                    Jupyter.notebook.move_selection_down();
                    Jupyter.notebook.move_selection_up();
                }
            }),
            Jupyter.keyboard_manager.actions.register ({
                'help'   : 'Move to bottom cell',
                'icon'   : 'fa-arrow-circle-down',
                'handler': function () {
                    for (var i=0; i<1000; i++){
                        Jupyter.notebook.select_next();
                    }
                    // The below two steps are to ensure the page would also scroll to bottom afterwards
                    Jupyter.notebook.move_selection_up();
                    Jupyter.notebook.move_selection_down();
                }
            }),
        ]);
    };
    
    var extension = {
        load_ipython_extension : load_extension
    };
    return extension;


    if (parseFloat(Jupyter.version.substr(0, 3)) >= 4.2) {
        var add_cmd_shortcuts = {
            'Alt-down': {
                help: 'Move to bottom cell',
                help_index: 'ht',
                handler: function() { 
                    for (var i=0; i<1000; i++){
                        Jupyter.notebook.select_next();
                    }
                    // The below two steps are to ensure the page would also scroll to bottom afterwards
                    Jupyter.notebook.move_selection_up();
                    Jupyter.notebook.move_selection_down();
                }
            },
            'Alt-up': {
                help: 'Move to top cell',
                help_index: 'ht',
                handler: function() { 
                    for (var i=0; i<1000; i++){
                        Jupyter.notebook.select_prev();
                    }
                    // The below two steps are to ensure the page would also scroll to top afterwards
                    Jupyter.notebook.move_selection_down();
                    Jupyter.notebook.move_selection_up();
                }
            }
        }
    
    }


    function load_ipython_extension() {
        Jupyter.keyboard_manager.command_shortcuts.add_shortcuts(add_cmd_shortcuts);
        console.log("[move_selected_cells] loaded")
    }

    return {
        load_ipython_extension: load_ipython_extension,
    };

});
