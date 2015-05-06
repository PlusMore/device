#Refactoring Required:

## Code Quality Refactoring

### Side effects

Any method with side effects should be modified to emit an event instead.
An event listener will listen, and trigger side effects in a decoupled manner.
We should strive to have 'side effect free' methods.

addUserToStay - sends an email, updates user and stay, invalidates old stays
requestService - sends an email, denormalizes some fields
makeReservation - sends an email, denormalizes some fields
cancelReservation - sends an email
stayOver - changes stay, room, and user



### Multiple Execution Paths

Sometimes required, but I think in general it is much better to put the decision
making on the ui.

setupDevice - based on field "replacementDevice" - UI should guide through decision


## Model Refactoring

###Order

Order is the largest thing to refactor, as it's currently serving many purposes:
Hotel Service Requests, Experience Reservations, and Guest UI.
