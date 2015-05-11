var services = PlusMore.Services;

if (Meteor.isServer) {
  PlusMore.Services.EmailService = Cluster.discoverConnection('emailService');
}
