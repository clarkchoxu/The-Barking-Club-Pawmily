WHERE TO PUT YOUR PHOTOS
------------------------
images/hero.jpg            big photo at the top of the home page
images/team-1.jpg ... 3    team photos on the About page
images/clients/            one photo per client, named like the "id" in
                           js/clients-data.js, e.g. sarah-m.jpg
images/dogs/               dog photos, named like this:
    buddy-1.jpg  buddy-2.jpg  buddy-3.jpg
    daisy-1.jpg  daisy-2.jpg  daisy-3.jpg
    ...one set per dog (same names as the "id" in js/dogs-data.js)

The first dog photo (-1) is the picture on the dog's card.
All of a dog's photos show when someone taps the dog.

IMAGE SIZE (everything on the site uses the same shape)
-------------------------------------------------------
Shape:     4:3 landscape (wider than tall)
Size:      1200 x 900 pixels
Format:    .jpg
File size: under 300 KB each

The website crops every photo to 4:3 automatically, so all cards line
up. Photos that are not 4:3 still work, but the edges get cropped.
When taking photos, keep the dog's face in the middle and leave a
little space around it. Tall (portrait) phone photos lose the most.

Until a photo exists, the site shows a "Photo coming soon" placeholder.
