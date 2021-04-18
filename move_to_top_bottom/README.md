# Move to top or bottom cell

Move to the top cell or move to the bottom cell

# Installation Process

First, download this and cd into the folder (here, dollar-sign represents the shell prompt):
```
$ cd nbextensions
```

Next, install them into --system, --sys-prefix, or --user:
```
$ jupyter nbextension install C:\Users\derek\Desktop\nbextension --user
```

And finally, enable the extensions you want:
```
$ jupyter nbextension enable nbextension/move_to_top_bottom/main
```

# Limitation
There should be no more than 1000 cells in your notebook. Otherwise, the move can only move 1000 cells once at a time, so you will need to click a couple more times.
