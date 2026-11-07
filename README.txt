

# The Barking Club Pawmily

Website for The Barking Club Pawmily, a family-owned kennel in Bocaue, Bulacan, Philippines.
It shows available dogs, our lovely puppy families, and lets visitors send an inquiry.

Built with plain HTML, CSS and JavaScript, with Firebase for the database and admin login.
There is no build step: the files are served as they are by GitHub Pages.

## Pages

| Page | What it does |
|---|---|
| `index.html` | Home page: recommended dogs and a few puppy family photos |
| `about.html` | About the kennel |
| `dogs.html` | All available dogs, with filters and a photo gallery |
| `clients.html` | Our Lovely Puppy Families photo gallery |
| `contact.html` | Call, text and Facebook links, plus an inquiry form |
| `admin.html` | Private admin page (sign-in required) |

## Folder structure

```
index.html, about.html, dogs.html, clients.html, contact.html, admin.html
css/
  styles.css
js/
  main.js              menu button and footer year
  dogs.js              loads dogs from Firebase and shows the cards and gallery
  dogs-data.js         backup copy of the dogs (used if Firebase can't be reached)
  clients.js           shows the puppy family photos
  clients-data.js      list of puppy family photos
  contact.js           inquiry form: checks fields and saves to Firebase
  admin.js             admin login, inquiries, and dog management
  firebase-config.js   Firebase connection settings
images/
  hero.jpg
  dogs/                dog photos
  clients/             puppy family photos
```

## How it works

- **Dogs** are stored in Firebase Firestore (`dogs` collection). The public pages read them when the page loads.
- **Inquiries** from the contact form are saved to Firestore (`inquiries` collection). Only the admin can read them.
- **Admin** signs in with Firebase Authentication (email and password).
- **Security** comes from the Firestore rules, not from hiding `admin.html`:
  - anyone can read dogs
  - anyone can send an inquiry
  - only the admin account can read inquiries or change dogs

## Everyday tasks

### Add, edit or delete a dog
1. Open `admin.html` and sign in.
2. Go to the **Dogs** tab.
3. Use **+ Add a new dog**, **Edit** or **Delete**.

Changes show on the website the next time a page is loaded. No upload to GitHub is needed.

### Add dog photos
Either:
- upload the photo to `images/dogs/` in this repository, then enter `images/dogs/name-1.jpg` in the admin form, or
- paste a full `https://` link to an image hosted elsewhere.

The first photo listed is the card photo.

### Read inquiries
Open `admin.html`, sign in, and use the **Inquiries** tab. New ones are highlighted.

### Add puppy family photos
1. Upload the photo to `images/clients/`.
2. Add a line for it in `js/clients-data.js`.

Always ask a family for permission before showing their photo.

## Running it on your computer

The site uses JavaScript modules, so opening the HTML file by double-clicking will not work. Use a local server:

- **VS Code:** install the Live Server extension, right-click `index.html`, choose **Open with Live Server**, or
- **Terminal:** run `python -m http.server 8000` in this folder and open `http://localhost:8000`.

## Publishing

The site is hosted with GitHub Pages:
**Settings → Pages → Deploy from a branch → `main` → `/ (root)`**.

After you upload changed files, allow 1 to 2 minutes for the site to update.

The site's address must also be listed in Firebase under
**Authentication → Settings → Authorized domains**, or admin login will not work.

## Firebase setup (for reference)

1. Create a Firebase project and register a web app.
2. Create a Firestore database and enable Email/Password sign-in.
3. Add the admin user under **Authentication → Users**.
4. Paste the web app config into `js/firebase-config.js`.
5. Publish the Firestore rules, using the admin's User UID in the `isAdmin()` check.
6. Open `admin.html`, go to **Dogs**, and use **Import my existing dogs** once to copy the dogs from `js/dogs-data.js` into the database.

## Security notes

- The Firebase web config in `js/firebase-config.js` is meant to be public. It identifies the project but does not give access to data. The Firestore rules protect the data.
- Never commit passwords, private keys or service account files to this repository.
- Use a strong, unique password for the admin account.

## Contact

- Phone / text: 0905 559 1764
- Facebook: The Barking Club Pawmily
- Location: Bocaue, Bulacan, Philippines
