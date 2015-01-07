# Plus More Device

## Installation

```
// Install dependencies
curl https://install.meteor.com | /bin/sh
npm install -g meteorite

// clone project
git clone https://github.com/PlusMore/device.git

// run project (ensure mongodb plusmore is running first)
cd device
make start
```

## Branching model
We follow this(http://nvie.com/posts/a-successful-git-branching-model/), but use pull requests instead of -no-ff merges. This is for peer code review and easy to find info on Github. 

With maintaining a qa-copy, dev-copy, an production copy, this just makes things easier, and having a common resource reduces the learning curve as some devs are already familiar with the pattern.

## Versioning
How do you know what version number you should be updating to?

http://semver.org/

MAJOR version when you make incompatible API changes,
MINOR version when you add functionality in a backwards-compatible manner, and
PATCH version when you make backwards-compatible bug fixes.

In an application, this generally means more of the following: 
MAJOR version when we decide it's time because the application changes in a significant way,
MINOR version when you add a feature, and
PATCH version when you make bug fixes.

Major version needs the most explanation. An example of when we might do it is if we were to make device into a thin wrapper for iframes, and separate different pages into multiple apps. Another reason might be to align with a business strategy. 


## File Structure

- **client**
	- **config**
	- **layouts**
		- **content**
		- **device**
			- **accounts**
			- **loader**
			- **nav**
			- deviceLayout.html
			- deviceLayout.js
			- deviceLayout.less
			- perspective-shift-layout.less
		- **lib**
		- menu-icon.js
		- router.js
	- **lib**
	- **style**
	- **views**
		- **account**
		- **enterCheckoutDate**
		- **experience**
		- **experiences**
		- **hotel-services**
		- **idle**
		- **orders**
		- **room-service**
		- **select-user**
		- **setup-device**
		- **shared**
		- **welcome**
	- main.html
	- main.js
- **collections**
	- cartItems.js
	- categories.js
	- devices.js
	- experiences.js
	- hotels.js
	- hotelServices.js
	- menuCategories.js
	- menuItems.js
	- orders.js
	- stays.js
	- users.js
	- yelp.js
- **config**
	- **development**
	- **productions**
	- **qa**
- **lib**
	- **config**
	- blazeExtensions.js
	- helpers.js
- **packages**
	- **accounts-plusmore-device**
	- **device-tinytests**
- **public**
	- **icons**
	- **images**
	- **markers**
- **resources**
	- **icons**
		- **android**
		- **ios**
	- **splash**
		- **android**
		- **ios**
- **router**
- **server**
	- accounts.js
	- publications.js