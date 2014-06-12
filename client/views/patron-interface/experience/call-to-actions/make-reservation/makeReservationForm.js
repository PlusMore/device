// Meteor.startup(function() {
//   AutoForm.hooks({
//     makeReservation: {
//       formToDoc: function(doc) {      
//         var dateval = $("#makeReservation").find('[name=date]').val();

//         if (dateval) {
//           timeMinutes = parseInt(doc.timeMinutes, 10);

//           if (timeMinutes) {
//             var m = moment(new Date(dateval)).startOf('day').minutes(timeMinutes);
//             if (m.isValid()) {
//               // before 6am - add day
//               if (doc.timeMinutes < (60*6)) {
//                 m.add('days', 1);
//               }
//               doc.dateDatetime = m.toDate();
//             }
//           }
//         }
        
//         return doc;
//       },
//       onSuccess: function(operation, result, template) {
//         Session.set('experienceState', 'complete');
//         AutoForm.resetForm('makeReservation');
//       },
//       onError: function(operation, error, template) {
//         console.log('onError');
//         if (error.error) {
//           Session.set('experienceState', 'error');
//           App.track('Submit Error', error);
//         }
//       }
//     }
//   });
// });