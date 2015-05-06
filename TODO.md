# TODO

## Refactoring

### Eliminate Side effects

addUserToStay - sends an email, updates user and stay, invalidates old stays
stayOver - changes stay, room, and user

### Eliminate Multiple Execution Paths

Sometimes required, but I think in general it is much better to put the decision
making on the ui.

setupDevice - based on field "replacementDevice" - UI should guide through decision

### Model Refactoring

#### Order

Order is the largest thing to refactor, as it's currently serving many purposes:
Hotel Service Requests, Experience Reservations, and Guest UI.
