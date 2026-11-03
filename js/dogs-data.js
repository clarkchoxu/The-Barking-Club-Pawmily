/* ==========================================================
   dogs-data.js – EDIT THIS FILE to change your dogs.

   Each dog has:
     id          unique, lowercase, no spaces
     name        shown as the card title
     breed       shown under the name
     status      small badge, e.g. "Ready for rehoming" (optional)
     tags        any of: "best-seller", "recommended", "puppy"
                 (use [] for no tags)
     description short text shown on the card
     highlights  (optional) list of { title, text } shown when a
                 dog is tapped, like the points on your flyer
     care        (optional) short checklist shown when a dog is
                 tapped, e.g. "Complete deworming"
     images      list of image files in images/dogs/
                 The first image is the card photo; all of them
                 show when someone taps the dog.

   Leave out "highlights" and "care" for a dog and that part
   simply won't show. Copy the ones from Ruby below to add them.
   ========================================================== */

const DOGS = [
  {
    id: "enzo",
    name: "Enzo",
    breed: "DeepRed Poodle",
    //status: "Ready for rehoming",
    tags: [""],
    description:
      "Tiny in size, big in love. Sweet, playful, and full of charm. He learns new tricks quickly.",
            
        care: ["Complete 6-in-1 vaccination", "PCCI PAPERS" ],
    images: ["images/dogs/enzo-desc.jpg", "images/dogs/enzo-1.jpg", "images/dogs/enzo-3.jpg", "images/dogs/enzo-2.jpg"],
  },
  {
    id: "ruby",
    name: "Ruby",
    breed: "Teacup Poodle",
    //status: "Ready for rehoming",
    tags: ["puppy"],
    description:
      "Tiny in size, big in love. A loyal companion, a lifetime of love. Give this little one the loving home they deserve.",
    highlights: [
      { title: "Up-to-Date", text: "on Vaccines & Deworming" },
    ],
    care: ["Complete deworming", "2x 6-in-1 vaccine", "Vet checked & healthy", "PCCI on process"],
    images: ["images/dogs/ruby-desc.jpg", "images/dogs/ruby-1.jpg", "images/dogs/ruby-2.jpg", "images/dogs/ruby-3.jpg"],
  },
    {
    id: "theo",
    name: "Theo",
    breed: "Doll Face Shih Tzu",
    //status: "Ready for rehoming",
    tags: [],
    description:
      "Theo is sweet and cuddly. She is happy in an apartment and loves to curl up on your lap.",
     highlights: [
      { title: "Up-to-Date", text: "on Vaccines" },
    ],
        care: ["Complete vaccination"],
    images: ["images/dogs/theo-desc.jpg", "images/dogs/theo-2.jpg", "images/dogs/theo-3.jpg"],
  },
  {
    id: "king",
    name: "King",
    breed: "Teacup Parti Silver Poodle",
    //status: "Ready for rehoming",
    tags: ["recommended", "puppy"],
    description:
      "King is strong, goofy and loving. He does best with an active family and a fenced yard.",
        care: ["Complete 6-in-1 vaccination", "PCCI PAPERS" ],
    images: ["images/dogs/king-desc.jpg", "images/dogs/king-2.jpg", "images/dogs/king-3.jpg"],
  },
  {
    id: "henri",
    name: "Henri",
    breed: "Teacup Tricolor Chihuahua",
    //status: "Ready for rehoming",
    tags: [],
    description:
      "Henri is calm and affectionate. He is a wonderful companion for a quiet home and enjoys short, easy walks.",
      
        care: ["Complete 6-in-1 vaccination", "PCCI PAPERS", "Anti rabbies vaccination" ],
    images: ["images/dogs/henri-desc.jpg", "images/dogs/henri-2.jpg", "images/dogs/henri-3.jpg"],
  },
  {
    id: "hazel",
    name: "Hazel",
    breed: "Teacup Chihuahua",
    //status: "Ready for rehoming",
    tags: [],
    description:
      "Hazel is a bundle of joy with a big personality. She loves to explore and make new friends.",
            
        care: ["Complete 6-in-1 vaccination", "PCCI PAPERS", "Complete deworming" ],
    images: ["images/dogs/hazel-desc.jpg", "images/dogs/hazel-2.jpg", "images/dogs/hazel-3.jpg"],
  },
  {
    id: "charles",
    name: "Charles",
    breed: "Bichon Frise",
    //status: "Ready for rehoming",
    tags: [],
    description:
      "Charles is clever and lively. He learns fast, loves company and has a soft coat that needs regular grooming.",
      
        care: ["Complete 6-in-1 vaccination", "PCCI PAPERS", "Complete deworming" ],
    images: ["images/dogs/charles-desc.jpg", "images/dogs/charles-2.jpg", "images/dogs/charles-3.jpg"],
  },

    {
    id: "bentley",
    name: "Bentley",
    breed: "Regal Furry Shih Tzu",

    tags: [],
    description:
      "A compact-size male Shih Tzuwith a dollface and liver complexiorComes from a quality lineage.Sire is a white lavender fromRegal Furry Shih Tzu.",
   
        //care: ["Complete deworming", "2x 6-in-1 vaccine", "Vet checked & healthy", "PCCI on process"],
    images: ["images/dogs/bentley-1.jpg", "images/dogs/bentley-2.jpg", "images/dogs/bentley-3.jpg"],
    
    
  },

      {
    id: "blue",
    name: "Blue",
    breed: "LongCoat Chihuahua",

    tags: [],
    description:
      "A compact-size male Shih Tzuwith a dollface and liver complexiorComes from a quality lineage.Sire is a white lavender fromRegal Furry Shih Tzu.",
   
        //care: ["Complete deworming", "2x 6-in-1 vaccine", "Vet checked & healthy", "PCCI on process"],
    images: ["images/dogs/blue-1.jpg", "images/dogs/blue-2.jpg", "images/dogs/blue-3.jpg"],
    
    
  },


  {
    id: "ginger",
    name: "Ginger",
    breed: "IMPERIAL SHIH TZU",

    tags: [],
    description:
      "Ginger is friendly and full of energy. She follows her nose everywhere and loves a good game in the yard.",
       highlights: [
      { title: "Up-to-Date", text: "on Vaccines & Deworming" },
    ],
        care: ["Complete deworming", "2x 6-in-1 vaccine", "Vet checked & healthy", "PCCI on process"],
    images: ["images/dogs/ginger-1.jpg", "images/dogs/ginger-2.jpg", "images/dogs/ginger-3.jpg"],
    
    
  }
]
