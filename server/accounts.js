Accounts.emailTemplates.siteName = "Plus More";
Accounts.emailTemplates.from = "noreply@plusmoretablets.com";
Accounts.emailTemplates.enrollAccount.subject = function(user) {
  return "Welcome to Plus More";
};
Accounts.emailTemplates.enrollAccount.text = function(user, url) {
  return "To activate your account, simply click the link below:\n\n" +
    url;
};