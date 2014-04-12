/* ---------------------------------------------------- +/

## Items ##

All code related to the Items collection goes here.

/+ ---------------------------------------------------- */

Hotels = new Meteor.Collection('hotels', {
  schema: new SimpleSchema({
    name: {
      type: String,
      label: 'Name'
    },
    street: {
      type: String,
      max: 100
    },
    city: {
      type: String,
      max: 50
    },
    state: {
      type: String,
      regEx: /^A[LKSZRAEP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]$/
    },
    zip: {
      type: String,
      regEx: /^[0-9]{5}$/
    },
    phone: {
      type: String,
      label: 'Phone'
    }
  })
});

// Allow/Deny

Hotels.allow({
  insert: function(userId, doc){
    return Roles.userIsInRole(userId, ['admin']);
  },
  update:  function(userId, doc, fieldNames, modifier){
    return Roles.userIsInRole(userId, ['admin']);
  },
  remove:  function(userId, doc){
    return Roles.userIsInRole(userId, ['admin']);
  }
});
