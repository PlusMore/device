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
    case 'bellService': 
      return 'Bell Service';
    case 'houseKeeping': 
      return 'House Keeping';
    case 'wakeUpCall': 
      return 'Wake Up Call';
    case 'valetServices': 
      return 'Valet Services';
    case 'roomService':
      return 'Room Service';
    default: 
      return undefined;
  }
};