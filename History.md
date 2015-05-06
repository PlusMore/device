# v.next

## Refactoring:

### Code Quality Refactoring

#### Side effects eliminated

Any methods with side effects were modified to emit an event instead.
An event listener will listen, and trigger side effects in a decoupled manner.
We should strive to have 'side effect free' methods.

requestService - sends an email
makeReservation - sends an email, denormalizes some fields
cancelReservation - sends an email
addUserToStay - sends an email, updates user and stay, invalidates old stays
stayOver - changes stay, room, and user


# v0.11.1
- remove {validate: false} on inserts as it caused bugs

# v0.11
- Kadira implemented
- Room Service

# v0.10
- Hotel Services

# v0.9
- New layout with smooth scrolling
- Customizable background
- Ability to replace devices

# Earlier
Experiences
