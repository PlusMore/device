HotelServices = new Meteor.Collection('hotelServices');

HotelServices.allow({
  insert: function(userId, doc){
    return false;
  },
  update:  function(userId, doc, fieldNames, modifier){
    return false;
  },
  remove:  function(userId, doc){
    return false;
  }
});

HotelServices.friendlyRequestType = function(requestType) {
  switch (requestType) {
    case 'transportation':
      return 'Transportation';
      break;
    case 'bellService': 
      return 'Bell Service';
      break;
    case 'houseKeeping': 
      return 'House Keeping';
      break;
    case 'wakeUpCall': 
      return 'Wake Up Call';
      break;
    case 'valetServices': 
      return 'Valet Services'
      break;
    default: 
      return 'Invalid Type';
      break;
  }
}