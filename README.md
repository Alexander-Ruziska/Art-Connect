# Art Connect - Starting Repo
This version uses React, Zustand, Express, Passport, and PostgreSQL. (A full list of dependencies can be found in `package.json`.)

## Prerequisites
Before you get started, make sure you have the following software installed on your computer:

- [Node.js](https://nodejs.org/en)
- [PostgreSQL](https://www.postgresql.org)
- [Nodemon](https://nodemon.io)


## Initial Setup Instructions
- In this repo's **root directory**, run `npm install`.
- Create an `.env` file in the **root directory**, then paste this line into the file:
    ```plaintext
      SERVER_SESSION_SECRET=superDuperSecret
    ```
    - you will want to include your cloudinary api information (cloud name, api key and api secret)

- While you're in your new `.env` file, take the time to replace `superDuperSecret` with some a random string like `25POUbVtx6RKVNWszd9ERB9Bb6` to keep your application secure. 
    - Here's a site that can help you: [Password Generator Plus](https://passwordsgenerator.net).
    - If you skip this step, create a secret with less than eight characters, or leave it as `superDuperSecret`, you'll get a big warning message each time you start your server.


## Bugs/ issues within the app
- the edit profile button - when editing both the organization and artist profile if a user goes back to upload a profile photo, cover photo, or logo photo it will reset all of the prior inputed informtion (name, links, etc)

- there currently isn't a spot to fill in the user's soundcloud link (will need)

- Banned users will not be notified that they have been banned

- when uploading photos if the file is larger 10 mb it will sometimes give you an error that the file is too large.

- when a tall photo is uploaded to the user's cover photo. The image will come in but the will possibly be cut off without chance to adjust what is seen. This can be changed within the cloudinary code. We just have to make the update

- This isn't a bug but is something to look into simplifying - Making one cloudinary upload widget work for all upload slots instead of having four different components

***STRETCH GOALS***
[] Once an organization has been created make that user the admin of the page. Any other requests to join the organization will come through as a request for the admin to accept or reject.

[] Add Spotify

[] Add the organization to the users


***STRETCH GOALS***

